import 'dotenv/config.js';
import http from 'http';
import server from './server/index.js';
import 'babel-polyfill'
import 'babel-core/register'
const PORT = process.env.PORT || 5000;
http.createServer({}, server).listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
