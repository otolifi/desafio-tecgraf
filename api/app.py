from flask import Flask, jsonify, json
from flask_cors import CORS
import os

app = Flask(__name__, static_folder="static")
app.config['JSON_SORT_KEYS'] = False
CORS(app)

with open('parts.json') as json_file:
    data = json.load(json_file)


@app.route('/')
def index():
    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")