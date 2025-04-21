from google.oauth2 import service_account
from googleapiclient.discovery import build
from flask import jsonify
from flask_pymongo import PyMongo

class DriveManager:
    SERVICE_ACCOUNT_FILE = r'D:\CrossLink\backend\static\auth.json'
    SCOPES = ['https://www.googleapis.com/auth/drive']

    def __init__(self, mongo: PyMongo):
        self.credentials = service_account.Credentials.from_service_account_file(
            self.SERVICE_ACCOUNT_FILE, scopes=self.SCOPES
        )
        self.service = build('drive', 'v3', credentials=self.credentials)
        self.mongo = mongo

    def create_folder(self, data):
        try:
            event_name = data.get("event_name")
            if not event_name:
                return jsonify({"success": False, "error": "Missing event_name"}), 400

            events_collection = self.mongo.db.events
            event_doc = events_collection.find_one({"event_name": event_name})

            if not event_doc:
                return jsonify({"success": False, "error": "Event not found"}), 404

            if event_doc.get("drive_link"):
                return jsonify({
                    "success": True,
                    "message": "Drive folder already exists",
                    "folder_link": event_doc["drive_link"]
                }), 200

            folder_metadata = {
                'name': event_name,
                'mimeType': 'application/vnd.google-apps.folder'
            }

            folder = self.service.files().create(body=folder_metadata, fields='id').execute()
            folder_id = folder.get('id')
            print(f"Folder created with ID: {folder_id}")

            permission = {
                'type': 'anyone',
                'role': 'writer'
            }

            self.service.permissions().create(
                fileId=folder_id,
                body=permission,
                fields='id'
            ).execute()

            folder_link = f"https://drive.google.com/drive/folders/{folder_id}"
            print(f"Shareable Folder Link (Editor Access): {folder_link}")

            # Update the event document with the new link
            events_collection.update_one(
                {"_id": event_doc["_id"]},
                {"$set": {"drive_link": folder_link}}
            )

            return jsonify({
                "success": True,
                "folder_id": folder_id,
                "folder_link": folder_link
            }), 200

        except Exception as e:
            print(f"Error: {e}")
            return jsonify({
                "success": False,
                "error": str(e)
            }), 500
