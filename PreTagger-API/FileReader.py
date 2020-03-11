import os
import boto3
from enum import Enum
import numpy as np
import pandas as pd

class FileDataType(Enum):
    List = 1 # List of rows
    DataFrame = 2   # Pandas DataFrame
    Numpy = 3   # Numpy Array
    Text = 4 # String


class FileReader():
    LOCAL_TMP_PREFIX = "./tmp/"
    BUCKET_NAME = ""

    def __init__(self, bucketName : str = BUCKET_NAME):
        self.BucketName = bucketName

        self.s3_resource = boto3.s3_resource('s3')

    @classmethod
    def ReadFile(cls, path : str, AsType : FileDataType = FileDataType.DataFrame):
        # 1.- Validate File Exists
        # 2.- Open file and dump into desired data structure.
        print(path)
        if not os.path.isfile(path):
            return FileNotFoundError

        if(AsType == FileDataType.List):
            fileLines = []
            with open(path) as f:
                fileLines = [line.rstrip('\n') for line in f]

            return fileLines
        
        if(AsType == FileDataType.DataFrame or AsType == FileDataType.Numpy):
            fileDf = pd.read_csv(path, header=None, names=["X"], index_col=False)

            if(AsType == FileDataType.Numpy):
                return fileDf.to_numpy()
            
            return fileDf

        if(AsType == FileDataType.Text):
            fileText = ""

            with open(path) as f:
                fileText = f.read()
            
            return fileText

        return NotImplementedError

    def GetFile(self, path : str, AsType : FileDataType = FileDataType.DataFrame):
        # 1.- Open Bucket from AWS S3
        # 2.- Download file into tmp
        # 3.- Use ReadFile to dump file into desired data structure.
        return NotImplementedError

    def GetFiles(self, path : str, AsType : FileDataType = FileDataType.DataFrame):
        # 1.- Open Bucket from AWS S3
        # 2.- Download dir file into tmp
        # 3.- Use ReadFile to get list of files
        # 4.- Download files to tmp
        # 5.- Use ReadFiles to dump files into desired data structure.
        return NotImplementedError
