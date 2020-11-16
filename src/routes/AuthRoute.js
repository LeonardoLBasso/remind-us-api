'use strict'

import {Router} from 'express';

import {Controller} from '../utils/functions/require';
import {authorize} from '../services/auth-service';

const authRouter = Router();

authRouter.post('/login', Controller('Auth@login'));
authRouter.post('/signin', Controller('Auth@signin'));
authRouter.post('/update-profile', authorize, Controller('Auth@updateProfile'));
authRouter.post('/update-password', authorize, Controller('Auth@updatePassword'));

export const router = authRouter;
