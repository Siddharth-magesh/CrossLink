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

    def send_forum_query(self, data):
        try:
            if not data or 'userId' not in data:
                return jsonify({'error': 'Missing user ID or request data'}), 400

            forum_data = {
                'request_id': str(uuid.uuid4()),
                'user_id': data.get('userId'),
                'category': data.get('category'),
                'subject': data.get('subject', ''),
                'description': data.get('description'),
                'phone_number': data.get('phone_number', ''),
                'preferred_contact_time': data.get('preferred_contact_time', ''),
                'email': data.get('email', ''),
                'anonymous': data.get('anonymous', False),
                'additional_notes': data.get('additional_notes', ''),
                'status': False,
                'managed_admin_id': None,
                'response_notes': None,
                'submitted_at': datetime.utcnow()
            }

            self.mongo.db.student_forum.insert_one(forum_data)

            return jsonify({
                'message': 'Your request has been successfully sent to the authorities. You will be contacted via your provided phone number.'
            }), 200

        except Exception as e:
            print("Error in send_forum_query:", e)
            return jsonify({
                'error': 'Failed to send your query. Please reach out to one of the core members directly.'
            }), 500
        
    def student_grievances(self, data):
        try:
            grievances = list(self.mongo.db.student_forum.find({'status': False}))

            for g in grievances:
                g['_id'] = str(g['_id'])

                if 'submitted_at' in g and isinstance(g['submitted_at'], datetime):
                    g['submitted_at'] = g['submitted_at'].isoformat()

                if not g.get('anonymous', False):
                    user_id = g.get('user_id')
                    student = self.mongo.db.members.find_one({'registration_number': user_id})
                    if student:
                        g['student_name'] = student.get('name', 'N/A')
                        g['year'] = student.get('year', 'N/A')
                        g['department'] = student.get('department', 'N/A')
                    else:
                        g['student_name'] = 'Unknown'
                        g['year'] = 'Unknown'
                        g['department'] = 'Unknown'

            return jsonify(grievances), 200

        except Exception as e:
            return jsonify({'error': 'Unable to fetch grievances at this time. Please try again later.'}), 500


    def update_student_grievances(self, data):
        try:
            request_id = data.get('request_id')
            managed_admin_id = data.get('managed_admin_id')
            response_notes = data.get('response_notes')

            if not request_id:
                return jsonify({'error': 'Missing request_id'}), 400

            result = self.mongo.db.student_forum.update_one(
                {'request_id': request_id},
                {
                    '$set': {
                        'status': True,
                        'managed_admin_id': managed_admin_id,
                        'response_notes': response_notes,
                        'closed_date_time': datetime.utcnow()
                    }
                }
            )

            if result.matched_count == 0:
                return jsonify({'error': 'No grievance found with the given request_id'}), 404

            return jsonify({'message': 'Grievance closed and response recorded successfully'}), 200

        except Exception as e:
            return jsonify({'error': 'Unable to manage grievances at this time. Please try again later.'}), 500

    def get_students_lists(self, data):
        try:
            query = {}

            if data:
                year = data.get('year')
                department = data.get('department')

                if year:
                    query['year'] = int(year)
                if department:
                    query['department'] = department

            students_cursor = self.mongo.db.members.find(query)

            students = []
            for student in students_cursor:
                student['_id'] = str(student['_id'])
                students.append(student)

            return jsonify(students), 200

        except Exception as e:
            print("Error fetching students:", e)
            return jsonify({'error': 'Unable to fetch student lists at this time. Please try again later.'}), 500

    def extract_particular_student(self, data):
        if not data or 'registration_number' not in data:
            return jsonify({'error': 'Registration number is required'}), 400

        registration_number = data.get('registration_number')

        student = self.mongo.db.members.find_one(
            {'registration_number': registration_number},
            {'_id': 0}
        )

        if not student:
            return jsonify({'error': 'Student not found'}), 404

        return jsonify(student), 200

    def update_student_record(self, data):
        if not data or 'registration_number' not in data:
            return jsonify({'error': 'Registration number is required'}), 400

        reg_no = data['registration_number']
        update_data = data.copy()
        del update_data['registration_number']

        result = self.mongo.db.members.update_one(
            {'registration_number': reg_no},
            {'$set': update_data}
        )

        if result.matched_count == 0:
            return jsonify({'error': 'Student not found'}), 404

        return jsonify({'message': 'Student record updated successfully'}), 200
    
    def delete_student_record(self, data):
        if not data or 'registration_number' not in data:
            return jsonify({'error': 'Registration number is required'}), 400

        reg_no = data['registration_number']

        student = self.mongo.db.members.find_one({'registration_number': reg_no})
        if not student:
            return jsonify({'error': 'Student not found'}), 404

        self.mongo.db.student_archive.insert_one(student)
        
        result = self.mongo.db.members.delete_one({'registration_number': reg_no})

        return jsonify({'message': 'Student record archived and deleted successfully'}), 200


