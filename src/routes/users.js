import express from 'express';
import { checkToken } from '../config/safeRoutes.js';
import userController from '../controller/userController.js';

// eslint-disable-next-line new-cap
const router = express.Router();

router.post('/register', userController.userRegister);

router.post('/login', userController.userLogin);

router.post('/logout', checkToken, userController.userLogout);

router.post('/checkSession', checkToken, (_req, res) => {
  res.json({ success: true });
});

router.post('/all', checkToken, userController.getAllUsers);

router.post('/edit', checkToken, userController.editUser);

export default router;
