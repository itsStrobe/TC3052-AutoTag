export class Project {
  uuid: string;
  name: string;
  description: string;
  type: number;
  dataFormat: string;
  projectDataFormat: string;
  projectDataLoc: string;
  tagsLoc: string;
  taggedByLoc: string;
  tags: string[];
  silverStandardLoc: string;
  status: number;
  created: Date;
  lastUpdate: Date;
  lastLabelSubmission: Date;
}

export enum ProjectType {
  SentimentAnalysis = 0,
  DocumentClassification,
  POSTagging,
  NERTagging
}

export class ProjectTypeUtil {
  public static getProjectTypeName(projectType: ProjectType) {
    switch (projectType) {
      case ProjectType.SentimentAnalysis:
        return 'Sentiment Analysis';
      case ProjectType.DocumentClassification:
        return 'Document Classification';
      case ProjectType.POSTagging:
        return 'Part of Speech Tagging';
      case ProjectType.NERTagging:
        return 'Named-Entity Recognition Tagging';
    }
  }
}
