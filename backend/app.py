from flask import Flask, jsonify, request
import os
from os import path
from dotenv import load_dotenv
from flask_pymongo import PyMongo
from utils import EventManager

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(path.join(basedir, ".env"))

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
app.config['MONGO_URI'] = os.environ.get('MONGO_URI')

mongo = PyMongo(app)
event_manager = EventManager(mongo)

@app.route('/')
def home():
    return jsonify({"message": "Welcome to CrossLink Backend!"})

@app.route('/api/add_event', methods=['POST'])
def add_event():
    event_data = request.get_json()
    return event_manager.add_event(event_data)

@app.route('/api/fetch_members', methods=['GET', 'POST'])
def fetch_members():
    filters = request.get_json() if request.method == 'POST' else None
    return event_manager.fetch_members(filters)

if __name__ == '__main__':
    app.run(debug=True)
