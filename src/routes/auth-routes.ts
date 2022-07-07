import express from 'express';
import { login, signUp, dropUser, authOnAppStart, getAll } from '../controllers/auth-controller';
const router = express.Router();

router
.route('/login')
.post(login);

router
.route('/sign-up')
.post(signUp);

router
.route('/auth-on-start')
.all(authOnAppStart);

router
.route('/delete-user')
.delete(dropUser);

router
.route('/get-all')
.get(getAll);

export default router;