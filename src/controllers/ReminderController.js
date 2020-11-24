'use strict'

import {Model} from './../utils/functions/require';
import {filterPeriod} from './../utils/functions/filterPeriod';
import AbstractController from './AbstractController';

/**
 * @class ReminderController
 * @classdesc Classe responsável pelas ações de alteração, inserção e manipulação de dados de lembretes
 * @extends {AbstractController}
 */
class ReminderController extends AbstractController {
	/**
      *Creates an instance of ReminderController.
     * @memberof ReminderController
     */
	constructor() {
		super('Reminder', [{
			fieldName: 'description',
		}, {
			fieldName: 'category',
		}]);
	}

	/**
	 * @param {Object} req
	 * @param {Object} res
	 * @return {Object}
	 * @description Método para buscar todos os lembretes com o id de usuário
	 * @memberof ReminderController
	 */
	getAllByUser(req, res) {
		const {user} = req.body;
		const promissor = {
			find: async (parameters) => {
				return await Model('Reminder').paginate({
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
	 * @description Método para buscar todos os lembretes com base em um filtro de tempo
	 * @memberof ReminderController
	 */
	getAllRemindersOfTheDay(req, res) {
		const {user, period} = req.params;
		const promissor = {
			getPeriodTypeFilter: async () => {
				const currentPeriodTypeFilter = filterPeriod('scheduled', period || 'week');

				return Promise.resolve(currentPeriodTypeFilter)
			},
			find: async (periodFilter) => {
				return await Model('Reminder').find({
					...periodFilter,
					deleted: false,
					user,
				})
			},
		}

		return this.validateData({...req.body, ...req.query}, req.headers)
			.then(promissor.getPeriodTypeFilter)
			.then(promissor.find)
			.then(this.successHandler)
			.catch(this.errorHandler);
	}

	getAllByCategoryList(req, res) {
		const {user} = req.body;
		const {category} = req.params;
		const promissor = {
			find: async () => {
				return await Model('Reminder').find({
					user,
					category,
					deleted: false,
				});
			}
		}

		return this.validateData({...req.body, ...req.query}, req.headers)
			.then(promissor.find)
			.then(this.successHandler)
			.catch(this.errorHandler);
	}

	/**
	 * @param {Object} req
	 * @param {Object} res
	 * @return {Object}
	 * @description Método para buscar todos os lembretes com o id de usuário
	 * @memberof CategoryController
	 */
	getAllByUserList(req, res) {
		const {user} = req.body;
		const promissor = {
			find: async (parameters) => {
				return await Model('Reminder').find({
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
}

export default new ReminderController();
