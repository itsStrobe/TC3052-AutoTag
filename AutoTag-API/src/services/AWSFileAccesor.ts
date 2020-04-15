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

    private async tryDownloadStream(filePath : string) : Promise<[boolean, ReadableStream]> {

        console.log("Downloading File Stream");

        let resp;

        const getObject = key => {
            return new Promise((resolve, reject) => {
                this.s3Client.getObject({
                    Bucket: config.aws_bucket,
                    Key : key
                }, (err, data) => {
                    if(err) {
                        reject(err);
                    }
                    else {
                        resolve(data.Body);
                    }
                })
            })
        }

        try {
            resp = await getObject(filePath);
        } catch(err) {
            // TODO: Log Error
            console.error(err);
            return [false, null];
        }

        // TODO: Log Success.
        return [true, resp];
    }

    /*
        DownloadFileAsString

        Sample Use:
            const awsAccessorServiceInstance = Container.get(AwsAccessorService);

            let awsFileContent = await awsAccessorServiceInstance.downloadFileAsString("path/to/file");
    */
    async downloadFileAsString(filePath : string) : Promise<string> {
        console.log("Downloading File");

        let fileContent;

        await this.tryDownloadStream(filePath).then(([success, stream]) => {
            if(!success){
                // TODO: Log Error
                return null;
            }

            // TODO: Validate File Contents are Parsed Correctly.
            fileContent = stream.toString();
        });

        // TODO: Log Success.
        return fileContent;
    }

    /*
        DownloadFileAsList

        Sample Use:
            const awsAccessorServiceInstance = Container.get(AwsAccessorService);

            let awsFileContent = await awsAccessorServiceInstance.downloadFileAsList("path/to/file");
    */
    async downloadFileAsList(filePath : string) : Promise<string[]> {
        console.log("Downloading File");

        let fileContent = [];

        await this.tryDownloadStream(filePath).then(([success, stream]) => {
            if(!success){
                // TODO: Log Error
                return null;
            }

            console.log(stream);

            // TODO: Validate File Contents are Parsed Correctly.
            // TODO: Make this more efficient by reading directly from the stream ffs...
            fileContent = stream.toString().split(/(?:\r\n|\r|\n)/g);
        });

        // TODO: Log Success.
        return fileContent;
    }
}
