'use strict'

import env from 'env-cat';
import {genSaltSync, hashSync, compare} from 'bcrypt';

import {Model} from './../utils/functions/require';
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
	 * @return {Object}
	 * @description Método para efetuar o login de usuário
	 * @memberof AuthController
	 */
	login(req, res) {
		const data = req.body;
		const promissor = {
			validateExists: async () => {
				const {email} = data;
				const isUserExists = await Model('User').findOne({
					email,
				});
				// Verificando se o usuário existe na base de dados
				if (!isUserExists) {
					return Promise.reject('Usuário não encontrado');
				}
				return Promise.resolve(isUserExists)
			},
			validatePassword: async (user) => {
				const {password} = data;
				// Validando se a senha enviada é compatível à do usuário
				const isValidPassword = await compare(password, user.password);
				if (!isValidPassword) {
					return Promise.reject('E-mail ou Senha incorretos');
				}
				return Promise.resolve(user);
			},
			generateSessionToken: async (userCreated) => {
				// Gerando token de usuário
				const userToken = await AuthService.generateTokenObject({
					_id: userCreated._id,
					email: userCreated.email,
					name: userCreated.name,
				});

				return Promise.resolve({
					user: userCreated,
					token: userToken,
				});
			},
		}

		return this.validateData({...req.body, ...req.params}, req.headers)
			.then(promissor.validateExists)
			.then(promissor.validatePassword)
			.then(promissor.generateSessionToken)
			.then(this.successHandler)
			.catch(this.errorHandler);
	}

	/**
	 * @param {Object} req
	 * @param {Object} res
	 * @return {Object}
	 * @description Método para efetuar cadastros de usuário
	 * @memberof AuthController
	 */
	signin(req, res) {
		const data = req.body;
		const promissor = {
			validateExists: async () => {
				const {email} = data;
				const isUserExists = await Model('User').findOne({
					email,
				});
				if (isUserExists) {
					return Promise.reject('Já existe um usuário cadastrado com esse e-mail');
				}
				return Promise.resolve()
			},
			encryptPassword: async () => {
				// Pegando a senha e o salt rounds
				const {password} = data;
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
					user: userCreated,
					token: userToken,
				});
			},
		}

		return this.validateData({...req.body, ...req.params}, req.headers)
			.then(promissor.validateExists)
			.then(promissor.encryptPassword)
			.then(promissor.create)
			.then(promissor.generateSessionToken)
			.then(this.successHandler)
			.catch(this.errorHandler);
	}

	/**
	 * @param {Object} req
	 * @param {Object} res
	 * @return {Object}
	 * @description Método para efetuar atualização do perfil de usuário
	 * @memberof AuthController
	 */
	updateProfile(req, res) {
		const {name, email, user} = req.body;
		const promissor = {
			validateExists: async () => {
				const userExists = await Model('User').exists({
					_id: user,
				});
				if (!userExists) {
					return Promise.reject('Usuário não encontrado');
				}
				return Promise.resolve()
			},
			findAndUpdate: async () => {
				return await Model('User').findByIdAndUpdate(user, {
					name,
					email,
				}, {new: true});
			},
		}

		return this.validateData({...req.body, ...req.params}, req.headers, [{
			fieldName: 'photo',
		}])
			.then(promissor.validateExists)
			.then(promissor.findAndUpdate)
			.then(this.successHandler)
			.catch(this.errorHandler);
	}

	/**
	 * @param {Object} req
	 * @param {Object} res
	 * @return {Object}
	 * @description Método para efetuar atualização da imagem de perfil do usuário
	 * @memberof AuthController
	 */
	updateProfilePhoto(req, res) {
		const {photo, user} = req.body;
		const promissor = {
			validateExists: async () => {
				const userExists = await Model('User').exists({
					_id: user,
				});
				if (!userExists) {
					return Promise.reject('Usuário não encontrado');
				}
				return Promise.resolve()
			},
			updateProfile: async () => {
				return await Model('User').findByIdAndUpdate(user, {
					photo,
				}, {new: true});
			},
		}

		return this.validateData({...req.body, ...req.params}, req.headers)
			.then(promissor.validateExists)
			.then(promissor.updateProfile)
			.then(this.successHandler)
			.catch(this.errorHandler);
	}

	/**
	 * @param {Object} req
	 * @param {Object} res
	 * @return {Object}
	 * @description Método para efetuar atualização da senha usuário
	 * @memberof AuthController
	 */
	updatePassword(req, res) {
		const {password, user} = req.body;
		const promissor = {
			validateExists: async () => {
				const userExists = await Model('User').exists({
					_id: user,
				});
				if (!userExists) {
					return Promise.reject('Usuário não encontrado');
				}
				return Promise.resolve()
			},
			encryptPassword: async () => {
				// Pegando a senha e o salt rounds
				const saltRounds = parseInt(env.get('SALT_ROUNDS'));
				const salt = genSaltSync(saltRounds);

				// Gerando senha criptografada
				const encryptedPassword = hashSync(password, salt);

				return Promise.resolve(encryptedPassword);
			},
			updatePassword: async (encryptedPassword) => {
				return await Model('User').findByIdAndUpdate(user, {
					password: encryptedPassword,
				}, {new: true});
			},
		}

		return this.validateData({...req.body, ...req.params}, req.headers)
			.then(promissor.validateExists)
			.then(promissor.encryptPassword)
			.then(promissor.updatePassword)
			.then(this.successHandler)
			.catch(this.errorHandler);
	}
}

export default new AuthController();
