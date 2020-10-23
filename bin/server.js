'use strict'

const env = require('env-cat');
const { createServer } = require('http');
const debug = require('debug');

const app = require('../src/app');
const logger = require('../src/core/logger');

const port = normalizePort(env.get('PORT') || '7000');
app.set('port', port);

debug('remind-us:server');

const httpServer = createServer(app);

httpServer.listen(port, () => {
	logger.info(`🤖  API rodando em http://localhost:${port}/api/v1`)
	logger.info(`🤖  Subscriptions prontas em ws://localhost:${port}/websocket`)
})

/**
 * @param {String} val
 * @description Função para verificar a porta disponivel e normaliza-la
 * @return {String | Boolean}
 */
function normalizePort(val) {
	const port = parseInt(val, 10)

	if (isNaN(port)) {
		return val
	}

	if (port >= 0) {
		return port
	}

	return false
}