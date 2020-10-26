'use strict'

import env from 'env-cat';

export default (envName = env.get('NODE_ENV').replace(/ /g, '')) => {
	env.initEnv(envName);
};
