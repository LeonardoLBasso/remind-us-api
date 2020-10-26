'use strict'

import path from 'path';
import fs from 'fs';

export default (app) => {
	const normallizedPath = path.join(__dirname, '/../routes');
	fs.readdirSync(normallizedPath).forEach((currentFile) => {
		// Adicionando arquivo de rota para a aplicação
		const currentRouteFile = require(`${normallizedPath}/${currentFile}`);
		const entityName = currentFile.replace(/Route.js/g, '').toLocaleLowerCase();
		app.use(`/api/v1/${entityName}`, currentRouteFile.router);
	});
};
