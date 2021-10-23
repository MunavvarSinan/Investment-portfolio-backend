import User from '../models/user';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt-nodejs';
import ActiveSession from '../models/activeSession';
import sgMail from '@sendgrid/mail';
import firebaseAdmin from 'firebase-admin';
import { OAuth2Client } from 'google-auth-library';
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
              if (err3) console.log(err3);;
              res.json({
                success: true,
                userID: createdUser._id,
                msg: 'The user was succesfully registered',
              });
            });
          });
        });
        // const token = jwt.sign(user.toJSON(), process.env.SECRET, {
        //   expiresIn: '5m', // 1 week
        // });

        // const emailData = {
        //   from: 'admin@smartfunds.co.in',
        //   to: email,
        //   subject: 'Account activation link',
        //   html: `
        //   <h1>Please use the following to activate your account</h1>
        //   <p>${process.env.CLIENT_URL}/users/activate/${token}</p>
        //   <hr />
        //   <p>This email may containe sensetive information</p>
        //   <p>${process.env.CLIENT_URL}</p>
        //   `,
        // };
        // sgMail
        //   .send(emailData)
        //   .then((sent) => {
        //     return res.json({
        //       message: `Email sent successfully to ${email}`,
        //     });
        //   })
        //   .catch((err) => {
        //     return res.status(400).jdon({
        //       success: false,
        //       errors: err,
        //     });
        //   });
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
            expiresIn: '1d', // 1 week
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
        const newvalues = { $set: { username, email, investedAmount, currentAmount } };
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
  addPayment: (req, res) => {
    const { email, userID , addAmount} = req.body;
    console.log(email);
    const idempontencyKey = uuid()

    return stripe.customers.create({
      email: email,
      // source: userID
    }).then(customer => {
      stripe.charges.create({
        amount: addAmount * 100
      }, {idempotencyKey})
    })
    .then(result => res.status(200).json(result))
    .catch(err => console.log(err))
  }
  // googleController: (req, res) => {
  //   const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  //   const { idToken } = req.body;

  //   client
  //     .verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT })
  //     .then((res) => {
  //       const { email, username } = res.payload;
  //       if (email) {
  //         User.findOne({ email }).exec((err, user) => {
  //           if (user) {
  //             const token = jwt.sign(user.toJSON(), process.env.SECRET, {
  //               expiresIn: '1d', // 1 week
  //             });

  //             const { _id, email, username, role } = user;
  //             return () =>
  //               res.json({
  //                 token,
  //                 user: { _id, email, username, role },
  //               });
  //           } else {
  //             let password = email + process.env.SECRET;
  //             user = new User({ username, email, password });
  //             user.save((err, data) => {
  //               if (err) {
  //                 console.log('ERROR GOOGLE LOGIN ON USER SAVE', err);
  //                 return res.status(400).json({
  //                   error: 'User signup failed with google',
  //                 });
  //               }
  //               const token = jwt.sign(user.toJSON(), process.env.SECRET, {
  //                 expiresIn: '1d', // 1 week
  //               });
  //               const { _id, email, username, role } = data;
  //               return res.status(200).json({
  //                 token,
  //                 user: { _id, email, username, role },
  //               });
  //             });
  //           }
  //         });
  //       } else {
  //         return res.status(400).json({
  //           error: 'Google login failed. Try again',
  //         });
  //       }
  //     });
  // },

  
  // googleController: function (user, idToken) {
  //   return new Promise(function (resolve, reject) {
  //     if (user == undefined) {
  //       return reject({
  //         code: 401,
  //         success: false,
  //         message: 'auth denied',
  //       });
  //     }

  //     userJson = JSON.parse(user);
  //     console.log(idToken);

  //     firebaseAdmin
  //       .auth()
  //       .verifyIdToken(idToken)
  //       .then(function (decodeToken) {
  //         User.findOne({ googleId: userJson.uid }).then(function (user) {
  //           console.log(user);

  //           if (!user) {
  //             new User({
  //               name: userJson.displaName,
  //               email: userJson.email,
  //               googleId: userJson.uid,
  //             })
  //               .save()
  //               .then(function (err, user) {
  //                 resolve({
  //                   code: 200,
  //                   success: true,
  //                   message: 'auth success: new user created',
  //                   user: user,
  //                 });
  //               });
  //           } else {
  //             resolve({
  //               code: 200,
  //               success: true,
  //               message: 'auth success: existing user',
  //               user: user,
  //             });
  //           }
  //         });
  //       })
  //       .catch(function (err) {
  //         console.log(err);
  //         reject({
  //           code: 401,
  //           success: false,
  //           message: 'auth denied',
  //           error: err,
  //         });
  //       });
  //   });
  // },
};
