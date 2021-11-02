'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var opts = { toJSON: { virtuals: true } };

var AdminSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
    // match: /^([a-z\-]+@smartfunds\.co\.in)$/,
  },
  password: {
    type: String,
    required: true
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  role: {
    type: String,
    default: 'admin'
  },
  date: {
    type: Date,
    default: Date.now
  }
}, opts);

var Admin = _mongoose2.default.model('Admin', AdminSchema);
exports.default = Admin;
//# sourceMappingURL=admin.js.map