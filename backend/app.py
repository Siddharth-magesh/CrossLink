from flask import Flask, jsonify, request , send_file
from flask_cors import CORS
import os
from os import path
from dotenv import load_dotenv
from flask_pymongo import PyMongo
from utils import EventManager , Authentication , ODGenerator , DriveManager

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(path.join(basedir, ".env"))

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
app.config['MONGO_URI'] = os.environ.get('MONGO_URI')

mongo = PyMongo(app)
event_manager = EventManager(mongo)
authentication = Authentication(mongo)
OnDutyGenerator = ODGenerator(mongo)
drivemanager = DriveManager(mongo)

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

@app.route('/api/view_events',methods=['GET','POST'])
def view_events():
    data = request.get_json() if request.method == 'POST' else None
    return event_manager.fetch_events(data)

@app.route('/api/fetch_event_details',methods=['GET','POST'])
def fetch_event_details():
    data = request.get_json() if request.method == 'POST' else None
    return event_manager.fetch_event_details(data)

@app.route('/api/fetch_individual_data',methods=['GET','POST'])
def fetch_individual_data():
    data = request.get_json() if request.method == 'POST' else None
    return event_manager.fetch_individual(data)

@app.route('/api/fetch_individual_data_manual',methods=['GET','POST'])
def fetch_individual_data_manual():
    data = request.get_json() if request.method == 'POST' else None
    return event_manager.fetch_individual_manual(data)

@app.route('/api/mark_attendence',methods=['GET','POST'])
def mark_attendence():
    data = request.get_json() if request.method == 'POST' else None
    return event_manager.mark_attendence(data)

@app.route('/api/fetch_members', methods=['GET', 'POST'])
def fetch_members():
    filters = request.get_json() if request.method == 'POST' else None
    return event_manager.fetch_members(filters)

@app.route('/api/close_events',methods=['GET','POST'])
def close_events():
    data = request.get_json() if request.method == 'POST' else None
    return event_manager.close_event(data)

@app.route('/api/login', methods=['GET', 'POST'])
def login():
    user_details = request.get_json() if request.method == 'POST' else None
    auth_status, auth_token , username = authentication.validate_authentication(user_details)
    
    if auth_status:
        return jsonify({
            "message": "Login successful",
            "token": auth_token,
            "username" : username
        }), 200
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
    
@app.route('/api/generate_od', methods=['POST'])
def generate_od():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    try:
        file_path = OnDutyGenerator.generateOnDuty(data)
        if not os.path.exists(file_path):
            return jsonify({"error": "OD file was not created"}), 500
        return send_file(
            file_path,
            as_attachment=True,
            download_name=os.path.basename(file_path),
            mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/fetch_onduty', methods=['POST'])
def fetch_onduty():
    return OnDutyGenerator.fetch_onduty()
    
@app.route('/api/download_onduty', methods=['POST'])
def download_onduty():
    data = request.get_json() if request.method == 'POST' else None
    return OnDutyGenerator.download_onduty(data)

@app.route('/api/delete_onduty', methods=['POST'])
def delete_onduty():
    data = request.get_json() if request.method == 'POST' else None
    return OnDutyGenerator.delete_onduty(data)

@app.route('/api/create_drive_folder', methods=['POST'])
def create_drive_folder():
    data = request.get_json()
    return drivemanager.create_folder(data)

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    return authentication.signup(data)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
