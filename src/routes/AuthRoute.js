'use strict'

import {Router} from 'express';

import {Controller} from '../utils/functions/require';
import {authorize} from '../services/auth-service';

const authRouter = Router();

authRouter.post('/login', Controller('Auth@login'));
authRouter.post('/signin', Controller('Auth@signin'));
authRouter.put('/update-profile', authorize, Controller('Auth@updateProfile'));
authRouter.put('/update-password', authorize, Controller('Auth@updatePassword'));

export const router = authRouter;
