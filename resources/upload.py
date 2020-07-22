
from flask import Flask, request
from flask_restful import Resource, reqparse
import werkzeug

# # Route that is used to communicate with the package
class Upload(Resource):
    def get(self):
      return "Only POST method allowed for this route", 400
    def post(self):
      print("POST")
      parse = reqparse.RequestParser()
      parse.add_argument(
          'file', type=werkzeug.datastructures.FileStorage, location='files')
      args = parse.parse_args()
      # converts uploaded file to string
      file = args['file']
      csv_byte_stream = file.stream.read()
      print(csv_byte_stream)
      return "Success", 200
