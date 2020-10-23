'use strict'

const {Router} = require('express');
const {Controller} = require('../utils/functions/require');

const router = Router();

router.get('/login', Controller('Auth@login'));

module.exports = router;
