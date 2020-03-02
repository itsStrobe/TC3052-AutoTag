#!venv/bin/python3

from flask import Flask, request, abort, jsonify

# -- API MACROS --
NAME = 'PreTagger'
VER = 'v0.1'

app = Flask(__name__)

# -- API CALLS -- 

@app.route("/")
def index():
    return "Hello, world!"

@app.route(f"/{NAME}/api/{VER}/Label/", methods=['POST'])
def Label():
    requiredFields = ['userId', 'projectId', 'tags', 'type', 'rootDir']

    reqJSON = request.json

    # Validate Request has valid JSON Object.
    if not reqJSON:
        abort(400, description="JSON object not found.")

    # Validate JSON Object contains required fields
    missingFields = [field for field in requiredFields if field not in reqJSON]
    if len(missingFields) > 0:
        abort(400, description=f'{missingFields} fields were not found in JSON Body.')
    
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
    # TODO: Change to production before deployment.
    app.run(debug=True)
