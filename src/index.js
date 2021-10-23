import 'dotenv/config';
import firebaseAdmin from 'firebase-admin';
import http from 'http';
import { firebaseConfig, databaseURL } from './config/firebaseConfig';
import server from './server';

const { PORT } = process.env;
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(firebaseConfig),
  databaseURL,
});
http.createServer({}, server).listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
