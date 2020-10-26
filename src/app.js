'use strict'

import express from 'express';

import {connection} from './db/connection';
import setupEnv from './config/setup-env';
import setupApp from './config/setup-app';
import setupRoute from './config/setup-route';

const app = express();

setupEnv();
setupApp(app);
setupRoute(app);

// Connect in mongo database
connection();

export default app;
