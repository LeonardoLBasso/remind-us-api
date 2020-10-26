'use strict'

import {safeKey} from '../functions/safe-key';

/**
 * @export
 * @class HandleError
 * @classdesc Classe responsável pelo tratamento de retorno de erros
 */
export default class HandleError {
	/**
	 * Creates an instance of HandleError.
	 * @param {object} error
	 * @memberof HandleError
	 */
	constructor(error) {
		this.error = error
	}

	/**
	 * @return {string}
	 * @memberof HandleError
	 */
	handle() {
		const errors = []
		if (this.error.errors) {
			const keys = Object.keys(this.error.errors)
			keys.forEach((key) => {
				if (
					this.error.errors[safeKey(key)].kind &&
					this.error.errors[safeKey(key)].path &&
					this.error.errors[safeKey(key)].value
				) {
					const {kind, path, value} = this.error.errors[safeKey(key)]
					errors.push({
						kind,
						path,
						value,
					})
				}
			})
		}
		if (errors.length > 0) {
			return errors
		}
		return this.error
	}
}
