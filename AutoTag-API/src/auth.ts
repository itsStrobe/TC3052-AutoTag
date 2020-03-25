import { Request, Response, NextFunction} from 'express';

const CLIENT_ID = '380242022085-tkcv4ud9fcogv5tq7t8fv6jprn3mt2b8.apps.googleusercontent.com'
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

export async function facebookAuth(req:Request, res:Response, next:NextFunction) {
  try {
    const token = (req as any).token;
    console.log(token);
    if (!token) {
      return res.status(401).send('Not Authorised');
    }
    next();
  }
  catch (err) {
    return res.status(401).send(err.message);
  }
}
