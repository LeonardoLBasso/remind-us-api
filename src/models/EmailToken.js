'use strict'

import ModelConstructor from './../utils/classes/ModelConstructor';

const emailTokenSchema = new ModelConstructor('EmailToken', {
    token: {
		type: String,
		required: true,
	},
	used: {
		type: Boolean,
		default: false,
	},
});

export default emailTokenSchema.init();