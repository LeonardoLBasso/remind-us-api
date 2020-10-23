'use strict'

/**
 * @param {String | Number} indexName
 * @return {String | Number}
 */
exports.safeKey = (indexName) => {
	if (typeof indexName === 'undefined') {
		throw new Error('This index is undefined, please be sure if you are sending the correct value')
	}

	if (typeof indexName !== 'string') {
		return indexName
	}

	return indexName.toString()
}
