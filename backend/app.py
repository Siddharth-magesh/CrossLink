from flask import Flask, jsonify, request , send_file
from flask_cors import CORS
import os
from os import path
from dotenv import load_dotenv
from flask_pymongo import PyMongo
from utils import EventManager , Authentication , ODGenerator , DriveManager , MemberManager

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(path.join(basedir, ".env"))

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
app.config['MONGO_URI'] = os.environ.get('MONGO_URI')

def initialize_collections(mongo):
    required_collections = [
        "admin_members",
        "event_chats",
        "event_forms",
        "events",
        "group_chats",
        "members",
        "onduty",
        "student_forum"
    ]
    db = mongo.db
    existing_collections = db.list_collection_names()
    for collection in required_collections:
        if collection not in existing_collections:
            db.create_collection(collection)

mongo = PyMongo(app)
initialize_collections(mongo)
event_manager = EventManager(mongo)
authentication = Authentication(mongo)
OnDutyGenerator = ODGenerator(mongo)
drivemanager = DriveManager(mongo)
memberManager = MemberManager(mongo)

event_manager.cleanup_expired_event_files()

# Home Route

@app.route('/')
def home():
    return jsonify({"message": "Welcome to CrossLink Backend!"})

# Authentication 

@app.route('/api/user_signup', methods=['POST'])
def user_signup():
    data = request.get_json()
    return authentication.user_signup(data)

@app.route('/api/admin_signup', methods=['POST'])
def admin_signup():
    data = request.get_json()
    return authentication.admin_signup(data)

@app.route('/api/admin_login', methods=['GET', 'POST'])
def admin_login():
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

@app.route('/api/user_login', methods=['POST'])
def user_login():
    user_data = request.get_json() if request.method == 'POST' else None    
    auth_status, registration_number, username = authentication.validate_user_authentication(user_data)
    
    if auth_status:
        return jsonify({
            "message": "Login successful",
            "token": registration_number,
            "username": username
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

# Event Management

@app.route('/api/add_event', methods=['POST'])
def add_event():
    event_data = request.get_json()
    result, status = event_manager.add_event(event_data)

    if status != 200:
        return jsonify(result), status

    return event_manager.create_event_form({
        "event_id": result["event_id"],
        "eligible_years": event_data["eligible_years"]
    })

@app.route('/api/add_members', methods=['POST'])
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

@app.route('/api/close_events',methods=['GET','POST'])
def close_events():
    data = request.get_json() if request.method == 'POST' else None
    return event_manager.close_event(data)

@app.route('/api/view_event_form', methods=['POST'])
def view_event_form():
    data = request.get_json() if request.method == 'POST' else None
    return event_manager.view_event_form(data)

@app.route('/api/submit_form', methods=['POST'])
def submit_form():
    data = request.get_json() if request.method == 'POST' else None
    return event_manager.submit_event_form(data)

@app.route('/api/close_form', methods=['POST'])
def close_form():
    data = request.get_json() if request.method == 'POST' else None
    return event_manager.close_event_form(data)

@app.route('/api/form_status', methods=['POST'])
def form_status():
    data = request.get_json() if request.method == 'POST' else None
    return event_manager.event_form_status(data)

# Student Management

@app.route('/api/upload_members_data', methods=['POST'])
def upload_members_data():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if not file.filename.endswith('.csv'):
        return jsonify({"error": "File is not a CSV"}), 400
    result, status = event_manager.add_students_from_csv(file)
    return jsonify(result), status

@app.route('/api/fetch_members', methods=['GET', 'POST'])
def fetch_members():
    filters = request.get_json() if request.method == 'POST' else None
    return event_manager.fetch_members(filters)

@app.route('/api/student_grievances', methods=['POST','GET'])
def student_grievances():
    data = request.get_json() if request.method == 'POST' else None
    return memberManager.student_grievances(data)

@app.route('/api/close_grievance', methods=['POST','GET'])
def close_grievance():
    data = request.get_json() if request.method == 'POST' else None
    return memberManager.update_student_grievances(data)

# Attendance

@app.route('/api/mark_attendence',methods=['GET','POST'])
def mark_attendence():
    data = request.get_json() if request.method == 'POST' else None
    return event_manager.mark_attendence(data)

@app.route('/api/fetch_individual_data',methods=['GET','POST'])
def fetch_individual_data():
    data = request.get_json() if request.method == 'POST' else None
    return event_manager.fetch_individual(data)

@app.route('/api/fetch_individual_data_manual',methods=['GET','POST'])
def fetch_individual_data_manual():
    data = request.get_json() if request.method == 'POST' else None
    return event_manager.fetch_individual_manual(data)

# On-Duty Management
   
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

# Google Drive Integration

@app.route('/api/create_drive_folder', methods=['POST'])
def create_drive_folder():
    data = request.get_json()
    return drivemanager.create_folder(data)

# Group Management

@app.route('/api/main_group_details', methods=['POST'])
def main_group_details():
    data = request.get_json() if request.method == 'POST' else None
    return memberManager.get_main_group_details(data)

@app.route('/api/event_group_details', methods=['POST'])
def event_group_details():
    data = request.get_json() if request.method == 'POST' else None
    return memberManager.get_event_group_details(data)

# Chat Management

@app.route('/api/group_chat', methods=['POST'])
def group_chat():
    data = request.get_json() if request.method == 'POST' else None
    return memberManager.get_chat_messages(data)

@app.route('/api/event_chat', methods=['POST'])
def event_chat():
    data = request.get_json() if request.method == 'POST' else None
    return memberManager.get_event_chat_messages(data)

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json() if request.method == 'POST' else None
    return memberManager.add_chat_message(data)

@app.route('/api/chat_events', methods=['POST'])
def chat_events():
    data = request.get_json() if request.method == 'POST' else None
    return memberManager.add_event_chat_message(data)

# User Profile Management

@app.route('/api/user_details', methods=['POST'])
def user_details():
    data = request.get_json() if request.method == 'POST' else None
    return memberManager.fetch_user_details(data)

@app.route('/api/update_student_details', methods=['POST'])
def update_student_details():
    data = request.get_json() if request.method == 'POST' else None
    return memberManager.update_user_details(data)

@app.route('/api/forum_query', methods=['POST'])
def forum_query():
    data = request.get_json() if request.method == 'POST' else None
    return memberManager.send_forum_query(data)

# Main Function

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
