'use strict'

import env from 'env-cat';
import bodyParser from 'body-parser';

export default bodyParser.json({
	limit: env.get('JSONPARSER_LIMIT'),
});
