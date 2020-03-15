import logging
import boto3
from botocore.exceptions import ClientError

class PreTaggerOrchestrator:
    def __init__(self, awsBucket : str = None):
        self.AwsBucket = awsBucket
        self.s3Client = boto3.client('s3')

    def UploadFile(self, fileLoc : str, objectName : str = None):
        if(objectName is None):
            objectName = fileLoc

        try:
            resp = self.s3Client.upload_file(fileLoc, self.AwsBucket, objectName)
        except ClientError as e:
            logging.error(e)
            return (False, e)

        return (True, "File Submitted Successfully")
        

    # TODO: Make this async.
    def LabelOrchestrator(self, targetDir : str):

        # Initialize Project Object based on File Type

        # Get Files from AWS with FileReader

        # Use Project to Parse Files into Pandas

        # Use Project to get LabeledData, UnlabeledData from Parsed Files

        # Initialize Model class based on Model Needed
        # - PreProcess Labeled, UnlabaledData
        
        # Train Model

        # Get Predictions

        # Use Project to Map UnlabeledData results into a Tagged File

        # Use FileReader to write UnlabeledData into file in ./tmp/ and upload into AWS

        return NotImplementedError
