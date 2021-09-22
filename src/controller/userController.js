import User from '../models/user';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt-nodejs';
import ActiveSession from '../models/activeSession';

const userSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  username: Joi.string().alphanum().min(4).max(15).optional(),
  password: Joi.string().required(),
});

export default {
  userRegister: (req, res) => {
    // Joy Validation
    const result = userSchema.validate(req.body);
    if (result.error) {
      res.status(422).json({
        success: false,
        msg: `Validation err: ${result.error.details[0].message}`,
      });
      return;
    }

    const { username, email, password } = req.body;

    User.findOne({ email }).then((user) => {
      if (user) {
        res.json({ success: false, msg: 'Email already exists' });
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, null, (err2, hash) => {
            if (err2) throw err2;
            const query = {
              username,
              email,
              password: hash,
            };
            User.create(query, (err3, createdUser) => {
              if (err3) throw err;
              res.json({
                success: true,
                userID: createdUser._id,
                msg: 'The user was succesfully registered',
              });
            });
          });
        });
      }
    });
  },
  userLogin: (req, res) => {
    // Joy Validation
    const result = userSchema.validate(req.body);
    if (result.error) {
      res.status(422).json({
        success: false,
        msg: `Validation err: ${result.error.details[0].message}`,
      });
      return;
    }

    const { email } = req.body;
    const { password } = req.body;

    User.findOne({ email }, null, null, (err, user) => {
      if (err) throw err;

      if (!user) {
        return res.json({ success: false, msg: 'Wrong credentials' });
      }

      if (!user.password) {
        return res.json({ success: false, msg: 'No password' });
      }

      bcrypt.compare(password, user.password, (_err2, isMatch) => {
        if (isMatch) {
          if (!process.env.SECRET) {
            throw new Error('SECRET not provided');
          }
          const token = jwt.sign(user.toJSON(), process.env.SECRET, {
            expiresIn: 86400, // 1 week
          });

          const query = { userId: user._id, token };
          ActiveSession.create(query, () => {
            // Delete the password (hash)
            user.password = undefined;
            return res.json({
              success: true,
              token,
              user,
            });
          });
        } else {
          return res.json({ success: false, msg: 'Wrong credentials' });
        }
      });
    });
  },
  userLogout: (req, res) => {
    const { token } = req.body;
    ActiveSession.deleteMany({ token }, (err) => {
      if (err) {
        res.json({ success: false });
      }
      res.json({ success: true });
    });
  },

  getAllUsers: (_req, res) => {
    User.find({}, (err, users) => {
      if (err) {
        res.json({ success: false });
      }
      users = users.map((item) => {
        const x = item;
        x.password = undefined;
        x.__v = undefined;
        return x;
      });
      res.json({ success: true, users });
    });
  },
  editUser: (req, res) => {
    const { userID, username, email } = req.body;

    User.find({ _id: userID }).then((user) => {
      if (user.length === 1) {
        const query = { _id: user[0]._id };
        const newvalues = { $set: { username, email } };
        User.updateOne(query, newvalues, null, (err) => {
          if (err) {
            // eslint-disable-next-line max-len
            res.json({
              success: false,
              msg: 'There was an error. Please contract the administator',
            });
          }
          res.json({ success: true });
        });
      } else {
        res.json({ success: false });
      }
    });
  },
};
