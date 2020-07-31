import json
import werkzeug
from flask import Flask, request
from flask_restful import Resource, reqparse
from pykulgap.io import byte_stream_to_stats_json

# # Route that is used to communicate with the package


class Upload(Resource):
    def get(self):
        return "Only POST method allowed for this route", 400

    def post(self):
        print("Running Analysis on Uploaded CSV File")
        parse = reqparse.RequestParser()
        parse.add_argument(
            'file', type=werkzeug.datastructures.FileStorage, location='files')
        args = parse.parse_args()
        # converts uploaded file to string
        file = args['file']
        csv_byte_stream = file.stream.read()
        print(csv_byte_stream)
        output = byte_stream_to_stats_json(csv_byte_stream, orient='records')
        print(output)
        return json.loads(output), 200
