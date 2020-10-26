'use strict'

const ModelConstructor = require('../utils/classes/ModelConstructor');

const userSchema = new ModelConstructor('User', {
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
    },
});

module.exports = userSchema.init();