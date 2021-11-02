import 'dotenv/config';

import compression from 'compression';
import cors from 'cors';

import express from 'express';
import passport from 'passport';

import { initPassport } from '../config/passport.js';
import users from '../routes/users.js';
import admin from '../routes/admin';

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

server.use('/api/users', users);
server.use('/api/admin', admin);

export default server;
