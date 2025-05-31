from flask import jsonify
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash

class Authentication:
    def __init__(self, mongo: PyMongo):
        self.mongo = mongo

    def validate_authentication(self, userData):
        try:
            if not userData or "registration_number" not in userData or "password" not in userData:
                return (False, None, None)
            
            registration_number = userData["registration_number"]
            password = userData["password"]
            if not registration_number or not password:
                return (False, None, None)
            
            user = self.mongo.db.admin_members.find_one({"registration_number": registration_number})

            username = user.get("name", None) if user else None

            if not user or not check_password_hash(user.get("password", ""), password):
                return (False, None, None)
            return (True, registration_number, username)
    
        except Exception as e:
            print(f"Authentication error: {e}")
            return (False, None, None)

    def validate_user_authentication(self, userData):
        try:
            if not userData or "registration_number" not in userData or "password" not in userData:
                return (False, None, None)
            
            registration_number = userData["registration_number"]
            password = userData["password"]
            if not registration_number or not password:
                return (False, None, None)
            
            user = self.mongo.db.members.find_one({"registration_number": registration_number})
            print(f"User found: {user}")
            username = user.get("name", None) if user else None
            print(f"Username: {username}")

            if not user or not check_password_hash(user.get("password", ""), password):
                return (False, None, None)
            return (True, registration_number, username)
    
        except Exception as e:
            print(f"User authentication error: {e}")
            return (False, None, None)
    
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

    def signup(self, data):
        try:
            registration_number = data.get('registration_number')
            name = data.get('name')
            password = data.get('password')
            email = data.get('email')

            if not all([registration_number, name, password, email]):
                return jsonify({"error": "All fields are required"}), 400

            # Check if user already exists
            if self.mongo.db.admin_members.find_one({"registration_number": registration_number}):
                return jsonify({"error": "User already exists"}), 409

            # Save user (hashed password)
            hashed_password = generate_password_hash(password)
            self.mongo.db.admin_members.insert_one({
                "registration_number": registration_number,
                "name": name,
                "password": hashed_password,
                "email": email
            })

            return jsonify({"message": "Signup successful"}), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 500