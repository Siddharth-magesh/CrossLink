from flask import jsonify
from flask_pymongo import PyMongo

class Authentication:
    def __init__(self, mongo: PyMongo):
        self.mongo = mongo

    def validate_authentication(self, userData):
        try:
            if not userData or "registration_number" not in userData or "password" not in userData:
                return (False, None)
            
            registration_number = userData["registration_number"]
            password = userData["password"]
            if not registration_number or not password:
                return (False, None)
            
            user = self.mongo.db.admin_members.find_one({"registration_number": registration_number})

            username = user.get("name",None)

            if not user or user.get("password") != password:
                return (False, None)
            return (True, registration_number, username)
    
        except Exception as e:
            print(f"Authentication error: {e}")
            return (False, None)

    
    def fetch_admin_members(self, user_data):
        try:
            if not user_data or "username" not in user_data:
                return False
            username = user_data["username"].strip()
            if not username:
                return False
            user_details = self.mongo.db.admin_members.find_one({"username": username})
            if user_details:
                return user_details.get("name", ""), user_details.get("email", "")
            return False
        
        except Exception as e:
            print(f"Error in fetch_admin_members: {e}")
            return False
