import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as bearerToken from 'express-bearer-token';
import { facebookAuth } from './auth'
import { projectRouter } from './api/project';
import config from './config';
import { Container } from 'typedi';
import AwsAccessorService from './services/AWSFileAccesor';

const app = express()
  .use(cors())
  .use(bodyParser.json())
  .use(bearerToken())
  .use(facebookAuth)
  .use(projectRouter);

const pjson = require('../package.json');

app.post(`/${pjson.name}/debug/${pjson.version}/DownloadFromBucket/`, (req, res) => {
  console.log("DEBUG: DownloadFromBucket");

  const awsAccessorServiceInstance = Container.get(AwsAccessorService);

  var fileLoc = req.body.fileLoc;

  if(!fileLoc){
    res.statusMessage = "Please send the 'fileLoc' as parameter in the Body.";
    return res.status(406).end();
  }

  let awsFile = awsAccessorServiceInstance.tryDownloadFile(fileLoc);

  if(!awsFile[0]){
    res.statusMessage = `There are no file in 'fileLoc=${fileLoc}'`;
    return res.status(400).end();
  }

  let result = {
    fileContent : awsFile[0]
  };

  return res.status(200).json(result);
});

app.listen(config.port, (err) => {
  if (err) {
    return console.log(err);
  }

  // Run loaders
  require('./loaders').default();

  return console.log(`${pjson.name} listening on port ${config.port}`);
});