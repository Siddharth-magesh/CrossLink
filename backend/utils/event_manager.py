from flask import jsonify
from flask_pymongo import PyMongo
import uuid

class EventManager:
    def __init__(self, mongo: PyMongo):
        self.mongo = mongo

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

            if result.matched_count == 0:
                return jsonify({"error": "Event not found"}), 404

            return jsonify({"message": "Members added successfully"}), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500
