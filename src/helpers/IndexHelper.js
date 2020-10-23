'use strict'

const {createWriteStream} = require('fs')
const request = require('request')
const moment = require('moment')
const env = require('env-cat')

const {safeKey} = require('../utils/functions/safe-key')

/**
 * @class IndexHelper
 * @classdesc Classe responsável pela criação de métodos helper
 */
module.exports = class IndexHelper {
	/**
	 * @param {String} text
	 * @return {String}
	 * @memberof IndexHelper
	 */
	toCapitize(text) {
		if (typeof text !== 'string') return ''
		return text.charAt(0).toUpperCase() + text.splice(1)
	}

	/**
	* @param {array} array
	* @return {object}
	* @memberof Helper
	*/
	convertArrayToObject(array) {
		return Object.assign({}, array)
	}

	/**
     * @param {string} url
     * @return {Promise}
     * @memberof Helper
     */
	getContentFileByUrl(url) {
		return new Promise((resolve, reject) => {
			request(url, async (error, response, body) => {
				if (error) {
					reject(error)
				}

				resolve({
					response: response,
					body: body,
				})
			})
		})
	}

	/**
     * @param {array} array
     * @return {number}
     * @memberof Helper
     */
	getEmptyIndex(array) {
		let index = -1
		for (const key in array) {
			if (array[safeKey(key)].length === 0) {
				index = key
			}
		}
		return index
	}

	/**
     * @param {String} string
     * @return {Boolean}
     */
	stringToBoolean(string) {
		return string === 'true' ? true : false
	}

	/**
   * @param {array} data
   * @param {number} [perPage=env.get.ITEMS_PER_PAGE]
   * @param {number} [page=1]
   * @param {number} [totalDocs=0]
   * @return {array}
   * @memberof Helper
   */
	paginateArray(
		data,
		perPage = env.get('ITEMS_PER_PAGE'),
		page = 1,
		totalDocs = 0,
	) {
		const offset = page === 0 ? 0 : (page - 1) * perPage
		const paginatedItems = data.slice(offset).splice(0, perPage)
		const totalPages = Math.ceil(totalDocs / perPage)

		return {
			data: paginatedItems,
			totalDocs: totalDocs,
			totalPages: totalPages,
			limit: perPage,
			offset: offset,
			hasPrevPage: page - 1 < 0 ? true : false,
			hasNextPage: totalPages > page ? true : false,
			page: page,
		}
	}

	/**
   * @param {Date} date
   * @return {string}
   * @memberof Helper
   */
	convertDateToTitleData(date) {
		const dateArray = date.split(' ')
		return `${this.months[dateArray[1]]}, ${dateArray[3]}`
	}

	/**
     * @param {string} text
     * @param {string} find
     * @param {string} replace
     * @return {string}
     * @memberof Helper
    */
	replaceAll(text, find, replace) {
		return text.split(find).join(replace)
	}

	/**
   * @param {Stream} stream
   * @param {string} cachePath
   * @return {Promise}
   * @memberof Helper
   */
	async manageFileInDirectory(stream, cachePath) {
		return new Promise((resolve, reject) => {
			stream.pipe(createWriteStream(cachePath))
				.on('finish', () => resolve({cachePath}))
				.on('error', reject)
		})
	}

	/**
	 * @param {array} date
	 * @return {String}
	 * @memberof IndexHelper
	 */
	formatDateString(date) {
		const arrDate = date.split('/').reverse()
		if (arrDate.length === 3) {
			return arrDate.join('-')
		}
		return null
	}

	/**
	 * @param {Date} date
	 * @return {Boolean}
	 * @memberof Helper
	 */
	isValidDate(date) {
		return date instanceof Date && !isNaN(date)
	}

	/**
     * @param {String} scheduled
     * @param {String} timezone
     * @return {Date}
     * @memberof Helper
     */
	formatDate(scheduled, timezone = 'America/Sao_Paulo') {
		const formatDateScheduled = moment(scheduled)
			.tz(timezone)
			.subtract(3, 'hours')
			.format('YYYY-MM-DDTHH:mm:ss')
		return formatDateScheduled
	}

	/**
   * @param {Array} registeredData
   * @param {String} name
   * @return {object}
   * @memberof Helper
   */
	getRegisteredData(registeredData, name) {
		let foundRegister = {}
		registeredData.forEach((register) => {
			if (register.name === name) {
				foundRegister = register
			}
		})
		return foundRegister
	}

	/**
   * @param {object} line
   * @return {object}
   * @memberof Helper
   */
	validateLine(line) {
		const input = line.input || line.field
		if (input && input == '') {
			throw new Error('field name cannot be empty')
		}

		if (line.value == '') {
			throw new Error(`${input} cannot be empty`)
		}
		return true
	}

	/**
   * @param {Date} date
   * @memberof Helper
   * @return {Array}
   */
	getDaysOfWeek(date) {
		const initialDate = date
		const finalDate = date

		const dayWeek = date.getDay()
		if (dayWeek === 1) {
			finalDate.setDate(finalDate.getDate() + 6)
		} else {
			const distance = 7 - dayWeek
			initialDate.setDate(initialDate.getDate() + distance)

			finalDate.setDate(finalDate.getDate() - 7)
		}

		return {
			initial: initialDate,
			final: finalDate,
		}
	}

	/**
	 * @param {Array} array
	 * @param {String} fieldName
	 * @return {Array}
	 * @memberof IndexHelper
	 */
	removeDuplicatedObjects(array, fieldName = null) {
		const uniqueArray = []
		array.forEach((value) => {
			if (fieldName !== null) {
				if (!this.verifyIfObjectExists(uniqueArray, value, fieldName)) {
					uniqueArray.push(value)
				}
			} else if (!uniqueArray.includes(value)) {
				uniqueArray.push(value)
			}
		})
		return uniqueArray
	}
}
