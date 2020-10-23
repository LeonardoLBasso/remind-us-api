'use strict'

const env = require('env-cat');
const bodyParser = require('body-parser');

module.exports = bodyParser.raw({
	limit: env.get('JSONPARSER_LIMIT'),
});
