import 'dotenv/config.js';

import compression from 'compression';
import cors from 'cors';
import path from 'path';
import express from 'express';
import passport from 'passport';

import { initPassport } from '../config/passport.js';
import users from '../routes/users.js';
import admin from '../routes/admin.js';

import db from './database.js';
const server = express();
server.use(compression());

initPassport(passport);
server.use(passport.initialize());

if (process.env.NODE_ENV !== 'test') {
  db.connect();
}

server.use(cors());
server.use(express.json());
// server.use(express.static(path.join(__dirname, '../../../frontend/build')))
server.use('/api/users', users);
server.use('/api/admin', admin);
server.get('/', (req, res) => {
  res.send('Hello ');

  res.end();
});

export default server;
