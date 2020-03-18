import logging
import os
from enum import Enum

import boto3
import numpy as np
import pandas as pd
from botocore.exceptions import ClientError

# -- FILE PANDAS STRUCTURE -- #

"""
When reading a single file, the content can be retured as is, as a list of rows, as a numpy array or as the following Pandas Data Frame:
| - Content - |


When reading multiple files, these are stored as Pandas for ease of use by the ML Models
The Pandas is structured as follows:

| - FileName - | - Content - |

"""

LOCAL_TMP_PREFIX = "./tmp/"
BUCKET_NAME = ""

class FileDataType(Enum):
    List = 1 # List of rows
    DataFrame = 2   # Pandas DataFrame
    Numpy = 3   # Numpy Array
    Text = 4 # String


class FileController:

    def __init__(self, awsBucket : str = BUCKET_NAME):
        self.AwsBucket = awsBucket

        self.s3Client = boto3.client('s3')

    @classmethod
    def ReadFile(cls, path : str, asType : FileDataType = FileDataType.DataFrame):
        # 1.- Validate File Exists
        # 2.- Open file and dump into desired data structure.
        
        if not os.path.isfile(path):
            return FileNotFoundError

        if(asType == FileDataType.List):
            fileLines = []
            with open(path) as f:
                fileLines = [line.rstrip('\n') for line in f]

            return fileLines
        
        if(asType == FileDataType.DataFrame or asType == FileDataType.Numpy):
            fileDf = pd.read_csv(path, header=None, names=["Content"], index_col=False)

            if(asType == FileDataType.Numpy):
                return fileDf.to_numpy()
            
            return fileDf

        if(asType == FileDataType.Text):
            fileText = ""

            with open(path) as f:
                fileText = f.read().rstrip()
            
            return fileText

        return NotImplementedError

    @classmethod
    def ReadFiles(cls, paths : [str], asType : FileDataType = FileDataType.DataFrame):

        for path in paths:
            if not os.path.isfile(path):
                return FileNotFoundError

        if(asType == FileDataType.List):
            files = [cls.ReadFile(path, asType=FileDataType.List) for path in paths]

            return files

        if(asType == FileDataType.DataFrame or asType == FileDataType.Numpy):
            filesContent = [cls.ReadFile(path, asType=FileDataType.Text) for path in paths]

            filesDict = {"FileName" : [os.path.basename(path) for path in paths], "Content" : filesContent}

            filesDf = pd.DataFrame.from_dict(filesDict)

            if(asType == FileDataType.Numpy):
                return filesDf.to_numpy()

            return filesDf

        if(asType == FileDataType.Text):
            filesContent = [cls.ReadFile(path, asType=FileDataType.Text) for path in paths]

            return filesContent

        return NotImplementedError
    
    def setAwsBucket(self, awsBucket : str):
        self.AwsBucket = awsBucket

    def GetFile(self, path : str, asType : FileDataType = FileDataType.DataFrame):
        # 1.- Download file into tmp
        # 2.- Use ReadFile to dump file into desired data structure.

        localPath = os.path.join(LOCAL_TMP_PREFIX, path)

        self.DownloadFile(path, fileLoc=localPath)

        return self.ReadFile(localPath, asType=asType)

    def GetFiles(self, path : str, asType : FileDataType = FileDataType.DataFrame):
        # 1.- Use GetFile to get list of files
        # 2.- Download files to tmp
        # 3.- Use ReadFiles to dump files into desired data structure.

        filesDir = os.path.dirname(path)

        fileNames = self.GetFile(path, asType=FileDataType.List)

        filePaths = [os.path.join(filesDir, fileName) for fileName in fileNames]
        localFilePaths = [os.path.join(LOCAL_TMP_PREFIX, filePath) for filePath in filePaths]

        for (filePath, localFilePath) in zip(filePaths, localFilePaths):
            self.DownloadFile(filePath, fileLoc=localFilePath)

        return self.ReadFiles(localFilePaths, asType=asType)

    def DownloadFile(self, objectName : str, fileLoc : str = None):
        print(f"Downloading file {objectName}")

        if(fileLoc is None):
            fileLoc = objectName

        fileDir = os.path.dirname(fileLoc)
        if not os.path.exists(fileDir):
            os.mkdir(fileDir)
            print(f"Directory {fileDir} created.")
        else:    
            print(f"Directory {fileDir} already exists.")
        
        try:
            resp = self.s3Client.download_file(self.AwsBucket, objectName, fileLoc)
        except ClientError as e:
            logging.error(e)
            return (False, e)

        return (True, f"File Downloaded Successfully into {fileLoc}")       

    def UploadFile(self, fileLoc : str, objectName : str = None):

        if(objectName is None):
            objectName = fileLoc

        try:
            resp = self.s3Client.upload_file(fileLoc, self.AwsBucket, objectName)
        except ClientError as e:
            logging.error(e)
            return (False, e)

        return (True, "File Submitted Successfully")
