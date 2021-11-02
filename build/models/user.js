'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var opts = { toJSON: { virtuals: true } };

var UserSchema = new Schema({
  username: {
    type: String
    // required: false,
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: Number,
    required: true
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  role: {
    type: String,
    default: 'user'
  },
  investedAmount: {
    type: Number,
    default: 0,
    required: true
    // ref: 'InvestedAmount',
  },
  currentAmount: {
    type: Number,
    default: 0,
    required: true
    // ref: 'CurrentAmount',
  },
  profitAndLoss: {
    type: Number,
    required: true,
    default: 0
  },
  transactionHistory: {
    type: Schema.Types.ObjectId,
    // required: true,
    ref: 'transactionHistory',
    autopopulate: true
  },
  resetToken: String,
  expireToken: Date,
  date: {
    type: Date,
    default: Date.now
  }
}, opts);

var User = _mongoose2.default.model('User', UserSchema);
exports.default = User;
//# sourceMappingURL=user.js.map