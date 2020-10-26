'use strict'

import {Router} from 'express';
import {Controller} from '../utils/functions/require';

const authRouter = Router();

authRouter.post('/signin', Controller('Auth@signin'));

export const router = authRouter;
