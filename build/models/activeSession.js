'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var activeSessionSchema = new _mongoose2.default.Schema({
  token: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
});

var activeSession = _mongoose2.default.model('ActiveSession', activeSessionSchema);
exports.default = activeSession;
//# sourceMappingURL=activeSession.js.map