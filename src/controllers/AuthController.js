'use strict'

const AbstractController = require('./AbstractController');

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
     * @param {object} req
     * @param {object} res
	 */
	login(req, res) {

	}
}

module.exports = new AuthController();
