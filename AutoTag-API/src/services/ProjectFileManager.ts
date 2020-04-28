import { Container, Service, Inject } from 'typedi';
import AWSAccessorService from './AWSFileAccesor';

enum ProjectType {
  SentimentAnalysis = 0,
  DocumentClassification = 1,
  POSTagging = 2,
  NERTagging = 3
}

enum DataFormat {
  CSV = 0,
  TXT = 1
}

enum Status {
  NotTagged = 0,
  InProgress = 1,
  PreTagged = 2,
  Tagged = 3
}

@Service()
export default class ProjectFileManagerService {

  // Service Injection
  @Inject()
  awsClient : AWSAccessorService; // AWS File Accessor Service

  // TODO: Initialize CSV Project
  /*
      Based on a Project Object (with ProjectType=CSV), creates all necessary
      Files in AWS
  */
  
  // TODO: Initialize TXT Project
  /*
      Based on a Project Object (with ProjectType=TXT), creates all necessary
      Files in AWS
  */
  
  // TODO: Initialize Project Files
  /*
      Based on a Generic Project Object, creates all necessary
      Files in AWS
  */
  
  // TODO: Initialize Project
  /*
      Create a Project Object based on Parameters.
  
      Returns Project Object
  */
  
  // TODO: Set Data Files to Project
  
  // TODO: Update Project Tags
  
  // TODO: Get File
  
  // TODO: Get Data Files
  
  // TODO: Get Data Tags
}
