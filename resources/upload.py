import json
import werkzeug
from flask import Flask, request
from flask_restful import Resource, reqparse
from pykulgap.io import byte_stream_to_stats_json

# Route that is used to communicate with the package
class Upload(Resource):
    def get(self):
        return "Only POST method allowed for this route", 400

    def post(self):
        try:
            print("Running Analysis on Uploaded CSV File")
            parse = reqparse.RequestParser()
            parse.add_argument(
                'file', type=werkzeug.datastructures.FileStorage, location='files')
            args = parse.parse_args()
            
            # Check if file is provided
            file = args['file']
            if file is None:
                return {"message": "No file provided"}, 400

            # Read file as a byte stream
            csv_byte_stream = file.stream.read()
            
            # Convert the byte stream to stats JSON using your package's function
            output = byte_stream_to_stats_json(csv_byte_stream, orient='records')

            # Convert output to JSON if necessary and return response
            return json.loads(output), 200

        except Exception as e:
            print(f"Error occurred: {e}")
            return {"message": "An error occurred during file processing"}, 500
