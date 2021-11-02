import 'dotenv/config';
import http from 'http';
import server from './server';

const PORT = process.env.PORT || 5000;
http.createServer({}, server).listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
