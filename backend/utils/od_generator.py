from docxtpl import DocxTemplate
from datetime import datetime
from flask_pymongo import PyMongo
import os
import smtplib
from docx2pdf import convert
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
from .config import Config
import pythoncom

class ODGenerator:
    def __init__(self, mongo: PyMongo):
        self.mongo = mongo
        self.cred = Config()

    def generateOnDuty(self, data):
        ODname = data.get('ODname')
        today_date = data.get('today_date')
        subject = data.get('subject')
        body = data.get('body')
        event_date = data.get('event_date')
        place = data.get('place')
        timings = data.get('timings')
        download_format = data.get('download_format')

        template_path = "static/od_template.docx"
        doc = DocxTemplate(template_path)

        context = {
            "date": today_date,
            "subject": subject,
            "body": body,
            "event_date": event_date,
            "place": place,
            "timings": timings
        }

        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        base_filename = f"OD_{timestamp}"
        folder_path = os.path.join("static", "od_duty", today_date)
        os.makedirs(folder_path, exist_ok=True)

        docx_path = os.path.join(folder_path, f"{base_filename}.docx")
        doc.render(context)
        doc.save(docx_path)

        final_path = docx_path

        if download_format == "pdf":
            try:
                pythoncom.CoInitialize()
                pdf_path = os.path.join(folder_path, f"{base_filename}.pdf")
                convert(docx_path, pdf_path)
                final_path = pdf_path
            except Exception as e:
                print(f"PDF conversion failed, falling back to DOCX: {e}")
                final_path = docx_path

        try:
            self.mongo.db.onduty.insert_one({
                "name": ODname,
                "date": today_date,
                "path": final_path
            })
        except Exception as e:
            print(f"Failed to insert into MongoDB: {e}")

        return final_path

    def send_email_with_docx_attachment(self, subject, body, docx_path, recipient="siddharthmagesh007@gmail.com"):
        msg = MIMEMultipart()
        msg['Subject'] = subject
        msg['From'] = self.cred.BASE_MAIL_ADDRESS
        msg['To'] = recipient

        msg.attach(MIMEText(body, "html"))

        try:
            with open(docx_path, "rb") as f:
                docx = MIMEApplication(f.read(), _subtype='docx')
                docx.add_header('Content-Disposition', 'attachment', filename=os.path.basename(docx_path))
                msg.attach(docx)
        except Exception as e:
            print(f"Failed to attach DOCX: {e}")
            return

        try:
            with smtplib.SMTP(self.cred.MAIL_SERVER, self.cred.MAIL_PORT) as server:
                server.starttls()
                server.login(self.cred.MAIL_USERNAME, self.cred.MAIL_PASSWORD)
                server.sendmail(self.cred.BASE_MAIL_ADDRESS, recipient, msg.as_string())
            print(f"Email sent to {recipient}")
        except Exception as e:
            print(f"Failed to send email: {e}")

    def get_email_body(self, subject):
        return f"""
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
            <div style="max-width: 600px; margin: 20px auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <h2 style="text-align: center; color: #2c3e50;">Official OD Document </h2>
                <p>Hello Siddharth,</p>
                <p>Please find attached the official document for: <strong>{subject}</strong>.</p>
                <p>Warm regards,<br>Office</p>
            </div>
        </body>
        </html>
        """
