'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prepareDB = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

require('dotenv/config.js');

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mongooseOptions = {
  connectTimeoutMS: 30000,
  keepAlive: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true
};

var prepareDB = exports.prepareDB = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    var server, start, stop;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            server = process.env.MONGO_URI;

            start = function start() {
              // const mongoUri = server?.getUri();
              _mongoose2.default.connect(server, mongooseOptions, function (err) {
                if (err) console.error(err);
              });
            };

            stop = function () {
              var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                return _regenerator2.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return _mongoose2.default.disconnect();

                      case 2:
                        return _context.abrupt('return', server.stop());

                      case 3:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, undefined);
              }));

              return function stop() {
                return _ref2.apply(this, arguments);
              };
            }();

            return _context2.abrupt('return', {
              start: start,
              stop: stop
            });

          case 4:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function prepareDB() {
    return _ref.apply(this, arguments);
  };
}();

exports.default = {
  connect: function connect() {
    _mongoose2.default.connect('' + process.env.MONGO_URI, mongooseOptions).then(function () {
      return console.log('MongoDB connected');
    }).catch(function (err) {
      return console.error(err);
    });
  }
};
//# sourceMappingURL=database.js.map