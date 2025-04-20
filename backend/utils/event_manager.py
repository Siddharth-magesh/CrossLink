from flask import jsonify
from flask_pymongo import PyMongo
import uuid
import qrcode
import os
from .config import Config
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage

class EventManager:
    def __init__(self, mongo: PyMongo):
        self.mongo = mongo
        self.cred = Config()

    def add_event(self, event_data):
        required_fields = [
            "event_name", "event_date", "event_start_time",
            "event_end_time", "event_location", "created_admin_id", "student_details",
            "event_status"
        ]
        
        if not event_data:
            return jsonify({"error": "No data provided"}), 400

        for field in required_fields:
            if field not in event_data:
                return jsonify({"error": f"Missing field: {field}"}), 400

        try:
            event_data["event_id"] = str(uuid.uuid4()) 
            self.mongo.db.events.insert_one(event_data)
            return jsonify({"message": "Event added successfully!", "event": event_data}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        
    def fetch_events(self):
        try:
            events = self.mongo.db.events.find({"event_status": True})
            event_list = []

            for event in events:
                event["_id"] = str(event["_id"])
                event_list.append(event)

            return jsonify({"events": event_list}), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500
        
    def fetch_event_details(self,data):
        try:
            event_id = data.get("event_id")
            event_data = self.mongo.db.events.find_one({"event_id":event_id})

            return jsonify({"event data": event_data}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    def fetch_members(self, filters=None):
        try:
            if filters:
                members = self.mongo.db.members.find(filters)
            else:
                members = self.mongo.db.members.find()

            members_list = [member for member in members]
            return jsonify({"data": members_list}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    def add_members_to_event(self, data): 
        try:
            yrc_members_id = data.get("yrc_members_id", [])
            event_id = data.get("event_id")

            if not event_id or not isinstance(yrc_members_id, list):
                return jsonify({"error": "Invalid data"}), 400

            student_details = [
                {"yrc_id": yrc_id, "status": None, "present_time": None, "leaving_time": None}
                for yrc_id in yrc_members_id
            ]

            events_collection = self.mongo.db.events
            result = events_collection.update_one(
                {"event_id": event_id},
                {"$set": {"student_details": student_details}}
            )
            event_details = self.mongo.db.events.find_one({"event_id":event_id})
            event_name = event_details.get("event_name",None)
            event_date = event_details.get("event_date",None)
            event_start_time = event_details.get("event_start_time",None)
            event_end_time = event_details.get("event_end_time",None)
            event_location = event_details.get("event_location",None)
            image_path = self.generate_qr_from_strings(yrc_members_id,event_id)
            self.generate_emails(
                event_id,
                event_name,
                event_date,
                event_start_time,
                event_end_time,
                event_location,
                image_path
            )

            if result.matched_count == 0:
                return jsonify({"error": "Event not found"}), 404

            return jsonify({"message": "Members added successfully"}), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    def generate_qr_from_strings(self, member_list, event_id):
        if not member_list or not all(isinstance(s, str) for s in member_list):
            raise ValueError("Input must be a list of strings.")

        combined_text = "\n".join(member_list)
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(combined_text)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")

        qr_folder = "backend/static/event_qr"
        os.makedirs(qr_folder, exist_ok=True)

        file_path = os.path.join(qr_folder, f"{event_id}.png")
        img.save(file_path)
        print(f"QR code saved to '{file_path}' and contains:\n{combined_text}")
        return file_path

    def send_email_with_attachment(self, subject, recipient, body, image_path, image_cid="event_qr"):
        msg = MIMEMultipart("related")
        msg['Subject'] = subject
        msg['From'] = self.cred.BASE_MAIL_ADDRESS
        msg['To'] = recipient

        msg_alternative = MIMEMultipart("alternative")
        msg.attach(msg_alternative)

        msg_text = MIMEText(body, "html")
        msg_alternative.attach(msg_text)

        try:
            with open(image_path, "rb") as img_file:
                img = MIMEImage(img_file.read())
                img.add_header('Content-ID', f'<{image_cid}>')
                img.add_header('Content-Disposition', 'inline', filename='event_qr.png')
                msg.attach(img)
        except Exception as e:
            print(f"Failed to attach image: {e}")

        try:
            with smtplib.SMTP(self.cred.MAIL_SERVER, self.cred.MAIL_PORT) as server:
                server.starttls()
                server.login(self.cred.MAIL_USERNAME, self.cred.MAIL_PASSWORD)
                server.sendmail(self.cred.BASE_MAIL_ADDRESS, recipient, msg.as_string())
            print(f"Email sent to {recipient}")
        except Exception as e:
            print(f"Failed to send email to {recipient}: {e}")

    def generate_emails(self, event_id, event_name, event_date, event_start_time, event_end_time, event_location, image_path):
        member_ids = [member["yrc_id"] for member in self.mongo.db.events.find_one({"event_id": event_id}).get("student_details", [])]
        print(member_ids)

        for member_id in member_ids:
            member = self.mongo.db.members.find_one({"yrc_id": member_id})
            if not member:
                continue

            email = member.get("email")
            name = member.get("name", "Member")

            subject = f"You're Invited: {event_name}"
            body = f"""
            <!DOCTYPE html>
            <html>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
                <div style="max-width: 600px; margin: 20px auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <h2 style="text-align: center; color: #2c3e50;">You're Invited to {event_name} 🎉</h2>
                    <p>Dear {name},</p>
                    <p>We are excited to invite you to the upcoming event. Below are the details:</p>
                    <ul>
                        <li><strong>Date:</strong> {event_date}</li>
                        <li><strong>Start Time:</strong> {event_start_time}</li>
                        <li><strong>End Time:</strong> {event_end_time}</li>
                        <li><strong>Location:</strong> {event_location}</li>
                    </ul>
                    <p>We look forward to seeing you at the event! If you have any questions, feel free to reach out.</p>
                    <p>Warm regards,<br><strong>LifeConnect Team</strong></p>
                </div>
            </body>
            </html>
            """
            try:
                self.send_email_with_attachment(subject, email, body, image_path)
            except Exception as e:
                print(f"Failed to send email to {email}: {e}")