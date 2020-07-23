import io
import werkzeug
import pandas as pd
from flask import Flask, request
from flask_restful import Resource, reqparse
from kulgap.io import read_pdx_from_byte_stream

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
      output = read_pdx_from_byte_stream(csv_byte_stream)
      print(output)
      print(type(output))
      return output, 200
