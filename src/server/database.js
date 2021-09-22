import 'dotenv/config';

import mongoose from 'mongoose';

const mongooseOptions = {
  connectTimeoutMS: 30000,
  keepAlive: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

export const prepareDB = async () => {
  const server = process.env.MONGO_URI

  const start = () => {
    const mongoUri = server?.getUri();
    mongoose.connect(mongoUri, mongooseOptions, (err) => {
      if (err) console.error(err);
    });
  };

  const stop = async () => {
    await mongoose.disconnect();
    return server.stop();
  };

  return {
    start,
    stop,
  };
};

export default {
  connect() {
    mongoose
      .connect(`${process.env.MONGO_URI}`, mongooseOptions)
      .then(() => console.log('MongoDB connected'))
      .catch((err) => console.error(err));
  },
};
