'use strict'

const fs = require('fs');
const path = require('path');

const LocaleService = require('../../translate/LocaleService');
const AbstractHelper = require('../../helpers/AbstractHelper');
const {safeKey} = require('../functions/safe-key');

/**
 * @export
 * @class HandleRequisition
 * @classdesc Classe responsável por métodos utilitários para os Schemas
 */
module.exports = class HandleRequisition {
	/**
	 * Creates an instance of HandleRequisition.
	 * @param {String} entity
	 * @memberof HandleRequisition
	 */
	constructor(entity) {
		if (entity && entity != '') {
			this.entity = entity
		}

		this.successHandler = this.successHandler.bind(this)
		this.errorHandler = this.errorHandler.bind(this)
		this.registerModelEntity()
	}

	/**
	 * @return {void}
	 * @memberof HandleRequisition
	 */
	registerModelEntity() {
		const normallizedPath = path.join(__dirname, '../../models')
		const exceptionFiles = ['index.js', 'ModelConstructor.js']
		fs.readdirSync(normallizedPath).forEach((file) => {
			if (!exceptionFiles.includes(file)) require(`${normallizedPath}/${file}`)
		})
	}

	/**
	 * @param {object} args
	 * @param {object} context
	 * @return {Promise}
	 * @memberof AbstractResolver
	 */
	validate(args, context = null) {
		const {_id, data} = args
		if (_id == '') {
			return Promise.reject(LocaleService.translate('ABSTRACT_id_empty', context.language))
		}
		if (!data) {
			return Promise.resolve(args)
		}
		return this.validateData(args.data, context)
	}

	/**
	 * @param {object} data
	 * @param {Array} exceptionFields
	 * @description Essa é uma função recursiva que tem o objetivo de detectar campos vazios e validalos
	 * @return {Array}
	 */
	getAllEmptyFields(data, exceptionFields = []) {
		let emptyFields = []
		Object.keys(data).forEach((inputName) => {
			let isValid = false
			// Validando se o campo atual está no array de exceções
			// Caso ele tenha uma condicional para ser exceção ele será validado
			exceptionFields.forEach((exceptionField) => {
				if (
					exceptionField.fieldName == inputName &&
					(exceptionField.condition || typeof exceptionField.condition === 'undefined')
				) {
					isValid = true
				}
			})

			if (!isValid) {
				// Caso o indice atual seja do tipo array, ele deve validar a quantidade de indices
				if (Array.isArray(data[safeKey(inputName)]) && data[safeKey(inputName)].length == 0) {
					emptyFields.push(inputName)
					// Caso ele seja um array e contenha mais de um indice ele deve percorrer cada indice o validando
				} else if (Array.isArray(data[safeKey(inputName)])) {
					data[safeKey(inputName)].forEach((dataField, index) => {
						if (typeof dataField !== 'object' && dataField === '') {
							emptyFields.push(`${inputName}.${index}`)
						} else {
							const tempEmptyFields = this.getAllEmptyFields(dataField, exceptionFields)
							const filteredNameFields = tempEmptyFields.map(
								(emptyFieldName) => `${inputName}.${index}.${emptyFieldName}`,
							)
							emptyFields = [...emptyFields, ...filteredNameFields]
						}
					})
					// Caso ele seja do tipo objeto, ele deve percorrer cada atributo do objeto validando se esta vazio
				} else if (typeof data[safeKey(inputName)] == 'object') {
					if (data[safeKey(inputName)] == null) {
						emptyFields.push(inputName)
					} else {
						const tempEmptyFields = this.getAllEmptyFields(data[safeKey(inputName)], exceptionFields)
						const filteredNameFields = tempEmptyFields.map(
							(emptyFieldName) => `${inputName}.${emptyFieldName}`,
						)
						emptyFields = [...emptyFields, ...filteredNameFields]
					}
					// Caso ele seja uma string ele deve apenas validar se ela esta vazia
				} else if (typeof data[safeKey(inputName)] === 'string' && data[safeKey(inputName)] === '') {
					emptyFields.push(inputName)
				}
			}
		})

		return emptyFields
	}

	/**
	 * @param {object} args
	 * @param {object} context
	 * @param {Array} exceptionFields
	 * @return {Promise}
	 * @memberof AbstractResolver
	 */
	validateData(args, context = null, exceptionFields = []) {
		const emptyFields = this.getAllEmptyFields(args, exceptionFields)
		const errorMessage = emptyFields.join(', ')
		if (emptyFields.length > 0) {
			throw new Error(
				LocaleService.translate('ABSTRACT_empty_fields_detect {{emptyFields}}', context.language, {
					emptyFields: errorMessage,
				}),
			)
		}
		if (context) {
			return Promise.resolve({
				data: args,
				context,
			})
		}

		return Promise.resolve(args)
	}

	/**
	 * @param {object} data
	 * @return {object}
	 * @memberof AbstractResolver
	 */
	formatDate({data: args, context}) {
		const data = args.data ? args.data : args
		if (context && context.userSession) {
			if (data.scheduled) {
				data.scheduled = AbstractHelper.formatDate(data.scheduled, context.userSession.timezone)
			}
			if (context.userSession.timezone) {
				data.timezone = context.userSession.timezone
			}
		}
		args = data

		return args
	}

	/**
	 * @param {object} event
	 * @return {object}
	 * @memberof AbstractResolver
	 */
	prepareParameters(event) {
		event = event.queryStringParameters ? event.queryStringParameters : {}
		return {
			page: event.page ? event.page : 1,
			limit: abstractHelper.limitFormatter(event.limit),
			sort: event.orderBy ? event.orderBy : '',
		}
	}

	/**
	 * @param {object} success
	 * @return {object}
	 * @memberof AbstractResolver
	 */
	successHandler(success) {
		return {
			statusCode: 200,
			body: JSON.stringify(success),
		}
	}

	/**
	 * @param {Object} error
	 * @memberof AbstractResolver
	 * @return {object}
	 */
	errorHandler(error) {
		const code = error.message.match(/\[(\d+)\]/)
		const msg = error.message.match(/[a-z ]/gi).join('').trim()
		return ({
			statusCode: code ? code[1] : 500,
			body: JSON.stringify({
				code: code ? code[1] : 500,
				mensage: msg ? msg : 'Bad request',
			}),
		})
	}
}
