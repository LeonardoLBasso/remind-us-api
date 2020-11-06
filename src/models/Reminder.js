'use strict'

import {Schema} from 'mongoose';
import ModelConstructor from '../utils/classes/ModelConstructor';

const reminderSchema = new ModelConstructor('Reminder', {
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	scheduled: {
		type: Date,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		autopopulate: true,
	},
	category: {
		type: Schema.Types.ObjectId,
		ref: 'Category',
		autopopulate: true,
	},
})

export default reminderSchema.init();
