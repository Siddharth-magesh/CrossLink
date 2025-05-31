from flask import jsonify
from flask_pymongo import PyMongo
from .config import Config
from datetime import datetime
import uuid

class MemberManager:
    def __init__(self, mongo: PyMongo):
        self.mongo = mongo
        self.cred = Config()

    def get_main_group_details(self, data):
        try:
            token = data.get('token')
            if not token:
                return jsonify({'error': 'Missing token'}), 400

            user = self.mongo.db.members.find_one({'registration_number': token})
            if not user:
                return jsonify({'error': 'User not found'}), 404

            groups = user.get('allocated_groups', [])
            group_names = [group.get('group_name') for group in groups]

            return jsonify({'groups': group_names}), 200

        except Exception as e:
            return jsonify({'error': str(e)}), 500
        
    def get_chat_messages(self, data):
        registration_number = data.get("registration_number")
        if not registration_number:
            return jsonify({"error": "registration_number is required"}), 400

        member = self.mongo.db.members.find_one({"registration_number": registration_number})
        if not member:
            return jsonify({"error": "Member not found"}), 404

        allocated_groups = member.get("allocated_groups", [])
        group_ids = [group['group_id'] for group in allocated_groups]

        if not group_ids:
            return jsonify({"chat": []})
        
        chats = []
        for gid in group_ids:
            group_chat = self.mongo.db.group_chats.find_one({"group_id": gid})
            if group_chat and "chat" in group_chat:
                chats.extend(group_chat["chat"])

        chats.sort(key=lambda msg: msg.get("timestamp", ""), reverse=False)

        return jsonify({"chat": chats})
    
    def add_chat_message(self, data):
        try:
            registration_number = data.get('registration_number')
            message = data.get('message')

            if not registration_number or not message:
                return jsonify({'error': 'Missing required fields'}), 400

            user = self.mongo.db.members.find_one({'registration_number': registration_number})
            if not user:
                return jsonify({'error': 'User not found'}), 404

            allocated_groups = user.get('allocated_groups', [])
            if not allocated_groups:
                return jsonify({'error': 'User has no allocated groups'}), 400

            group_id = allocated_groups[0]['group_id']

            chat_message = {
                "message_id": str(uuid.uuid4()),
                "username": registration_number,
                "message": message,
                "timestamp": datetime.utcnow().isoformat(),
                "event_message": False
            }

            result = self.mongo.db.group_chats.update_one(
                {'group_id': group_id},
                {'$push': {'chat': chat_message}}
            )

            if result.matched_count == 0:
                return jsonify({'error': 'Group not found'}), 404

            return jsonify({'success': True, 'message': 'Message sent successfully'}), 200

        except Exception as e:
            print("Error in add_chat_message:", e)
            return jsonify({'error': 'Internal server error'}), 500

