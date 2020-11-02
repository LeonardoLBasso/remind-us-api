'use strict'

import {Router} from 'express';
import {Controller} from '../utils/functions/require';

const authRouter = Router();

authRouter.post('/login', Controller('Auth@login'));
authRouter.post('/signin', Controller('Auth@signin'));
authRouter.post('/recover-password', Controller('Auth@sendRecoverToken'));

export const router = authRouter;
