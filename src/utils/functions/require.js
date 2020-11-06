'use strict'

import {safeKey} from './safe-key';

import {decodeToken} from '../../services/auth-service';

const getControllerData = (entityCall) => {
	const entityCallArray = entityCall.split('@');
	const controllerName = entityCallArray[0];
	const controllerMethod = entityCallArray[1];

	return ({
		controllerName,
		controllerMethod,
	});
};

export const Controller = (entityCall) => async (req, res) => {
	try {
		// Pegando a sessão atual do usuário
		let user = null
		if (req.headers['x-access-token']) {
			const {_id} = await decodeToken(req.headers['x-access-token']);
			user = _id
		}

		const {controllerName, controllerMethod} = getControllerData(entityCall);
		const currentController = require(`../../controllers/${controllerName}Controller`);
		const controllerResult = await currentController.default[safeKey(controllerMethod)]({
			...req,
			body: {
				...req.body,
				user,
			},
		}, res);

		res.status(200).send({
			success: true,
			data: controllerResult,
		});
	} catch (err) {
		res.status(500).send({
			success: false,
			message: err.message,
		});
	}
};

export const Model = (entity) => {
	const currentModel = require(`../../models/${entity}`);
	return currentModel.default;
}
