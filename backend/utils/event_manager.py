from flask import jsonify
from flask_pymongo import PyMongo

class EventManager:
    def __init__(self, mongo: PyMongo):
        self.mongo = mongo

    def add_event(self, event_data):
        """Add an event to the database."""
        required_fields = [
            "event_name", "event_date", "event_start_time",
            "event_end_time", "event_location", "created_admin_id", "student_details"
        ]
        
        if not event_data:
            return jsonify({"error": "No data provided"}), 400

        for field in required_fields:
            if field not in event_data:
                return jsonify({"error": f"Missing field: {field}"}), 400

        try:
            self.mongo.db.events.insert_one(event_data)
            return jsonify({"message": "Event added successfully!", "event": event_data}), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    def fetch_members(self, filters=None):
        """Fetch members with optional filters."""
        try:
            if filters:
                members = self.mongo.db.members.find(filters)
            else:
                members = self.mongo.db.members.find()

            members_list = [member for member in members]
            return jsonify({"data": members_list}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
