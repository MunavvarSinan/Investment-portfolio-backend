import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';

import User from '../models/user.js';

export const initPassport = () => {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: process.env.SECRET,
  };

  passport.use(
    new JwtStrategy(opts, async (jwtPayload, done) => {
      try {
        const user = await User.findById(jwtPayload._doc._id);

        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (err) {
        return done(err, false);
      }
    })
  );

  // const serverUrl = process.env.SERVER_URL;
};
