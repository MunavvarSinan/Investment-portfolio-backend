import express from 'express';
import { checkToken } from '../config/safeRoutes';
import adminController from '../controller/adminController';

const router = express.Router();

router.post('/register', adminController.adminRegister);
router.post('/login', adminController.adminLogin);
router.post('/logout', checkToken, adminController.adminLogout);
router.post('/getAllAdmins', adminController.getAllAdmin);
router.post('/getAllUsers', adminController.getAllUsers);
router.post('/checkSession', checkToken, (_req, res) => {
  res.json({ success: true });
});
router.post('/delete/:id', adminController.deleteUser);

export default router;
