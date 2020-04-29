import { Container, Service, Inject } from 'typedi';
import AWSAccessorService from './AWSFileAccesor';
import { Project } from '../model/project';
import { User } from '../model/user';

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

  // == Helper Methods ==
  /**
   * ProjectTypeToText
   */
  public ProjectTypeToText(projectType : ProjectType) : string {
    switch (projectType) {
      case ProjectType.SentimentAnalysis:
        return 'SentimentAnalysis';

      case ProjectType.DocumentClassification:
        return 'DocumentClassification';
      
      case ProjectType.POSTagging:
        return 'POSTagging';

      case ProjectType.NERTagging:
        return 'NERTagging';
    
      default:
        return null;
    }
  }

  /**
   * TextToProjectType
   */
  public TextToProjectType(projectType : string) : ProjectType {
    switch (projectType) {
      case 'SentimentAnalysis':
        return ProjectType.SentimentAnalysis;

        case 'DocumentClassification':
          return ProjectType.DocumentClassification;
        
        case 'POSTagging':
          return ProjectType.POSTagging;
  
        case 'NERTagging':
          return ProjectType.NERTagging;
      
        default:
          return null;
    }
  }
  
  /**
   * DataFormatToText
   */
  public DataFormatToText(dataFormat : DataFormat) : string {
    switch (dataFormat) {
      case DataFormat.CSV:
        return 'CSV';

      case DataFormat.TXT:
        return 'TXT';
    
      default:
        return null;
    }
  }

  /**
   * TextToDataFormat
   */
  public TextToDataFormat(dataFormat : string) : DataFormat {
    switch (dataFormat) {
      case 'CSV':
        return DataFormat.CSV;

      case 'TXT':
        return DataFormat.TXT;
    
      default:
        return null;
    }
  }

  /**
   * StatusToText
   */
  public StatusToText(status : Status) : string {
    switch (status) {
      case Status.NotTagged:
        return 'NotTagged';

      case Status.InProgress:
        return 'InProgress';

      case Status.PreTagged:
        return 'PreTagged';

      case Status.Tagged:
        return 'Tagged';
    
      default:
        return null;
    }
  }

  /**
   * TextToStatus
   */
  public TextToStatus(status : string) : Status {
    switch (status) {
      case 'NotTagged':
        return Status.NotTagged;

      case 'InProgress':
        return Status.InProgress;

      case 'PreTagged':
        return Status.PreTagged;

      case 'Tagged':
        return Status.Tagged;
    
      default:
        return null;
    }
  }

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

  /**
   * InitializeProject
   * 
   * Create a Project Object based on Parameters.
   * Returns Project Object
   */
  public InitializeProject(name : string, owner : User, description : string, projectType : string, dataFormat : string, tags : string[]) : Project {
    let project = new Project();

    project.name = name;
    project.owner = owner;
    project.description = description;
    project.type = this.TextToProjectType(projectType);
    project.projectDataFormat = dataFormat; // TODO: Project.projectDataFormat must be a number
    // TODO: Project Tags
    project.status = Status.NotTagged;

    return project;
  }
  
  // TODO: Set Data Files to Project
  
  // TODO: Update Project Tags
  
  // TODO: Get File
  
  // TODO: Get Data Files
  
  // TODO: Get Data Tags
}
