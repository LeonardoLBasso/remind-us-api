'use strict'

import env from 'env-cat';

import IndexHelper from './IndexHelper';

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

export default new AbstractHelper();
