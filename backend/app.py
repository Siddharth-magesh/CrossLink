from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/test', methods=['POST'])
def test():
    return "Success"

@app.route('/')
def home():
    return jsonify({"message": "Welcome to CrossLink Backend!"})

if __name__ == '__main__':
    app.run(debug=True)
