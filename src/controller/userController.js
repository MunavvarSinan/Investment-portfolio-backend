import User from '../models/user';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt-nodejs';
import ActiveSession from '../models/activeSession';
import nodemailer from 'nodemailer';
import TransactionHistory from '../models/transactionHistory';

const userSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  username: Joi.string().alphanum().min(4).max(15).optional(),
  mobileNumber: Joi.number().optional(),
  password: Joi.string().required(),
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'smartfunds54@gmail.com',
    pass: 'smartfunds5433',
  },
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

    const { username, email, password, mobileNumber } = req.body;

    User.findOne({ email }).then((user) => {
      if (user) {
        res.json({ success: false, msg: 'Email already exists' });
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, null, (err2, hash) => {
            if (err2) throw err2;
            const query = {
              username,
              mobileNumber,
              email,
              password: hash,
            };
            User.create(query, (err3, createdUser) => {
              if (err3) console.log(err3);
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
    const { tokenId, token } = req.body;
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
    const { userID, username, email, investedAmount, currentAmount } = req.body;

    User.find({ _id: userID }).then((user) => {
      if (user.length === 1) {
        const query = { _id: user[0]._id };
        const newvalues = {
          $set: { username, email, investedAmount, currentAmount },
        };
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
  getTransactionHistory: (req, res) => {
    const { id } = req.params;
    // const { email } = req.body
    User.findById(id, (err, result) => {
      const { email } = result;
      TransactionHistory.find({ email }, (err, data) => {
        if (err) {
          res.json({ success: false });
          console.log(err);
        }
        // console.log(data);
        res.json({ succss: true, data });
      });
      console.log(result);
    });
  },
  resetPassword: (req, res) => {
    if (req.body.email == '') {
      res.status(400).send('Email required');
    }
    console.error(req.body.email);

    User.findOne({ email: req.body.email }).then((user) => {
      if (user == null) {
        console.error('Email not found!');
        res.status(403).send('Email not found!');
      } else {
        const token = jwt.sign({ _id: user.id }, process.env.SECRET, {
          expiresIn: '20m',
        });

        user.resetToken = token;
        user.save().then((result) => {
          const mailOptions = {
            from: 'smartfunds54@gmail.com',
            to: `${user.email}`,
            subject: 'Link To Reset Password',
            text:
              'You are receiving this because you (or someone else) have requested to reset the password of your account. \n\n' +
              'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it: \n\n' +
              `${process.env.CLIENT_URL}/users/reset/${token}\n` +
              'if you did not requested this, please ignore this email and your password will remain unchanged',
          };
          console.log('Sending Email');

          transporter.sendMail(mailOptions, (err, response) => {
            if (err) {
              console.error('There was an error: ', err);
            } else {
              console.log('here is the res: ', response);
              res
                .status(200)
                .json({ succes: true, msg: 'recovery email sent' });
            }
          });
        });
      }
    });
  },
  newPassword: (req, res) => {
    User.findOne({ resetToken: req.body.resetToken }, (err, data) => {
      if (!data) console.log('Error');
      else {
        bcrypt.genSalt(10, (err, salt) => {
          if (err) console.log(err);
          bcrypt.hash(req.body.password, salt, null, (err2, hash) => {
            if (err2) throw err2;
            data.password = hash;
            data.resetToken = null;
          });
        });
        data.save().then(() => {
          console.log('Password upadted successfully');
          res.status(200).send({ message: 'password updated' });
        });
      }
    });
  },
  reset: (req, res) => {
    User.findOne({
      resetToken: req.body.resetToken,
    }).then((user) => {
      if (user == null) {
        console.error('password reset link is invalid or has expired');
        res.status(403).send('password reset link is invalid or has expired');
      } else {
        res.status(200).send({
          username: user.username,
          message: 'password reset link a-ok',
        });
      }
    });
  },
  changePassword: (req, res) => {
    const { email, password, newPassword } = req.body;

    User.findOne({ email }, (err, user) => {
      // if(!password ) {
      //   return res.json({ success: false, msg:'Current password is required to create a new one'})
      // }

      bcrypt.compare(password, user.password, (_err2, isMatch) => {
        if (!password || !isMatch) {
          return res.json({
            success: false,
            msg: 'Current password is required to create a new one',
          });
        }
        if (isMatch) {
          bcrypt.genSalt(10, (err, salt) => {
            if (err) console.log(err);
            bcrypt.hash(newPassword, salt, null, (err2, hash) => {
              if (err2) throw err2;
              user.password = hash;
            });
          });
          user.save().then(() => {
            console.log('Password upadted successfully');
            res.status(200).send({ message: 'password updated' });
          });
        } else {
          res.json({ success: false });
        }
      });
    });
  },
  addOrWithdrawRequest: (req, res) => {
    const { email, amount, addOrWithdraw } = req.body;
    if (email == '') {
      res.status(400).send('Not authenticated');
    }
    User.findOne({ email }).then((user) => {
      const mailOptions = {
        from: `${user.email}`,
        to: 'smartfunds54@gmail.com',
        subject: 'Add or withdraw money request',
        text:
          `${user.username} : ${user.email} ---- is requesting for ${addOrWithdraw} fund\n` +
          `Total amount ${user.username} wants to ${addOrWithdraw} is ${amount}\n\n` +
          'Get back to the user and consider the request',
      };

      console.log('Send Email');

      transporter.sendMail(mailOptions, (err, response) => {
        if (err) {
          console.error('There was an error: ', err);
          res.json({success: false, msg: 'Request mail not sent due to some technical error'})
        } else {
          console.log('Here is the response', response);
          res
            .status(200)
            .json({ success: true, msg: 'Request email has been sent ' });
        }
      });
    });
  },

};
