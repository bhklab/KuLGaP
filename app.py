import os
from flask import Flask, request, send_from_directory, jsonify
from flask_restful import Api
from flask_cors import CORS

from resources.upload import Upload
from resources.example import ExampleData

app = Flask(__name__,
            static_url_path='',
            static_folder='client/build')
CORS(app)
api = Api(app)

api.add_resource(Upload, '/api/upload')
api.add_resource(ExampleData, '/api/example')

# Setup that enables react routing when serving static files
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    path_dir = os.path.abspath("./client/build")  # path react build
    if path != "" and os.path.exists(os.path.join(path_dir, path)):
        return send_from_directory(os.path.join(path_dir), path)
    else:
        return send_from_directory(os.path.join(path_dir), 'index.html')


