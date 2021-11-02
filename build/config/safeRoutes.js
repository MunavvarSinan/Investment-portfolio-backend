'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkToken = undefined;

var _activeSession = require('../models/activeSession.js');

var _activeSession2 = _interopRequireDefault(_activeSession);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-next-line import/prefer-default-export
var checkToken = exports.checkToken = function checkToken(req, res, next) {
  var token = String(req.headers.authorization);
  _activeSession2.default.find({ token: token }, function (_err, session) {
    if (session.length === 1) {
      return next();
    }
    return res.json({ success: false, msg: 'User is not logged on' });
  });
};
//# sourceMappingURL=safeRoutes.js.map