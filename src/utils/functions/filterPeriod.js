import moment from 'moment'

import helper from '../../helpers/AbstractHelper'
import {safeKey} from './safe-key'

export const periodObject = {
	customPeriod(customPeriodInitial, customPeriodFinal) {
		return {
			$gte: new Date(customPeriodInitial),
			$lt: new Date(customPeriodFinal),
		}
	},
	overdue(timezone) {
		const today = moment()
			.tz(timezone)
			.format()
		return {
			$ne: null,
			$lt: new Date(today),
		}
	},
	yesterday(timezone) {
		const startYesterday = moment()
			.tz(timezone)
			.subtract(1, 'days')
			.startOf('day')
			.format()
		const endYesterday = moment()
			.tz(timezone)
			.subtract(1, 'days')
			.endOf('day')
			.format()

		return {
			$gte: new Date(startYesterday),
			$lt: new Date(endYesterday),
		}
	},
	today(timezone) {
		const today = moment()
			.tz(timezone)
			.format()

		return {
			$gte: new Date(`${today.substr(0, today.length - 14)}00:00:00.000Z`),
			$lt: new Date(`${today.substr(0, today.length - 14)}23:59:59.000Z`),
		}
	},
	week(timezone) {
		const initialWeek = moment()
			.tz(timezone)
			.startOf('week')
			.subtract(3, 'hours')
			.format()
		const finalWeek = moment()
			.tz(timezone)
			.endOf('week')
			.subtract(3, 'hours')
			.format()

		return {
			$gte: new Date(initialWeek),
			$lt: new Date(finalWeek),
		}
	},
	pastWeek(timezone) {
		const initialWeekPrevious = moment()
			.tz(timezone)
			.subtract(7, 'days')
			.startOf('week')
			.format()
		const finalWeekPrevious = moment()
			.tz(timezone)
			.subtract(7, 'days')
			.endOf('week')
			.format()

		return {
			$gte: new Date(initialWeekPrevious),
			$lt: new Date(finalWeekPrevious),
		}
	},
	nextWeek(timezone) {
		const initialWeekNext = moment()
			.tz(timezone)
			.add(7, 'days')
			.startOf('week')
			.format()
		const finalWeekNext = moment()
			.tz(timezone)
			.add(7, 'days')
			.endOf('week')
			.format()

		return {
			$gte: new Date(initialWeekNext),
			$lt: new Date(finalWeekNext),
		}
	},
	month(timezone) {
		const initialMonth = moment()
			.tz(timezone)
			.startOf('month')
			.format()
		const finalMonth = moment()
			.tz(timezone)
			.endOf('month')
			.format()

		return {
			$gte: new Date(initialMonth),
			$lt: new Date(finalMonth),
		}
	},
	pastMonth(timezone) {
		const initialPastMonth = moment()
			.tz(timezone)
			.subtract(1, 'months')
			.startOf('month')
			.format()
		const finalPastMonth = moment()
			.tz(timezone)
			.subtract(1, 'months')
			.endOf('month')
			.format()

		return {
			$gte: new Date(initialPastMonth),
			$lt: new Date(finalPastMonth),
		}
	},
	tomorrow(timezone) {
		const initialDayNext = moment()
			.tz(timezone)
			.add(1, 'days')
			.startOf('day')
			.format()
		const finalDayNext = moment()
			.tz(timezone)
			.add(1, 'days')
			.endOf('day')
			.format()

		return {
			$gte: new Date(initialDayNext),
			$lt: new Date(finalDayNext),
		}
	},
}

/**
 * @param {String} fieldName
 * @param {String} periodType
 * @param {String} [timezone=America/Sao_Paulo]
 * @param {String} [periodInitial='']
 * @param {String} [periodFinal='']
 * @return {Object}
 */
export const filterPeriod = (
	fieldName,
	periodType,
	timezone = 'America/Sao_Paulo',
	periodInitial = '',
	periodFinal = '',
) => {
	const currentFilter = []
	const filterTypeMethod = periodObject[periodType.toString()]

	// Pegando o resultado do filtro que foi aplicado
	currentFilter[safeKey(fieldName)] = filterTypeMethod(
		timezone,
		periodInitial,
		periodFinal,
	)
	return helper.convertArrayToObject(currentFilter)
}
