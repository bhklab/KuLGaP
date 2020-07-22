# from flask import Flask, request, send_from_directory, jsonify
# from flask_cors import CORS
# import os
# import json
# import simplejson

# # app = Flask(__name__)
# app = Flask(__name__,
#             static_url_path='',
#             static_folder='client/build')
# CORS(app)

# # API route that serves test data
# @app.route('/api/example', methods=['GET'])
# def test():
#     # using txt file because json file cannot store NaN values
#     with open('./example/patient.txt', 'r') as patient_file:
#         patient = json.load(patient_file)
#     with open('./example/summary.txt', 'r') as summary_file:
#         summary = json.load(summary_file)

#     # converts existing dictionaries into a single json and removes NaN values from it
#     return simplejson.dumps({
#         "patient": patient,
#         "summary": summary
#     }, ignore_nan=True), 200

# # Route that is used to communicate with the package
# @app.route('/api/upload', methods=['POST'])
# def analysis():
#     if request.method == 'POST':
#         # converts uploaded file to string
#         file = request.files['file']
#         csv_byte_stream = file.stream.read()
#         print(csv_byte_stream)
#         return "Success", 200
#     else:
#         return "Only POST method allowed for this route", 400

# # Setup that enables react routing when serving static files
# @app.route('/', defaults={'path': ''})
# @app.route('/<path:path>')
# def serve(path):
#     path_dir = os.path.abspath("./client/build")  # path react build
#     if path != "" and os.path.exists(os.path.join(path_dir, path)):
#         return send_from_directory(os.path.join(path_dir), path)
#     else:
#         return send_from_directory(os.path.join(path_dir), 'index.html')
import os
from flask import Flask, request, send_from_directory, jsonify
from flask_restful import Api
from flask_cors import CORS

from resources.root import Serve
from resources.upload import Upload
from resources.example import ExampleData

app = Flask(__name__,
            static_url_path='',
            static_folder='client/build')
CORS(app)
api = Api(app)

# api.add_resource(Serve, '/', '/<path:path>')
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


