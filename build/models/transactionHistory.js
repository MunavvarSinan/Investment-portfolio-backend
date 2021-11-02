'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;


var transactionHistorySchema = new Schema({
  email: {
    type: String,
    required: true
  },
  amount: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
});

var TransactionHistory = _mongoose2.default.model('transactionHistory', transactionHistorySchema);
exports.default = TransactionHistory;
//# sourceMappingURL=transactionHistory.js.map