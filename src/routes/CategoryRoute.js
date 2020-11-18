'use strict'

import {Router} from 'express';

import {Controller} from '../utils/functions/require';
import {authorize} from '../services/auth-service';

const categoryRouter = Router();

categoryRouter.post('/create', authorize, Controller('Category@add'));
categoryRouter.put('/update/:id', authorize, Controller('Category@update'));
categoryRouter.get('/get/:id', authorize, Controller('Category@get'));
categoryRouter.get('/get-all', authorize, Controller('Category@getAllByUser'));
categoryRouter.get('/get-all-list', authorize, Controller('Category@getAllByUserList'));
categoryRouter.delete('/remove/:id', authorize, Controller('Category@remove'));

export const router = categoryRouter;
