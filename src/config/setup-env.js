'use strict'

const env = require('env-cat');

module.exports = (envName = env.get('NODE_ENV').replace(/ /g, '')) => {
	env.initEnv(envName);
};
