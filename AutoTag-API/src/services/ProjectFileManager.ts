import { Container, Service, Inject } from 'typedi';
import AWSAccessorService from './AWSFileAccesor';
import { Project } from '../model/project';
import { User } from '../model/user';
import { Tag } from '../model/tag';
import config from '../config';

const https = require('https');

// Default File Contents:
const DEFAULT_DATA_ROW_CONTENTS = "NO_DATA";
const DEFAULT_TAGS_ROW_CONTENTS = "NO_LABEL";

// Default Files:
const FILE_TAGS = "tags.csv";
const FILE_PRETAGS = "silver_standard.csv";
const FILE_DATA_INDEX = "data_index.csv";

enum ProjectType {
  SentimentAnalysis = 0,
  TextClassification = 1,
  POSTagging = 2,
  NERTagging = 3
}

enum DataFormat {
  CSV = 0,
  TXT = 1
}

enum Status {
  NotTagged = 0,
  PreTagged = 1,
  Tagged = 2
}

class DataRow {
  DataName : string;
  RowId : number;
  Content : string;
  Status : string;
  Tag : string;

  constructor(DataName : string, RowId : number, Content : string, Status : string, Tag : string){
    this.DataName = DataName;
    this.RowId = RowId;
    this.Content = Content;
    this.Status = Status;
    this.Tag = Tag;
  }
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
        return 'Sentiment Analysis';

      case ProjectType.TextClassification:
        return 'Text Classification';
      
      case ProjectType.POSTagging:
        return 'POS Tagging';

      case ProjectType.NERTagging:
        return 'NER Tagging';
    
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

        case 'Text Classification':
          return ProjectType.TextClassification;
        
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

      case 'PreTagged':
        return Status.PreTagged;

      case 'Tagged':
        return Status.Tagged;
    
      default:
        return null;
    }
  }
  
  /**
   * StringToBuffer
   */
  public StringToBuffer(data : string) : Buffer {
    return Buffer.from(data);
  }

  /**
   * BufferToString
   */
  public BufferToString(data : Buffer) : string {
    return data.toString();
  }

  
  /**
   * SetCSVProjectFiles
   * Based on a Project Object (with ProjectType=CSV), creates all necessary Files in AWS
   * The files are:
   *  > data file defined by user.
   *  > tags.csv
   *  > silver_standard.csv
   * 
   * Returns Updated Object
   */
  private async SetCSVProjectFiles(project : Project, fileName : string, fileContent : Buffer) : Promise<Project> {
    let awsClientInstance = Container.get(AWSAccessorService);

    // Project Root Path
    const projectDir = `${project.owner.id}/${project.uuid}/`;
    

    // Upload Data File
    const dataFilePath : string = projectDir + fileName;
    if(await awsClientInstance.tryUploadFile(dataFilePath, fileContent)) {
      // TODO: Log success;
    }
    else {
      // TODO: Log Failure;
      return null;
    }

    // Set the project's Data Location
    project.projectDataLoc = fileName;

    
    // Initialize Default Tags File
    let tags : string = "";
    const numRows : number = fileContent.toString().split(/(?:\r\n|\r|\n)/g).length;

    for (let idx = 0; idx < numRows - 1; idx++) {
      tags += DEFAULT_TAGS_ROW_CONTENTS + '\n';
    }
    tags += DEFAULT_TAGS_ROW_CONTENTS;

    const tagsContent = this.StringToBuffer(tags);
    
    // Upload Default Tag File
    const tagFilePath = projectDir + FILE_TAGS;
    if(await awsClientInstance.tryUploadFile(tagFilePath, tagsContent)) {
      // TODO: Log success;
    }
    else {
      // TODO: Log Failure;
      return null;
    }

    // Set the project's Tags Location
    project.tagsLoc = FILE_TAGS;


    // Upload Default Pre-Tags File
    const preTagsFilePath = projectDir + FILE_PRETAGS;
    if(await awsClientInstance.tryUploadFile(preTagsFilePath, tagsContent)) {
      // TODO: Log success;
    }
    else {
      // TODO: Log Failure;
      return null;
    }

    // Set the project's Pre-Tags Locatiion
    project.silverStandardLoc = FILE_PRETAGS;

    // awsClientInstance.tryUploadFile()

    return project;
  }
  
  /**
   * SetTXTProjectFiles
   * Based on a Project Object (with ProjectType=TXT), creates all necessary Files in AWS
   * The files are:
   *  > data_index.csv
   *  > data files defined by user.
   *  > tags.csv
   *  > silver_standard.csv
   * 
   * Returns Updated Object
   */
  private async SetTXTProjectFiles(project : Project, fileNames : string[], filesContent : Buffer[]) : Promise<Project> {

    if(fileNames.length != filesContent.length) {
      // TODO: Log Disparity in files names and content list
      return null; 
    }

    let awsClientInstance = Container.get(AWSAccessorService);

    // Project Root Path
    const projectDir = `${project.owner.id}/${project.uuid}/`;

    // Get Number of Files
    const numFiles : number = fileNames.length;

    // Upload Data Files
    let dataFilePath : string = "";
    for(let idx = 0; idx < numFiles; idx++) {
      dataFilePath = projectDir + fileNames[idx];

      if(await awsClientInstance.tryUploadFile(dataFilePath, filesContent[idx])) {
        // TODO: Log success;
      }
      else {
        // TODO: Log Failure;
        return null;
      }
    }


    // Initialize Data Index File
    let fileNamesString : string = "";
    for(let idx = 0; idx < numFiles - 1; idx++) {
      fileNamesString += fileNames[idx] + '\n';
    }
    fileNamesString += fileNames[numFiles - 1];

    const fileNamesContent = this.StringToBuffer(fileNamesString);

    // Upload Data Index File
    const dataIndexFilePath = projectDir + FILE_DATA_INDEX;
    if(await awsClientInstance.tryUploadFile(dataIndexFilePath, fileNamesContent)) {
      // TODO: Log success;
    }
    else {
      // TODO: Log Failure;
      return null;
    }

    // Set the project's Data Location
    project.projectDataLoc = FILE_DATA_INDEX;

    
    // Initialize Default Tags File
    let tags : string = "";

    for (let idx = 0; idx < numFiles - 1; idx++) {
      tags += DEFAULT_TAGS_ROW_CONTENTS + '\n';
    }
    tags += DEFAULT_TAGS_ROW_CONTENTS;

    const tagsContent = this.StringToBuffer(tags);
    
    // Upload Default Tag File
    const tagFilePath = projectDir + FILE_TAGS;
    if(await awsClientInstance.tryUploadFile(tagFilePath, tagsContent)) {
      // TODO: Log success;
    }
    else {
      // TODO: Log Failure;
      return null;
    }

    // Set the project's Tags Location
    project.projectDataLoc = FILE_TAGS;


    // Upload Default Pre-Tags File
    const preTagsFilePath = projectDir + FILE_PRETAGS;
    if(await awsClientInstance.tryUploadFile(preTagsFilePath, tagsContent)) {
      // TODO: Log success;
    }
    else {
      // TODO: Log Failure;
      return null;
    }

    // Set the project's Pre-Tags Location
    project.projectDataLoc = FILE_PRETAGS;

    // awsClientInstance.tryUploadFile()

    return project;
  }
  
  private async GetCSVDataBatch(project : Project, batchStart : number, batchSize : number) : Promise<[DataRow]> {
    let awsClientInstance = Container.get(AWSAccessorService);
    let dataRows : [DataRow];

    // Project Root Path
    const projectDir = `${project.owner.id}/${project.uuid}/`;
    
    // Get Data File - Contents
    const dataFilePath : string = projectDir + project.projectDataLoc;
    let dataContents = await awsClientInstance.downloadFileAsList(dataFilePath);
    
    // Get Tags File
    const tagsFilePath : string = projectDir + project.tagsLoc;
    let dataTags = await awsClientInstance.downloadFileAsList(tagsFilePath);

    // Get Pre-Tags File
    const preTagsFilePath : string = projectDir + project.silverStandardLoc;
    let dataPreTags = await awsClientInstance.downloadFileAsList(preTagsFilePath);

    for(let idx = batchStart; idx < batchSize; idx++){
      let dataName = `Data Row ${idx}`;
      let rowId = idx;
      let content = dataContents[idx];

      let tag : string;
      let status : string;

      if(dataTags[idx] === DEFAULT_TAGS_ROW_CONTENTS)
      {
        if(dataPreTags[idx] === DEFAULT_TAGS_ROW_CONTENTS){
          status = "NotTagged";
        }
        else{
          tag = dataPreTags[idx];
          status = "PreTagged";
        }
      }
      else{
        tag = dataTags[idx];
        status = "Tagged";
      }

      let newDataRow = new DataRow(dataName, rowId, content, tag, status);
      dataRows.push(newDataRow);

    }

    return dataRows;
  }
  
  private async GetTXTDataBatch(project : Project, batchStart : number, batchSize : number) : Promise<[DataRow]> {
    let awsClientInstance = Container.get(AWSAccessorService);
    let dataRows : [DataRow];

    // Project Root Path
    const projectDir = `${project.owner.id}/${project.uuid}/`;
    
    // Get Data File - Names
    const dataFilePath : string = projectDir + project.projectDataLoc;
    let dataFileNames = await awsClientInstance.downloadFileAsList(dataFilePath);
    
    // Get Tags File
    const tagsFilePath : string = projectDir + project.tagsLoc;
    let dataTags = await awsClientInstance.downloadFileAsList(tagsFilePath);

    // Get Pre-Tags File
    const preTagsFilePath : string = projectDir + project.silverStandardLoc;
    let dataPreTags = await awsClientInstance.downloadFileAsList(preTagsFilePath);

    for(let idx = batchStart; idx < batchSize; idx++){
      let dataName = dataFileNames[idx];
      let rowId = idx;
      let content = await awsClientInstance.downloadFileAsString(projectDir + dataFileNames[idx]);

      let tag : string;
      let status : string;

      if(dataTags[idx] === DEFAULT_TAGS_ROW_CONTENTS)
      {
        if(dataPreTags[idx] === DEFAULT_TAGS_ROW_CONTENTS){
          status = "NotTagged";
        }
        else{
          tag = dataPreTags[idx];
          status = "PreTagged";
        }
      }
      else{
        tag = dataTags[idx];
        status = "Tagged";
      }

      let newDataRow = new DataRow(dataName, rowId, content, tag, status);
      dataRows.push(newDataRow);

    }

    return dataRows;
  }
 

  /**
   * InitializeProject
   *  ENDPOINT -> Llamar al crear un nuevo proyecto. Guardar el Proyecto regresado en la DB
   * 
   * Create a Project Object based on Parameters.
   * Returns Project Object
   */
  public InitializeProject(name : string, owner : User, description : string, projectType : string, dataFormat : string, tags : Tag[]) : Project {
    let project = new Project();

    // User Defined Properties
    project.name = name;
    project.owner = owner;
    project.description = description;
    project.type = this.TextToProjectType(projectType);
    project.projectDataFormat = dataFormat; // TODO: Project.projectDataFormat must be a number
    project.tags = tags;
    project.status = Status.NotTagged;

    // Automatic Properties
    // TODO:

    return project;
  }
  
  /**
   * SetProjectFiles
   *  ENDPOINT -> Llamar al recibir la llamada de subida de archivos. Guardar el Proyecto actualizado en la DB.
   * 
   * Create Files for a Generic Project in AWS.
   * 
   * Returns Updated Object
   */
  public async SetProjectFiles(project : Project, fileNames : string[], filesContent : Buffer[]) : Promise<Project> {
    if(!fileNames || !filesContent) {
      // TODO: Log Null Contents
      return null;
    }

    switch (this.TextToDataFormat(project.dataFormat)) {
      case DataFormat.CSV:
        return await this.SetCSVProjectFiles(project, fileNames[0], filesContent[0]);

      case DataFormat.TXT:
        return await this.SetTXTProjectFiles(project, fileNames, filesContent);
    
      default:
        return null;
    }
  }

  /**
   * GetDataBatch
   *  ENDPOINT -> Llamar cuando el cliente pida Data para taggear. Enviar el JSON regresado como respuesta al cliente.
   * 
   * Parameters:
   *  projectId - Guid: Id of project containing the desired data.
   *  batchStart - int: Position of starting row to be returned.
   *  batchSize - in: Size of batch to be returned.
   * Return:
   *  List of Data objects
   *    DataName - string : Name of the datapoint
   *    RowId - int: Row index of the data. For a CSV project, this simply refers to the index in the user-provided file. For a TXR project, this refers to our own indexing in the generated dataIndex.csv file.
   *    Content - string : Content of datapoint
   *    Status - string : NotTagged, PreTagged, Tagged
   *    Tag - string : Existing Tag (null if NotTagged).
   */
  public async GetDataBatch(project : Project, batchStart : number, batchSize : number) : Promise<string> {
    switch (this.TextToDataFormat(project.dataFormat)) {
      case DataFormat.CSV:
        return JSON.stringify(await this.GetCSVDataBatch(project, batchStart, batchSize));

      case DataFormat.TXT:
        return JSON.stringify(await this.GetTXTDataBatch(project, batchStart, batchSize));
    
      default:
        return null;
    }
  }
  
  /**
   * UpdateTag
   *  ENDPOINT -> Llamar cuando recibamos una Tag del cliente. Guardar el Proyecto actualizado en la DB.
   * 
   * Returns updated Project Object
   */
  public async UpdateTag(project : Project, rowId : number, tag : string) : Promise<Project> {
    let awsClientInstance = Container.get(AWSAccessorService);
    let dataRows : [DataRow];

    // Project Root Path
    const projectDir = `${project.owner.id}/${project.uuid}/`;
    
    // Get Tags File
    const tagsFilePath : string = projectDir + project.tagsLoc;
    let dataTags = await awsClientInstance.downloadFileAsList(tagsFilePath);

    // Update Data Tag
    dataTags[rowId] = tag;

    // Generate Data Tag File
    let numRows = dataTags.length;
    let tagFileContents = "";
    for (let idx = 0; idx < numRows - 1; idx++) {
      tagFileContents += dataTags[idx] + '\n';
    }
    tagFileContents += dataTags[numRows - 1];

    const tagsContent = this.StringToBuffer(tagFileContents);

    // Upload Updated Data Tag File
    if(await awsClientInstance.tryUploadFile(tagsFilePath, tagsContent)) {
      // TODO: Log success;
    }
    else {
      // TODO: Log Failure;
      return null;
    }

    // See if project is fully tagged
    let isFinished = true;
    dataTags.forEach(tag => {
      if(tag === DEFAULT_TAGS_ROW_CONTENTS){
        isFinished = false;
      }
    })
    
    // Update Project Status
    project.lastUpdate = new Date();
    if(isFinished){
      project.status = Status.Tagged;
    }

    return project;
  }

  /**
   * GenerateProjectPreTags
   *  ENDPOINT -> Llamar cuando el cliente pida Pre-Taggear. Guardar el Proyecto actualizado en la DB.
   * 
   * Calls the Pre-Tagged API to Update the Project
   * 
   * Returns the Updated Project
   */
  public async GenerateProjectPreTags(project : Project) : Promise<Project> {
    // requiredFields = ['userId', 'projectId', 'fileType', 'projectType', 'dataFile', 'tagsFile']
    let userId = project.owner.id.toString();
    let projectId = project.uuid;
    let fileType = project.dataFormat;
    let projectType = this.ProjectTypeToText(project.type);
    let dataFile = project.projectDataLoc;
    let tagsFile = project.tagsLoc;

    // Make call and get new pred dir. Update Project.
    const params = JSON.stringify({
      userId : userId,
      projectId : projectId,
      fileType : fileType,
      projectType : projectType,
      dataFile : dataFile,
      tagsFile : tagsFile
    });

    const options = {
      hostname : config.preTagger_api_host,
      port : config.preTagger_api_port,
      path : "/PreTagger/api/v0.1/Label",
      method : 'POST'
    };

    let response : JSON;

    const req = https.request(options, (res) => {
      let data = '';

      console.log(`Status Code: ${res.statusCode}`);

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        response = JSON.parse(data);
        console.log(`Body: ${response}`);
      });
    }).on('error', (err) => {
      // TODO: Log error
      console.log("Error: ", err.message);
      return null;
    });

    req.write(params);
    req.end();

    // Return Updated Project
    project.silverStandardLoc = response['silver_standard'];
    project.status = Status.PreTagged;
    return project;
  }
}
