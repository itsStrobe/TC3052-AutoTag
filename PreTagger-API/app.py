#!venv/bin/python3

from PreTaggerOrchestrator import PreTaggerOrchestrator
from flask import Flask, request, abort, jsonify

# -- API MACROS --
NAME = 'PreTagger'
VER = 'v0.1'
BUCKET_NAME = "autotag-storage-us-east"

preTagger = PreTaggerOrchestrator()

app = Flask(__name__)

# -- HELPER METHODS --

def ValidateJSONFields(reqJSON, requiredFields : list == []):

    # Validate JSON Object contains required fields
    missingFields = [field for field in requiredFields if field not in reqJSON]
    if len(missingFields) > 0:
        abort(400, description=f'{missingFields} fields were not found in JSON Body.')

# -- API CALLS -- 

@app.route("/")
def index():
    return "Hello, world!"

@app.route(f"/{NAME}/debug/{VER}/UploadToBucket/", methods=['POST'])
def UploadToBucket():
    requiredFields = ['fileLoc', 'fileDest']

    reqJSON = request.json

    ValidateJSONFields(reqJSON, requiredFields)

    isUploaded, message = preTagger.UploadFile(reqJSON['fileLoc'], objectName=reqJSON['fileDest'])

    if(not isUploaded):
        abort(400, description=message)

    return message

@app.route(f"/{NAME}/api/{VER}/Label/", methods=['POST'])
def Label():
    requiredFields = ['userId', 'projectId', 'fileType', 'projectType', 'dataFile', 'tags']

    reqJSON = request.json

    # Validate Request has valid JSON Object.
    if not reqJSON:
        abort(400, description="JSON object not found.")

    ValidateJSONFields(reqJSON, requiredFields)

    # TODO: Define Target Dir for Tagged Files.

    # TODO: Call PreTaggerOrchestrator.LabelOrchestrator as async method.
    
    pretagDir = "Success."

    return pretagDir

# -- ERROR HANDLING --

# Bad Request
@app.errorhandler(400)
def bad_request(e):
    return jsonify(error=str(e)), 400

# Resource Not Found
@app.errorhandler(404)
def resource_not_found(e):
    return jsonify(error=str(e)), 404

if __name__ == '__main__':
    # Testing and debugging purposes only!

    # TODO: Initialize PreTaggerOrchestrator with bucket name.
    preTagger = PreTaggerOrchestrator(BUCKET_NAME)

    # TODO: Change to production before deployment.
    app.run(debug=True)
