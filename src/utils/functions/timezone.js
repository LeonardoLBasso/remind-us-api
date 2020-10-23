'use strict'

const timezone = require('moment-timezone')
const moment = require('moment')

exports.timezone = () => {
	const date = timezone.tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss')
	const stillUtc = timezone.utc(date).toDate()
	const local = moment.utc(stillUtc).local().format('YYYY-MM-DD HH:mm:ss')

	return local
}
