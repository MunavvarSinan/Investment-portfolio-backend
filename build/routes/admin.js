'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _safeRoutes = require('../config/safeRoutes.js');

var _adminController = require('../controller/adminController.js');

var _adminController2 = _interopRequireDefault(_adminController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.post('/register', _adminController2.default.adminRegister);
router.post('/login', _adminController2.default.adminLogin);
router.post('/logout', _safeRoutes.checkToken, _adminController2.default.adminLogout);
router.get('/getAllAdmins', _adminController2.default.getAllAdmin);
router.get('/getAllUsers', _adminController2.default.getAllUsers);
router.post('/checkSession', _safeRoutes.checkToken, function (_req, res) {
  res.json({ success: true });
});
router.delete('/delete/:id', _adminController2.default.deleteUser);
router.delete('/deleteAdmin/:id', _adminController2.default.deleteAdmin);
router.post('/editUser/:id', _adminController2.default.editUserDetails);
router.post('/addTransactionHistory/:id', _adminController2.default.addTransactionHistory);
exports.default = router;
//# sourceMappingURL=admin.js.map