#!venv/bin/python3
import os
from flask import Flask, abort, jsonify, request

from PreTaggerOrchestrator import PreTaggerOrchestrator
from PreTaggerEnums import FileType, ProjectType
from PreTaggerKeywords import FileKeywords

# -- API MACROS --
NAME = 'PreTagger'
VER = 'v0.1'
BUCKET_NAME = "autotag-storage-us-east"

preTagger = PreTaggerOrchestrator(awsBucket=BUCKET_NAME)

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

@app.route(f"/{NAME}/debug/{VER}/DownloadFromBucket/", methods=['GET'])
def DownloadFromBucket():
    requiredFields = ['fileLoc', 'fileDest']

    reqJSON = request.json

    ValidateJSONFields(reqJSON, requiredFields)

    isDownloaded, message = preTagger.DownloadFile(reqJSON['fileLoc'], fileDest=reqJSON['fileDest'])

    if(not isDownloaded):
        abort(400, description=message)

    return message

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
    requiredFields = ['userId', 'projectId', 'fileType', 'projectType', 'dataFile', 'tagsFile']

    reqJSON = request.json

    # Validate Request has valid JSON Object.
    if not reqJSON:
        abort(400, description="JSON object not found.")

    ValidateJSONFields(reqJSON, requiredFields)

    print(reqJSON)

    # TODO: Define Target Dir for Tagged Files.

    fileType = None
    projType = None

    if (reqJSON['fileType'] == 'TXT'):
        fileType = FileType.TXT
    elif (reqJSON['fileType'] == 'CSV'):
        fileType = FileType.CSV

    if (reqJSON['projectType'] == "Sentiment Analysis"):
        projType = ProjectType.SENTIMENT_ANALYSIS
    elif (reqJSON['projectType'] == "Text Classification"):
        projType = ProjectType.TEXT_CLASSIFICATION
    elif (reqJSON['projectType'] == "NER Classification"):
        projType = ProjectType.NER_CLASSIFICATION
    elif (reqJSON['projectType'] == "POS Tagging"):
        projType = ProjectType.POS_TAGGING

    projDir = os.path.join(reqJSON['userId'], reqJSON['projectId'])

    dataDir = os.path.join(projDir, reqJSON['dataFile'])
    tagsDir = os.path.join(projDir, reqJSON['tagsFile'])
    predDir = os.path.join(projDir, FileKeywords.SILVER_STANDARD_FILE)

    preTagger.LabelOrchestrator(dataDir, tagsDir, predDir, fileType, projType)
    
    pretagDir = {
        "status" : 200,
        "message" : f"File with Silver Standard successfully created.",
        "silver_standard" : predDir
    }

    return jsonify(pretagDir)

# -- ERROR HANDLING --

# Bad Request
@app.errorhandler(400)
def bad_request(e):
    return jsonify(error=str(e)), 400

# Resource Not Found
@app.errorhandler(404)
def resource_not_found(e):
    return jsonify(error=str(e)), 404
