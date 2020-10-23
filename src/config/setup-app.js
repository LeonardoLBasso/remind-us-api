'use strict'

const cors = require('../middlewares/cors');
const jsonParser = require('../middlewares/json-parser');
const rawParser = require('../middlewares/raw-parser');
const contentType = require('../middlewares/content-type');
const bodyParser = require('../middlewares/body-parser');
const logger = require('../middlewares/logger');

module.exports = (app) => {
	app.disable('x-powered-by');
	app.use(cors)
	app.use(jsonParser)
	app.use(rawParser)
	app.use(contentType)
	app.use(bodyParser())
	app.use(logger)
}
