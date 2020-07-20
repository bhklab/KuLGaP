from flask import Flask, request, send_from_directory, jsonify
import os
import json
import simplejson

app = Flask(__name__)

@app.route('/api')
def api():
    # using txt file because json file cannot store NaN values
    with open('./example/patient.txt', 'r') as patient_file:
        patient = json.load(patient_file)
    with open('./example/summary.txt', 'r') as summary_file:
        summary = json.load(summary_file)

    # converts existing dictionaries into a single json and removes NaN values from it
    return simplejson.dumps({
        "patient": patient,
        "summary": summary
    }, ignore_nan=True), 200


# Setup that enables react routing when serving static files
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    path_dir = os.path.abspath("./client/build")  # path react build
    if path != "" and os.path.exists(os.path.join(path_dir, path)):
        return send_from_directory(os.path.join(path_dir), path)
    else:
        return send_from_directory(os.path.join(path_dir), 'index.html')

if __name__ == '__main__':
    app.run()
