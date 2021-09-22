import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';

import User from '../models/user';

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
    }),
  );


  const serverUrl = process.env.SERVER_URL;

  new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${serverUrl}${process.env.GOOGLE_CALLBACK_URL}`,
        proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
        // console.log(profile);
        try {
          const oldUser = await User.findOne({ email: profile.email });
    
          if (oldUser) {
            return done(null, oldUser);
          }
        } catch (err) {
          console.log(err);
        }
    
        try {
          const newUser = await new User({
            provider: 'google',
            googleId: profile.id,
            username: `user${profile.id}`,
            email: profile.email,
            name: profile.displayName,
            avatar: profile.picture,
          }).save();
          done(null, newUser);
        } catch (err) {
          console.log(err);
        }
      },
)

  
};
