from flask import Flask, jsonify, request
import os
from os import environ, path
from dotenv import load_dotenv
from flask_pymongo import PyMongo

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(path.join(basedir,".env"))

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
app.config['MONGO_URI'] = os.environ.get('MONGO_URI')

# MongoDB connection
mongo = PyMongo(app)

@app.route('/')
def home():
    return jsonify({"message": "Welcome to CrossLink Backend!"})

@app.route('/api/add_event', methods=['POST'])
def add_event():
    """ event_data (example)=
    {"event_name": "Bride Project",
    "event_date": "11-03-2025",
    "event_start_time": "9:00",
    "event_end_time": "4:00",
    "event_location":"Redhills",
    "created_admin_id":"YRCADMIN237",
    "student_details":[]  # array of student YRC id
} """
    event_data = request.get_json()
    if not event_data:
        return jsonify({"error": "No data provided"}), 400
    
    required_fields = ["event_name", "event_date", "event_start_time", "event_end_time", "event_location", "created_admin_id", "student_details"]
    for field in required_fields:
        if field not in event_data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    try:
        mongo.db.events.insert_one(event_data)
        return jsonify({"message": "Event added successfully!", "event": event_data}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/fetch_members', methods=['GET','POST'])
def fetch_members():
    if request.method == 'POST':
        filters = request.get_json()
        if not filters:
            return jsonify({"error": "No filters provided"}), 400
        members = mongo.db.members.find(filters)
        members_list = [member for member in members]
        return jsonify({"data":members_list}), 200
    else:
        members = mongo.db.members.find()
        members_list = [member for member in members]
        return jsonify({"data": members_list}), 200

if __name__ == '__main__':
    app.run(debug=True)
