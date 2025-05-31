from flask import jsonify
from flask_pymongo import PyMongo
from .config import Config

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
