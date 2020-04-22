import logging

import boto3

from FileReadWrite import FileController
from PreTaggerEnums import FileType, ProjectType

from ProjectManager import ProjectFactory

class PreTaggerOrchestrator:
    def __init__(self, awsBucket : str = None):
        self.fileController = FileController(awsBucket=awsBucket)

    def setAwsBucket(self, awsBucket : str):
        self.fileController.setAwsBucket(awsBucket)

    def UploadFile(self, fileLoc : str, objectName : str = None, inTmpDir=False):
        return self.fileController.UploadFile(fileLoc, objectName=objectName, inTmpDir=inTmpDir)

    def DownloadFile(self, objectName : str, fileDest : str = None, inTmpDir=False):
        return self.fileController.DownloadFile(objectName, fileDest=fileDest, inTmpDir=inTmpDir)
        

    # TODO: Make this async.
    def LabelOrchestrator(self, dataDir : str, tagsDir : str, targetDir : str, fileType : FileType, projType : ProjectType):

        # Initialize Project Object using ProjectFactory

        # Get Files from AWS with FileReader

        # Use Project to Parse Files into Pandas

        # Use Project to get LabeledData, UnlabeledData from Parsed Files

        # Initialize Model class based on Model Needed
        # - PreProcess Labeled, UnlabaledData
        
        # Train Model

        # Get Predictions

        # Use Project to Map UnlabeledData results into a Tagged File

        # Use FileReader to write UnlabeledData into file in ./tmp/ and upload into AWS

        project = ProjectFactory.createProject(fileType, projType)

        project.extractProjectFiles(dataDir, tagsDir, self.fileController)

        project.extractLabeledAndUnlabeledData()

        project.generatePreTags()

        pred = project.getPredictions()

        self.fileController.WriteFile(pred, targetDir, inTmpDir=True)

        self.UploadFile(targetDir, inTmpDir=True)

        return True
