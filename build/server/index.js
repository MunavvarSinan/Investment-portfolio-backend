'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('dotenv/config.js');

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passport3 = require('../config/passport.js');

var _users = require('../routes/users.js');

var _users2 = _interopRequireDefault(_users);

var _admin = require('../routes/admin.js');

var _admin2 = _interopRequireDefault(_admin);

var _database = require('./database.js');

var _database2 = _interopRequireDefault(_database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var server = (0, _express2.default)();
server.use((0, _compression2.default)());

(0, _passport3.initPassport)(_passport2.default);
server.use(_passport2.default.initialize());

if (process.env.NODE_ENV !== 'test') {
  _database2.default.connect();
}

server.use((0, _cors2.default)());
server.use(_express2.default.json());

server.use('/api/users', _users2.default);
server.use('/api/admin', _admin2.default);

exports.default = server;
//# sourceMappingURL=index.js.map