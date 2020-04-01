import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as bearerToken from 'express-bearer-token';
import { facebookAuth } from './auth'
import { projectRouter } from './api/project';

const app = express()
  .use(cors())
  .use(bodyParser.json())
  .use(bearerToken())
  .use(facebookAuth)
  .use(projectRouter);

app.listen(4201, (err) => {
  if (err) {
    return console.log(err);
  }

  return console.log('AutoTagServer listening on port 4201');
});