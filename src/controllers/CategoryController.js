'use strict'

import AbstractController from './AbstractController';

/**
 * @class CategoryController
 * @classdesc Classe responsável pelas ações de alteração, inserção e manipulação de dados de categorias
 * @extends {AbstractController}
 */
class CategoryController extends AbstractController {
	/**
     * Creates an instance of CategoryController.
     * @memberof CategoryController
     */
	constructor() {
		super('Category');
	}

	/**
	 * @param {Object} req
	 * @param {Object} res
	 * @return {Object}
	 * @description Método para buscar todas categorias com o id de usuário
	 * @memberof CategoryController
	 */
	getAllByUser(req, res) {
		const user = req.params.user;
		const promissor = {
			find: async (parameters) => {
				return await Model('Category').paginate({user}, parameters)
			},
		}

		return this.validateData(req.body, req.headers)
			.then(this.prepareParameters)
			.then(promissor.find)
			.then(this.successHandler)
			.catch(this.errorHandler);
	}
}

export default new CategoryController();
