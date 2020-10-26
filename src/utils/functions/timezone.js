'use strict'

import momentTimezone from 'moment-timezone';
import moment from 'moment';

export const timezone = () => {
	const date = momentTimezone.tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss');
	const stillUtc = momentTimezone.utc(date).toDate();
	const local = moment.utc(stillUtc).local().format('YYYY-MM-DD HH:mm:ss');

	return local;
}
