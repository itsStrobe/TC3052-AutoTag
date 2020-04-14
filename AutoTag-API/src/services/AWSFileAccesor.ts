import { Service, Inject } from 'typedi';
import config from '../config';

@Service()
export default class AWSAccessorService {
    constructor(
        @Inject('s3Client') private s3Client
    ) { }

    tryUploadFile(fileDest : string, fileStream : BinaryType) : boolean {
        var s3Params = {
            Bucket : config.aws_bucket,
            Key : fileDest,
            Body : fileStream
        };

        this.s3Client.upload(s3Params, (err, data) => {
            if(err){
                // TODO: Log error.
                return false;
            }
        });

        // TODO: Log success.

        return true;
    }

    tryDownloadFile(filePath : string) : [boolean, string] {

        let fileContent = "";

        var s3Params = {
            Bucket : config.aws_bucket,
            Key : filePath
        };

        this.s3Client.getObject(s3Params, (err, data) => {
            if(err){
                // TODO: Log error.
                return [false, fileContent];
            }
            
            // TODO: Validate File Contents are Parsed Correctly.
            fileContent = data.Body.toString();
        });

        // TODO: Log Success.

        return [true, fileContent];
    }
}
