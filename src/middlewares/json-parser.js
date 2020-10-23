'use strict'

const env = require('env-cat');
const bodyParser = require('body-parser');

module.exports = bodyParser.json({
	limit: env.get('JSONPARSER_LIMIT'),
});
