'use strict'

import {Model} from '../utils/functions/require';
import helper from '../helpers/AbstractHelper';

import LocaleService from '../translate/LocaleService';

import HandleRequisition from '../utils/classes/HandleRequisition';

/**
 * @class AbstractResolver
 * @classdesc Classe responsável por métodos abstratos de CRUD
 * @export
 */
export default class AbstractResolver extends HandleRequisition {
	/**
	 * Creates an instance of AbstractResolver.
	 * @param {string} entity
	 * @param {Array<string>} [exceptionFields=[]]
	 * @memberof AbstractResolver
	 */
	constructor(entity, exceptionFields = []) {
		super(entity)
		this.exceptionFields = exceptionFields;
	}

	/**
     * @param {object} req
     * @param {object} res
	 * @return {object}
	 */
	add(req, res) {
		const {data, user} = req.body
		const promissor = {
			store: async () => {
				return await Model(this.entity).create({
					...data,
					user,
				})
			},
			find: async (newRegister) => {
				return await Model(this.entity).findById(newRegister._id)
			},
		}

		return this.validateData([...req.body, ...req.params], req.headers, this.exceptionFields)
			.then(this.formatDate)
			.then(promissor.store)
			.then(promissor.find)
			.then(this.successHandler)
			.catch(this.errorHandler)
	}

	/**
     * @param {object} req
     * @param {object} res
	 * @return {object}
	 */
	addMany(req, res) {
		const {data, user} = req.body
		const promissor = {
			register: async () => {
				data.map(async (currentRegister) => {
					await Model(this.entity).create({
						...currentRegister,
						user,
					}, (err) => {
						if (err) {
							return Promise.reject(LocaleService.translate('ABSTRACT_fail_register', context.language))
						}
					})
				})
				return Promise.resolve(true)
			},
		}

		return this.validateData([...req.body, ...req.params], req.headers, this.exceptionFields)
			.then(promissor.register)
			.then(this.successHandler)
			.catch(this.errorHandler)
	}

	/**
     * @param {object} req
     * @param {object} res
	 * @return {object}
	 */
	update(req, res) {
		const {id} = req.params
		const {data, user} = req.body
		const promissor = {
			update: async () => {
				return await Model(this.entity).findByIdAndUpdate(id, {
					...data,
					user,
				}, {
					new: true,
				})
			},
		}

		return this.validateData([...req.body, ...req.params], req.headers, this.exceptionFields)
			.then(this.formatDate)
			.then(promissor.update)
			.then(this.successHandler)
			.catch(this.errorHandler)
	}

	/**
     * @param {object} req
     * @param {object} res
	 * @return {object}
	 */
	updateWhere(req, res) {
		const {where, data} = req.body
		const promissor = {
			prepareConditions: async () => {
				return helper.groupFieldsAndConvertObject(where)
			},
			update: async (where) => {
				return await Model(this.entity).findAndUpdate(where, data, {
					new: true,
				})
			},
		}

		return this.validateData([...req.body, ...req.params], req.headers, this.exceptionFields)
			.then(promissor.validate)
			.then(promissor.update)
			.then(this.successHandler)
			.catch(this.errorHandler)
	}

	/**
     * @param {object} req
     * @param {object} res
	 * @return {object}
	 */
	remove(req, res) {
		const {id} = req.params
		const promissor = {
			find: async () => {
				return await Model(this.entity).findById(id)
			},
			delete: async (data) => {
				await data.delete()
				return true
			},
		}

		return this.validateData([...req.body, ...req.params], req.headers, this.exceptionFields)
			.then(promissor.find)
			.then(promissor.delete)
			.then(this.successHandler)
			.catch(this.errorHandler)
	}

	/**
     * @param {object} req
     * @param {object} res
	 * @return {object}
	 */
	removeWhere(req, res) {
		const {where} = req.body
		const promissor = {
			prepareConditions: async () => {
				return helper.groupFieldsAndConvertObject(where)
			},
			find: async (conditions) => {
				return await Model(this.entity).find(conditions)
			},
			delete: async (data) => {
				data.map(async (register) => {
					register.delete()
				})
				return Promise.resolve(true)
			},
		}

		return this.validateData([...req.body, ...req.params], req.headers, this.exceptionFields)
			.then(promissor.prepareConditions)
			.then(promissor.find)
			.then(promissor.delete)
			.then(this.successHandler)
			.catch(this.errorHandler)
	}

	/**
     * @param {object} req
     * @param {object} res
	 * @return {object}
	 */
	restore(req, res) {
		const {id} = req.body
		const promissor = {
			find: async () => {
				return await Model(this.entity).findOne({
					id,
					deleted: true,
				})
			},
			restore: async (data) => {
				await data.restore()
				return data
			},
		}

		return this.validateData([...req.body, ...req.params], req.headers, this.exceptionFields)
			.then(promissor.find)
			.then(promissor.restore)
			.then(this.successHandler)
			.catch(this.errorHandler)
	}

	/**
     * @param {object} req
     * @param {object} res
	 * @return {object}
	 */
	get(req, res) {
		const {id, withTrashed} = req.body
		const promissor = {
			get: async () => {
				return await Model(this.entity).findOne({
					id,
					deleted: withTrashed ? withTrashed : false,
				})
			},
		}

		return this.validateData([...req.body, ...req.params], req.headers, this.exceptionFields)
			.then(promissor.get)
			.then(this.successHandler)
			.catch(this.errorHandler)
	}

	/**
     * @param {object} req
     * @param {object} res
	 * @return {object}
	 */
	getBy(req, res) {
		const {data} = req.body
		const promissor = {
			prepareConditions: async () => {
				return helper.groupFieldsAndConvertObject(data)
			},
			getBy: async (where) => {
				return await Model(this.entity).findOne(where)
			},
		}

		return this.validateData([...req.body, ...req.params], req.headers, this.exceptionFields)
			.then(promissor.prepareConditions)
			.then(promissor.getBy)
			.then(this.successHandler)
			.catch(this.errorHandler)
	}

	/**
     * @param {object} req
     * @param {object} res
	 * @return {object}
	 */
	getAllBy(req, res) {
		const {data, withTrashed, page, limit, orderBy} = req.body
		const promissor = {
			prepareParameters: async () => {
				const parameters = {
					page: page ? page : 1,
					limit: helper.limitFormatter(limit),
					sort: orderBy ? orderBy : '',
				}
				return parameters
			},
			prepareConditions: async (parameters) => {
				const where = helper.groupFieldsAndConvertObject(data, withTrashed)
				return Promise.resolve({
					parameters,
					where,
				})
			},
			getAllBy: async ({parameters, where}) => {
				return await Model(this.entity).paginate(where, parameters)
			},
		}

		return this.validateData([...req.body, ...req.params], req.headers, this.exceptionFields)
			.then(promissor.prepareParameters)
			.then(promissor.prepareConditions)
			.then(promissor.getAllBy)
			.then(this.successHandler)
			.catch(this.errorHandler)
	}

	/**
     * @param {object} req
     * @param {object} res
	 * @return {object}
	 */
	getAll(req, res) {
		const {page, limit, orderBy, withTrashed} = req.body
		const promissor = {
			prepareParameters: async () => {
				const parameters = {
					page: page ? page : 1,
					limit: helper.limitFormatter(limit),
					sort: orderBy ? orderBy : '',
				}

				return parameters
			},
			getAll: async (parameters) => {
				return await Model(this.entity).paginate({
					deleted: withTrashed ? withTrashed : false,
				}, parameters)
			},
		}

		return this.validateData([...req.body, ...req.params], req.headers, this.exceptionFields)
			.then(promissor.prepareParameters)
			.then(promissor.getAll)
			.then(this.successHandler)
			.catch(this.errorHandler)
	}

	/**
     * @param {object} req
     * @param {object} res
	 * @return {object}
	 */
	getAllList(req, res) {
		const {limit, orderBy} = req.body
		const promissor = {
			findTotal: async () => {
				return await Model(this.entity).countDocuments()
			},
			find: async (totalDocs) => {
				if (!orderBy) {
					return await Model(this.entity)
						.find()
						.limit(limit ? limit : totalDocs)
				} else {
					return await Model(this.entity)
						.find()
						.limit(limit ? limit : totalDocs)
						.sort(orderBy)
				}
			},
		}

		return this.validateData([...req.body, ...req.params], req.headers, this.exceptionFields)
			.then(promissor.findTotal)
			.then(promissor.find)
			.then(this.successHandler)
			.catch(this.errorHandler)
	}

	/**
     * @param {object} req
     * @param {object} res
	 * @return {object}
	 */
	getByCompany(req, res) {
		const {company} = req.body
		const promissor = {
			find: async () => {
				return await Model(this.entity).findOne({company})
			},
		}

		return this.validateData([...req.body, ...req.params], req.headers, this.exceptionFields)
			.then(promissor.find)
			.then(this.successHandler)
			.catch(this.errorHandler)
	}

	/**
     * @param {object} req
     * @param {object} res
	 * @return {object}
	 */
	getAllByCompany(req, res) {
		const {data, company, page, limit, orderBy, withTrashed} = req.body
		const promissor = {
			prepareParameters: async () => {
				const parameters = {
					page: page ? page : 1,
					limit: helper.limitFormatter(limit),
					sort: orderBy ? orderBy : '',
				}
				return parameters
			},
			prepareConditions: async (parameters) => {
				const where = helper.groupFieldsAndConvertObject(data, withTrashed)
				return Promise.resolve({
					parameters,
					where,
				})
			},
			getAllByCompany: async ({where, parameters}) => {
				return await Model(this.entity).paginate({
					...where,
					company,
				}, parameters)
			},
		}

		return this.validateData([...req.body, ...req.params], req.headers, this.exceptionFields)
			.then(promissor.prepareParameters)
			.then(promissor.prepareConditions)
			.then(promissor.getAllByCompany)
			.then(this.successHandler)
			.catch(this.errorHandler)
	}

	/**
     * @param {object} req
     * @param {object} res
	 * @return {object}
	 */
	getAllByCompanyList(req, res) {
		const {company, withTrashed, orderBy} = req.body
		const promissor = {
			getAllByCompany: async () => {
				return await Model(this.entity).find({
					company,
					deleted: withTrashed ? withTrashed : false,
				}).sort(orderBy ? orderBy : '')
			},
		}

		return this.validateData([...req.body, ...req.params], req.headers, this.exceptionFields)
			.then(promissor.getAllByCompany)
			.then(this.successHandler)
			.catch(this.errorHandler)
	}
}
