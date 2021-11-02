'use strict';

require('dotenv/config.js');

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _index = require('./server/index.js');

var _index2 = _interopRequireDefault(_index);

require('babel-polyfill');

require('babel-core/register');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PORT = process.env.PORT || 5000;
_http2.default.createServer({}, _index2.default).listen(PORT, function () {
  console.log('Server is listening on port ' + PORT);
});
//# sourceMappingURL=index.js.map