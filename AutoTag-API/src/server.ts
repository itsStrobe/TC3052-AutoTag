import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
const bearerToken = require('express-bearer-token');
import {router as projectRouter} from './project'
import {facebookAuth} from './auth'

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