import json
import simplejson
from flask_restful import Resource

class ExampleData(Resource):
  def get(self):
    print('Getting example data')
    # using txt file because json file cannot store NaN values
    with open('./example/patient.txt', 'r') as patient_file:
        patient = json.load(patient_file)
    with open('./example/summary.txt', 'r') as summary_file:
        summary = json.load(summary_file)
    # converts existing dictionaries into a single json and removes NaN values from it
    return simplejson.dumps({
        'patient': patient,
        'summary': summary
    }, ignore_nan=True), 200
