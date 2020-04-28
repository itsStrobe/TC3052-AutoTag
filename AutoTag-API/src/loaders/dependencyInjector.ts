import { Container } from 'typedi';
import { S3 } from 'aws-sdk';

export default () => {
  try {
    
    Container.set('s3Client', new S3());
    
    // TODO: Log successful dependency injection
    
    return { success : true };
  
  } catch (e) {
    
    // TODO: Log error.    
    throw e;
  }
};