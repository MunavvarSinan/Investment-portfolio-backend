'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _safeRoutes = require('../config/safeRoutes.js');

var _userController = require('../controller/userController.js');

var _userController2 = _interopRequireDefault(_userController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-next-line new-cap
var router = _express2.default.Router();

router.post('/register', _userController2.default.userRegister);

router.post('/login', _userController2.default.userLogin);

router.post('/logout', _safeRoutes.checkToken, _userController2.default.userLogout);

router.post('/checkSession', _safeRoutes.checkToken, function (_req, res) {
  res.json({ success: true });
});
router.post('/googleLogin', function (req, res) {
  var _req$query = req.query,
      user = _req$query.user,
      idToken = _req$query.idToken;

  _userController2.default.googleController(user, idToken).then(function (callback) {
    res.json(callback);
  }).catch(function (err) {
    res.json(err);
  });
});
router.post('/all', _safeRoutes.checkToken, _userController2.default.getAllUsers);

router.post('/edit/id', _safeRoutes.checkToken, _userController2.default.editUser);
router.get('/getTransactionHistory/:id', _userController2.default.getTransactionHistory);
router.post('/reset-password', _userController2.default.resetPassword);
router.post('/new-password', _userController2.default.newPassword);
router.get('/reset', _userController2.default.reset);
router.post('/change-password', _userController2.default.changePassword);
router.post('/request', _userController2.default.addOrWithdrawRequest);

exports.default = router;
//# sourceMappingURL=users.js.map