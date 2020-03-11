class PreTaggerOrchestrator:
    def __init__(self, awsBucket : str):
        self.AwsBucket = awsBucket

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
