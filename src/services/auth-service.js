'use strict'

import env from 'env-cat';
import jwt from 'jsonwebtoken';

exports.generateToken = async (data, expiresIn = env.get('TOKEN_LIFE')) => {
	return jwt.sign(data.toJSON(), env.get('SALT_KEY'), {expiresIn: expiresIn});
}

exports.generateTokenObject = async (data, expiresIn = env.get('TOKEN_LIFE')) => {
	return jwt.sign(data, env.get('SALT_KEY'), {expiresIn: expiresIn});
}

exports.decodeToken = async (token) => {
	return await jwt.verify(token, env.get('SALT_KEY'));
}

exports.validateToken = async (token) => {
	return new Promise((resolve, reject) => {
		if (!token) {
			reject('token is required');
		}
		jwt.verify(token, env.get('SALT_KEY'), (error, decoded) => {
			if (error) resolve(error);
			else resolve(decoded);
		})
	})
}

exports.authorize = async (req, res, next) => {
	const token = req.body.token || req.query.token || req.headers['x-access-token'];

	if (!token) {
		res.status(401).json({
			message: 'Acesso Restrito',
		});
	} else {
		jwt.verify(token, env.get('SALT_KEY'), (error, decoded) => {
			if (error) {
				res.status(401).json({
					message: 'Token Inválido',
				});
			} else {
				next();
			}
		});
	}
}
