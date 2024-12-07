
from flask import Flask, jsonify # type: ignore
from flask_cors import CORS # type: ignore
import awsgi # type: ignore

app = Flask(__name__)
CORS(app)

@app.route('/api/hello', methods=['GET'])
def hello():
    return jsonify({
        'message': 'Hello from Flask Lambda!'
    })

# More routes can be added here

def handler(event, context):
    return awsgi.response(app, event, context)