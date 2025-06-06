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
        
    def get_event_group_details(self, data):
        try:
            token = data.get('token')
            if not token:
                return jsonify({'error': 'Missing token'}), 400

            user = self.mongo.db.members.find_one({'registration_number': token})
            if not user:
                return jsonify({'error': 'User not found'}), 404

            groups = user.get('event_groups', [])
            return jsonify({'event_groups': groups}), 200

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
    
    def get_event_chat_messages(self, data):
        registration_number = data.get("registration_number")
        if not registration_number:
            return jsonify({"error": "registration_number is required"}), 400

        member = self.mongo.db.members.find_one({"registration_number": registration_number})
        if not member:
            return jsonify({"error": "Member not found"}), 404

        allocated_groups = member.get("event_groups", [])
        group_ids = [group['group_id'] for group in allocated_groups]

        if not group_ids:
            return jsonify({"chat": []})
        
        chats = []
        for gid in group_ids:
            group_chat = self.mongo.db.event_chats.find_one({"group_id": gid})
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

    def add_event_chat_message(self, data):
        try:
            registration_number = data.get('registration_number')
            message = data.get('message')

            if not registration_number or not message:
                return jsonify({'error': 'Missing required fields'}), 400

            user = self.mongo.db.members.find_one({'registration_number': registration_number})
            if not user:
                return jsonify({'error': 'User not found'}), 404

            allocated_groups = user.get('event_groups', [])
            if not allocated_groups:
                return jsonify({'error': 'User has no allocated groups'}), 400

            group_id = allocated_groups[0]['group_id']

            chat_message = {
                "message_id": str(uuid.uuid4()),
                "username": registration_number,
                "message": message,
                "timestamp": datetime.utcnow().isoformat(),
            }

            result = self.mongo.db.event_chats.update_one(
                {'group_id': group_id},
                {'$push': {'chat': chat_message}}
            )

            if result.matched_count == 0:
                return jsonify({'error': 'Group not found'}), 404

            return jsonify({'success': True, 'message': 'Message sent successfully'}), 200

        except Exception as e:
            print("Error in add_chat_message:", e)
            return jsonify({'error': 'Internal server error'}), 500
        
    
    def fetch_user_details(self, data):
        try:
            registration_number = data.get('registration_number')
            if not registration_number:
                return jsonify({'error': 'Missing registration number'}), 400

            user = self.mongo.db.members.find_one({'registration_number': registration_number})
            if not user:
                return jsonify({'error': 'User not found'}), 404

            user_details = {
                'yrc_id': user.get('yrc_id', ''),
                'registration_number': user.get('registration_number', ''),
                'email': user.get('email', ''),
                'name': user.get('name', ''),
                'designation': user.get('desgination', ''),
                'year': user.get('year', ''),
                'department': user.get('department', ''),
                'section': user.get('section', ''),
                'mobile_number': user.get('mobile_number', ''),
                'secondary_mobile_number': user.get('secondary_mobile_number', ''),
                'blood_group': user.get('blood_group', ''),
                'mode_of_transport': user.get('mode_of_transport', ''),
                'address': user.get('address', ''),
                'date_of_birth': user.get('date_of_birth', ''),
                'events_attended': user.get('events_attended', 0),
                'allocated_groups': user.get('allocated_groups', []),
                'event_groups': user.get('event_groups', [])
            }

            return jsonify({'user_details': user_details}), 200

        except Exception as e:
            print("Error in fetch_user_details:", e)
            return jsonify({'error': 'Internal server error'}), 500

    def update_user_details(self, data):
        try:
            registration_number = data.get('registration_number')
            if not registration_number:
                return jsonify({'error': 'Missing registration number'}), 400

            user = self.mongo.db.members.find_one({'registration_number': registration_number})
            if not user:
                return jsonify({'error': 'User not found'}), 404

            # Filter out fields to update: skip None, empty strings, or unchanged values
            update_fields = {}
            for k, v in data.items():
                if k == 'registration_number':
                    continue
                if v is not None and v != '' and (k not in user or user[k] != v):
                    update_fields[k] = v

            if not update_fields:
                return jsonify({'error': 'No valid fields to update'}), 400

            result = self.mongo.db.members.update_one(
                {'registration_number': registration_number},
                {'$set': update_fields}
            )

            if result.modified_count > 0:
                return jsonify({'success': True, 'message': 'User details updated successfully'}), 200
            else:
                return jsonify({'error': 'No changes made (fields may already be up to date)'}), 400

        except Exception as e:
            print("Error in update_user_details:", e)
            return jsonify({'error': 'Internal server error'}), 500

