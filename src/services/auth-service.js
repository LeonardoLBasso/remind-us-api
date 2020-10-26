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

exports.authorize = async (token) => {
	let response = null;
	if (token) {
		await jwt.verify(token, env.get('SALT_KEY'), (error, decoded) => {
			if (!error) {
				response = decoded;
			}
		})
	}

	return response;
}
