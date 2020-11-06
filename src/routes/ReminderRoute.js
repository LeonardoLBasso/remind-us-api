'use strict'

import {Router} from 'express';

import {Controller} from '../utils/functions/require';
import {authorize} from '../services/auth-service';

const reminderRouter = Router();

reminderRouter.post('/create', authorize, Controller('Reminder@add'));
reminderRouter.put('/update/:id', authorize, Controller('Reminder@update'));
reminderRouter.get('/get/:id', authorize, Controller('Reminder@get'));
reminderRouter.delete('/remove/:id', authorize, Controller('Reminder@remove'));

export const router = reminderRouter;
