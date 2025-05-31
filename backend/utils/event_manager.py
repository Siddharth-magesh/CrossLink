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
from datetime import datetime
import pytz
import threading
import csv
import io

class EventManager:
    def __init__(self, mongo: PyMongo):
        self.mongo = mongo
        self.cred = Config()

    @staticmethod
    def extract_student_from_csv_row(row):
        try:
            name = f"{row.get('First Name', '').strip()} {row.get('Last Name or Surname', '').strip()}".strip()
            registration_number = row.get('Registeration Number (Eg: 11322307××××)', '').strip()
            email = row.get('Email ID (Note: Active Mail ID)', '').strip()
            yrc_id = row.get('YRC ID (Eg: 23YRC01)', '').strip()
            year = row.get('Year', '').strip()
            year = int(year) if year in ["1", "2", "3"] else None
            department = row.get('Department ', '').strip()
            blood_group = row.get('Blood Group', '').strip()
            mode_of_transport = row.get('Mode', '').strip()
            if not (name and registration_number and email):
                return None
            return {
                "name": name,
                "registration_number": registration_number,
                "email": email,
                "yrc_id": yrc_id,
                "year": year,
                "department": department,
                "blood_group": blood_group,
                "mode_of_transport": mode_of_transport
            }
        except Exception:
            return None

    def add_students_from_csv(self, file_storage):
        try:
            stream = io.StringIO(file_storage.stream.read().decode("UTF8"), newline=None)
            reader = csv.DictReader(stream)
            students = []
            for row in reader:
                student = self.extract_student_from_csv_row(row)
                if student:
                    students.append(student)
            if students:
                self.mongo.db.members.insert_many(students)
            return {"message": f"{len(students)} students added successfully"}, 200
        except Exception as e:
            return {"error": str(e)}, 500

    def send_event_message(self, data):
        try:
            event_id = data.get("event_id")
            eligible_years = data.get("eligible_years", [])

            if not event_id or not eligible_years:
                return

            # Fetch the event details
            event = self.mongo.db.events.find_one({"event_id": event_id})
            if not event:
                return

            # Format the event message
            message = (
                f"*New Event Announcement!*\n\n"
                f"*Event:* {event.get('event_name')}\n"
                f"*Date:* {event.get('event_date')}\n"
                f"*Time:* {event.get('event_start_time')} to {event.get('event_end_time')}\n"
                f"*Location:* [View Location]({event.get('event_location')})"
            )

            for year in eligible_years:
                group = self.mongo.db.group_chats.find_one({"year": year})
                if not group:
                    continue

                chat_message = {
                    "message_id": str(uuid.uuid4()),
                    "username": "YRC Admin",
                    "message": message,
                    "timestamp": datetime.utcnow().isoformat(),
                    "event_message": True,
                    "event_id": event_id
                }

                # Append the message to the chat array
                self.mongo.db.group_chats.update_one(
                    {"year": year},
                    {"$push": {"chat": chat_message}}
                )

        except Exception as e:
            print(f"Error in send_event_message: {str(e)}")

    def create_event_form(self, data):
        try:
            event_id = data.get("event_id")
            eligible_years = data.get("eligible_years", [])

            if not event_id or not eligible_years:
                return jsonify({"error": "Missing event_id or eligible_years"}), 400

            self.mongo.db.event_forms.insert_one({
                "event_id": event_id,
                "year": eligible_years,
                "registered_members": [],
                "form_status": True
            })

            self.send_event_message({
                "event_id": event_id,
                "eligible_years": eligible_years
            })

            return jsonify({
                "message": "Event added successfully!",
                "event": {
                    "event_id": event_id,
                    "eligible_years": eligible_years
                }
            }), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500

    def add_event(self, event_data):
        required_fields = [
            "event_name", "event_date", "event_start_time",
            "event_end_time", "event_location", "created_admin_id",
            "student_details", "event_status", "drive_link", "eligible_years"
        ]

        if not event_data:
            return {"error": "No data provided"}, 400

        for field in required_fields:
            if field not in event_data:
                return {"error": f"Missing field: {field}"}, 400

        try:
            unique_event_id = str(uuid.uuid4())
            event_data["event_id"] = unique_event_id

            # Convert eligible_years to a set of integers just in case
            event_data["eligible_years"] = list(map(int, event_data["eligible_years"]))

            self.mongo.db.events.insert_one(event_data)
            return {"event_id": unique_event_id}, 200
        except Exception as e:
            return {"error": str(e)}, 500

        
    def fetch_events(self,data):
        try:
            status = data.get("status")
            events = self.mongo.db.events.find({"event_status": status})
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
        
    def fetch_individual(self, data): 
        try:
            unique_id = data.get("unique_token")
            if not unique_id or "-" not in unique_id:
                return jsonify({"error": "Invalid token format"}), 400

            event_id, yrc_id = unique_id.rsplit("-", 1)

            member = self.mongo.db.members.find_one({"yrc_id": yrc_id})
            if not member:
                return jsonify({"error": "Member not found"}), 404

            student_info = {
                "event_id": event_id,
                "yrc_id": yrc_id,
                "name": member.get("name"),
                "year": member.get("year"),
                "department": member.get("department")
            }

            return jsonify({"student_info": student_info}), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500
        
    def fetch_individual_manual(self, data): 
        try:
            event_id = data.get("event_id")
            yrc_id = data.get("yrc_id")
            reg_no = data.get("registration_number")

            if not event_id or not (yrc_id or reg_no):
                return jsonify({"error": "Missing event ID or student identifier"}), 400

            query = {"yrc_id": yrc_id} if yrc_id else {"registration_number": reg_no}
            member = self.mongo.db.members.find_one(query)

            if not member:
                return jsonify({"error": "Member not found"}), 404

            student_info = {
                "event_id": event_id,
                "yrc_id": member.get("yrc_id"),
                "name": member.get("name"),
                "year": member.get("year"),
                "department": member.get("department")
            }

            return jsonify({"student_info": student_info}), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500


    def mark_attendence(self, data):
        try:
            event_id = data.get("event_id")
            yrc_id = data.get("yrc_id")
            status = data.get("status")

            if not all([event_id, yrc_id, status]):
                return jsonify({"error": "Missing required fields"}), 400

            events_collection = self.mongo.db.events

            event = events_collection.find_one({"event_id": event_id})
            if not event:
                return jsonify({"error": "Event not found"}), 404

            ist = pytz.timezone("Asia/Kolkata")
            timestamp = datetime.now(ist).strftime("%Y-%m-%d %H:%M:%S")

            if status.lower() == "present_time":
                update_query = {
                    "$set": {
                        "student_details.$.status": True,
                        "student_details.$.present_time": timestamp
                    }
                }
            elif status.lower() == "leaving_time":
                update_query = {
                    "$set": {
                        "student_details.$.status": True,
                        "student_details.$.leaving_time": timestamp
                    }
                }
            else:
                return jsonify({"error": "Invalid status value"}), 400

            result = events_collection.update_one(
                {"event_id": event_id, "student_details.yrc_id": yrc_id},
                update_query
            )

            if result.modified_count == 0:
                return jsonify({"error": "Attendance update failed"}), 404

            return jsonify({"message": "Attendance marked successfully"}), 200

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

            event = self.mongo.db.events.find_one({"event_id": event_id})
            if not event:
                return jsonify({"error": "Event not found"}), 404

            self.generate_emails(
                event_id,
                event.get("event_name"),
                event.get("event_date"),
                event.get("event_start_time"),
                event.get("event_end_time"),
                event.get("event_location"),
                yrc_members_id
            )

            return jsonify({"message": "Members added and emails sent successfully"}), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500

    def generate_qr_for_member(self, event_id, yrc_id, event_name):
        qr_data = f"{event_id}-{yrc_id}"
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(qr_data)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")

        qr_folder = "static/event_qr/"+f'{event_name}'
        os.makedirs(qr_folder, exist_ok=True)
        file_path = os.path.join(qr_folder, f"{event_id}-{yrc_id}.png")
        img.save(file_path)
        #print(f"Saved QR: {file_path} with data: {qr_data}")
        return file_path

    def send_email_with_attachment(self, subject, recipient, body, image_path, image_cid="event_qr"):
        msg = MIMEMultipart("related")
        msg['Subject'] = subject
        msg['From'] = self.cred.BASE_MAIL_ADDRESS
        msg['To'] = recipient

        msg_alternative = MIMEMultipart("alternative")
        msg.attach(msg_alternative)
        msg_alternative.attach(MIMEText(body, "html"))

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
            #print(f"Email sent to {recipient}")
        except Exception as e:
            print(f"Failed to send email to {recipient}: {e}")

    def generate_emails(self, event_id, event_name, event_date, event_start_time, event_end_time, event_location, member_ids):
        def process_member(member_id):
            member = self.mongo.db.members.find_one({"yrc_id": member_id})
            if not member:
                return
            email = member.get("email")
            name = member.get("name", "Member")
            qr_path = self.generate_qr_for_member(event_id, member_id, event_name)
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
                    <p>Please find your QR code attached to this email. Show it at the venue for attendance verification.</p>
                    <p>Warm regards,<br><strong>Youth Red Cross VEC</strong></p>
                </div>
            </body>
            </html>
            """
            self.send_email_with_attachment(subject, email, body, qr_path)

        threads = []
        for member_id in member_ids:
            t = threading.Thread(target=process_member, args=(member_id,))
            t.start()
            threads.append(t)
        # Not joining threads so API returns immediately

    def close_event(self, data):
        try:
            event_id = data.get("event_id", "")
            if not event_id:
                return jsonify({"error": "Missing event_id"}), 400

            result = self.mongo.db.events.update_one(
                {"event_id": event_id},
                {"$set": {"event_status": False}}
            )

            if result.modified_count == 0:
                return jsonify({"message": "No event found or already closed"}), 404

            return jsonify({"message": "Event closed successfully"}), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500

    def cleanup_expired_event_files(self):
        import shutil
        from datetime import datetime
        today = datetime.now().date()
        events = self.mongo.db.events.find()
        for event in events:
            event_date_str = event.get("event_date")
            event_name = event.get("event_name")
            if not event_date_str or not event_name:
                continue
            try:
                event_date = datetime.strptime(event_date_str, "%Y-%m-%d").date()
            except ValueError:
                continue
            # If today is after the event date
            if today > event_date:
                qr_folder = os.path.join("static", "event_qr", event_name)
                if os.path.exists(qr_folder):
                    shutil.rmtree(qr_folder)
                    print(f"Deleted QR folder for expired event: {qr_folder}")

    def view_event_form(self, data):
        if not data or 'event_id' not in data:
            return jsonify({"error": "Missing event_id"}), 400

        event_id = data['event_id']

        try:
            form_data = self.mongo.db.event_forms.find_one({"event_id": event_id})

            if not form_data:
                return jsonify({"error": "Event form not found"}), 404

            members = form_data.get("registered_members", [])

            if not members:
                return jsonify({"members": []}), 200

            # Return all relevant fields directly
            filtered_members = [
                {
                    "name": member.get("name", ""),
                    "year": member.get("year", ""),
                    "department": member.get("department", ""),
                    "mode_of_transport": member.get("mode_of_transport", "")
                }
                for member in members
            ]

            return jsonify({"members": filtered_members}), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500

    def close_event_form(self,data):
        try:
            event_id = data.get("event_id")
            if not event_id:
                return jsonify({"error": "Missing event_id"}), 400

            result = self.mongo.db.event_forms.update_one(
                {"event_id": event_id},
                {"$set": {"form_status": False}}
            )

            if result.modified_count == 0:
                return jsonify({"message": "No form found or already closed"}), 404

            return jsonify({"message": "Event form closed successfully"}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        
    def submit_event_form(self, data):
        try:
            event_id = data.get('event_id')
            reg_no = data.get('registration_number')

            if not event_id or not reg_no:
                return jsonify({"success": False, "message": "Missing event_id or registration_number"}), 400

            member_data = {
                "registration_number": reg_no,
                "name": data.get("name"),
                "year": data.get("year"),
                "department": data.get("department"),
                "mode_of_transport": data.get("mode_transport"),
                "address": data.get("address"),
                "number": data.get("number"),
                "emergency_contact": data.get("emergency_contact"),
                "timestamp": datetime.utcnow()
            }

            for key in ["name", "year", "department", "mode_transport", "address", "number", "emergency_contact"]:
                if not member_data.get(key):
                    return jsonify({"success": False, "message": f"Missing required field: {key}"}), 400

            result = self.mongo.db.event_forms.update_one(
                {"event_id": event_id},
                {"$push": {"registered_members": member_data}}
            )

            if result.matched_count == 0:
                return jsonify({"success": False, "message": "Event not found"}), 404

            return jsonify({"success": True, "message": "Form submitted successfully"})

        except Exception as e:
            print(f"Error in submit_event_form: {e}")
            return jsonify({"success": False, "message": "Internal server error"}), 500