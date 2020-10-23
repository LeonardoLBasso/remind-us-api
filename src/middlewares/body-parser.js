'use strict'

const env = require('env-cat');
const bodyParser = require('body-parser');

module.exports = () => {
	return bodyParser.urlencoded({
		limit: env.get('BODYPARSER_LIMIT'),
		extended: env.get('BODYPARSER_EXTEND'),
	});
};
