'use strict'

import AbstractController from './AbstractController';
import {Model} from '../utils/functions/require';

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
		super('Category', [{
			fieldName: 'description',
		}]);
	}

	/**
	 * @param {Object} req
	 * @param {Object} res
	 * @return {Object}
	 * @description Método para buscar todas categorias com o id de usuário
	 * @memberof CategoryController
	 */
	getAllByUser(req, res) {
		const {user} = req.body;
		const promissor = {
			find: async (parameters) => {
				return await Model('Category').paginate({
					user,
					deleted: false,
				}, parameters)
			},
		}

		return this.validateData({...req.body, ...req.query}, req.headers)
			.then(this.prepareParameters)
			.then(promissor.find)
			.then(this.successHandler)
			.catch(this.errorHandler);
	}

	/**
	 * @param {Object} req
	 * @param {Object} res
	 * @return {Object}
	 * @description Método para buscar todas categorias com o id de usuário
	 * @memberof CategoryController
	 */
	getAllByUserList(req, res) {
		const {user} = req.body;
		const promissor = {
			find: async () => {
				return await Model('Category').find({
					user,
					deleted: false,
				})
			},
		}

		return this.validateData({...req.body, ...req.query}, req.headers)
			.then(promissor.find)
			.then(this.successHandler)
			.catch(this.errorHandler);
	}
}

export default new CategoryController();
