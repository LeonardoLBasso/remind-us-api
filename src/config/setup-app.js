'use strict'

import cors from '../middlewares/cors';
import jsonParser from '../middlewares/json-parser';
import rawParser from '../middlewares/raw-parser';
import contentType from '../middlewares/content-type';
import bodyParser from '../middlewares/body-parser';
import logger from '../middlewares/logger';

export default (app) => {
	app.disable('x-powered-by');
	app.use(cors)
	app.use(jsonParser)
	app.use(rawParser)
	app.use(contentType)
	app.use(bodyParser())
	app.use(logger)
}
