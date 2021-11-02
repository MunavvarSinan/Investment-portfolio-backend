
import ActiveSession from '../models/activeSession.js';

// eslint-disable-next-line import/prefer-default-export
export const checkToken = (req, res, next) => {
  const token = String(req.headers.authorization);
  ActiveSession.find({ token }, (_err, session) => {
    if (session.length === 1) {
      return next();
    }
    return res.json({ success: false, msg: 'User is not logged on' });
  });
};
