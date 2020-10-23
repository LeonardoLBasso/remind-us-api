'use strict'

const express = require('express');

const {connection} = require('./db/connection');
const setupEnv = require('./config/setup-env');
const setupApp = require('./config/setup-app');
const setupRoute = require('./config/setup-route');

const app = express();

setupEnv();
setupApp(app);
setupRoute(app);

// Connect in mongo database
connection();

module.exports = app;
