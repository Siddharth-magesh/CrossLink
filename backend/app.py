from flask import Flask, jsonify, request
import os
from os import path
from dotenv import load_dotenv
from flask_pymongo import PyMongo
from utils import EventManager , Authentication

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(path.join(basedir, ".env"))

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
app.config['MONGO_URI'] = os.environ.get('MONGO_URI')

mongo = PyMongo(app)
event_manager = EventManager(mongo)
authentication = Authentication(mongo)

@app.route('/')
def home():
    return jsonify({"message": "Welcome to CrossLink Backend!"})

@app.route('/api/add_event', methods=['POST'])
def add_event():
    event_data = request.get_json()
    return event_manager.add_event(event_data)

@app.route('/api/add_members',methods=['GET','POST'])
def add_members():
    data = request.get_json() if request.method == 'POST' else None
    return event_manager.add_members_to_event(data)

@app.route('/api/view_active_events',methods=['GET','POST'])
def view_active_events():
    return event_manager.fetch_events()

@app.route('/api/fetch_members', methods=['GET', 'POST'])
def fetch_members():
    filters = request.get_json() if request.method == 'POST' else None
    return event_manager.fetch_members(filters)

@app.route('/api/login', methods=['GET', 'POST'])
def login():
    user_details = request.get_json() if request.method == 'POST' else None
    auth_status = authentication.validate_authentication(user_details)
    if auth_status:
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401
    
@app.route('/api/fetch_admin_profile', methods=['POST'])
def fetch_admin_profile():
    user_details = request.get_json()
    result = authentication.fetch_admin_members(user_details)
    if result:
        name, email = result
        return jsonify({"name": name, "email": email}), 200
    else:
        return jsonify({"error": "User not found"}), 404

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
