'use strict'

import env from 'env-cat';
import { createServer } from 'http';
import debug from 'debug';

import app from '../src/app';
import logger from '../src/core/logger';

const port = normalizePort(env.get('PORT') || '7000');
app.set('port', port);

debug('remind-us:server');

const httpServer = createServer(app);

httpServer.listen(port, () => {
	logger.info(`🤖  API rodando em http://localhost:${port}/api/v1`);
})

/**
 * @param {String} val
 * @description Função para verificar a porta disponivel e normaliza-la
 * @return {String | Boolean}
 */
function normalizePort(val) {
	const port = parseInt(val, 10);

	if (isNaN(port)) {
		return val;
	}

	if (port >= 0) {
		return port;
	}

	return false;
}