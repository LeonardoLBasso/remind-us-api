'use strict'

import env from 'env-cat';
import bodyParser from 'body-parser';

export default () => {
	return bodyParser.urlencoded({
		limit: env.get('BODYPARSER_LIMIT'),
		extended: env.get('BODYPARSER_EXTEND'),
	});
};
