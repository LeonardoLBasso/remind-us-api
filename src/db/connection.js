'use strict'

import mongoose from 'mongoose';
import env from 'env-cat';

import logger from '../core/logger';

export const connection = async () => {
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
