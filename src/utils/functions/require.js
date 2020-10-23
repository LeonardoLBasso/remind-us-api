'use strict'

const {safeKey} = require('./safe-key');

const getControllerData = (entityCall) => {
	const entityCallArray = entityCall.split('@');
	const controllerName = entityCallArray[0];
	const controllerMethod = entityCallArray[1];

	return ({
		controllerName,
		controllerMethod,
	});
};

exports.Controller = (entityCall) => async (req, res) => {
	try {
		const {controllerName, controllerMethod} = getControllerData(entityCall);
		const currentController = require(`../../controllers/${controllerName}Controller`);
		const controllerResult = await currentController[safeKey(controllerMethod)](req, req);

		res.status(200).send({
			success: true,
			data: controllerResult,
		});
	} catch (err) {
		res.status(500).send({
			success: false,
			message: err,
		});
	}
};

exports.Model = (entity) => {
	return require(`../../models/${entity}`);
}
