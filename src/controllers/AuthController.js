'use strict'

import env from 'env-cat';
import { genSaltSync, hashSync } from 'bcrypt';

import { Model } from './../utils/functions/require';
import AuthService from './../services/auth-service';
import AbstractController from './AbstractController';

/**
 * @class AuthController
 * @classdesc Classe responsável pelo métodos de autenticação da plataforma
 * @extends {AbstractController}
 */
class AuthController extends AbstractController {
	/**
     * Creates an instance of AuthController.
     * @memberof AuthController
     */
	constructor() {
		super('User');
	}

	/**
	 * @param {Object} req
	 * @param {Object} res
	 * @description Método para efetuar cadastros de usuário
	 * @memberof AuthController
	 */
	signin(req, res) {
		const data = req.body;
		const promissor = {
			validateExists: async () => {
				const { email } = data;
				const isUserExists = await Model('User').findOne({
					email
				});
				if (isUserExists) {
					return Promise.reject('Já existe um usuário cadastrado com esse e-mail');
				}
				return Promise.resolve()
			},
			encryptPassword: async () => {
				// Pegando a senha e o salt rounds
				const { password } = data;
				const saltRounds = parseInt(env.get('SALT_ROUNDS'));
				const salt = genSaltSync(saltRounds);

				// Gerando senha criptografada
				const encryptedPassword = hashSync(password, salt);

				return Promise.resolve(encryptedPassword);
			},
			create: async (encryptedPassword) => {
				// Criando o usuário
				const userCreated = await Model('User').create({
					...data,
					password: encryptedPassword,
				});

				return Promise.resolve(userCreated);
			},
			generateSessionToken: async (userCreated) => {
				// Gerando token de usuário
				const userToken = await AuthService.generateTokenObject({
					_id: userCreated._id,
					email: userCreated.email,
					name: userCreated.name,
				});

				return Promise.resolve({
					success: true,
					user: userCreated,
					token: userToken,
				});
			}
		}

		return this.validateData(req.body, req.headers)
			.then(promissor.validateExists)
			.then(promissor.encryptPassword)
			.then(promissor.create)
			.then(promissor.generateSessionToken)
			.then(this.successHandler)
			.catch(this.errorHandler);
	}
}

export default new AuthController();
