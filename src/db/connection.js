'use strict'

const mongoose = require('mongoose');

const env = require('env-cat');
const logger = require('../core/logger');

exports.connection = async () => {
	// Connect mongo database
	mongoose.Promise = global.Promise
	if (mongoose.connection.readyState !== 0) {
		return;
	}
	mongoose.connect(env.get('CONNECTION_STRING'), {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: true,
		useCreateIndex: true,
	})
		.then(() => logger.info(`Connected in ${env.get('NODE_ENV')} environment`))
		.catch(logger.error)
}
