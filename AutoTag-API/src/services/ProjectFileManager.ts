import { Container, Service, Inject } from 'typedi';
import AWSAccessorService from './AWSFileAccesor';

@Service()
export default class ProjectFileManagerService {

    // Service Injection
    @Inject()
    awsClient : AWSAccessorService; // AWS File Accessor Service

    // TODO: Initialize CSV Project

    // TODO: Initialize TXT Project

    // TODO: Initialize Project (Generic)

    // TODO: Set Data Files to Project

    // TODO: Update Project Tags

    // TODO: Get File

    // TODO: Get Data Files

    // TODO: Get Tags
}
