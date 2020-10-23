'use strict'

const path = require('path');
const fs = require('fs');

module.exports = (app) => {
	const normallizedPath = path.join(__dirname, '/../routes');
	fs.readdirSync(normallizedPath).forEach((currentFile) => {
		// Adicionando arquivo de rota para a aplicação
		const currentRouteFile = require(`${normallizedPath}/${currentFile}`);
		const entityName = currentFile.replace(/Route.js/g, '').toLocaleLowerCase();
		app.use(`/api/v1/${entityName}`, currentRouteFile);
	});
};
