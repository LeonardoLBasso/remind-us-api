'use strict'

const env = require('env-cat')

const IndexHelper = require('./IndexHelper')

/**
 * @class AbstractHelper
 * @classdesc Classe responsável pela criação de métodos helper
 */
class AbstractHelper extends IndexHelper {
	/**
     * Creates an instance of AbstractHelper.
     * @memberof AbstractHelper
     */
	constructor() {
		super()
	}
	/**
   * @param {array} data
   * @param {boolean} [withTrashed=false]
   * @return {boolean}
   * @memberof Helper
   */
	groupFieldsAndConvertObject(data, withTrashed = false) {
		const fields = []
		fields['deleted'] = withTrashed ? withTrashed : false
		if (data) {
			data.forEach((line) => {
				if (this.validateLine(line)) {
					if (line.value != '') {
						fields[line.input] = {
							$regex: line.value,
							$options: 'i',
						}
					}
				}
			})
		}

		return this.convertArrayToObject(fields)
	}

	/**
	 * @param {number} limit
	 * @return {number}
	 * @memberof AbstractHelper
	 */
	limitFormatter(limit) {
		return limit ?
			limit > env.get('MAXIMUM_ITEMS_PER_PAGE') ?
				env.get('MAXIMUM_ITEMS_PER_PAGE') :
				limit
			: env.get('ITEMS_PER_PAGE')
	}
}

module.exports = new AbstractHelper()
