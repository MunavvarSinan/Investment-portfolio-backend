'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _user = require('../models/user.js');

var _user2 = _interopRequireDefault(_user);

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _bcryptNodejs = require('bcrypt-nodejs');

var _bcryptNodejs2 = _interopRequireDefault(_bcryptNodejs);

var _activeSession = require('../models/activeSession.js');

var _activeSession2 = _interopRequireDefault(_activeSession);

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _transactionHistory = require('../models/transactionHistory.js');

var _transactionHistory2 = _interopRequireDefault(_transactionHistory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userSchema = _joi2.default.object().keys({
  email: _joi2.default.string().email().required(),
  username: _joi2.default.string().alphanum().min(4).max(15).optional(),
  mobileNumber: _joi2.default.number().optional(),
  password: _joi2.default.string().required()
});

var transporter = _nodemailer2.default.createTransport({
  service: 'gmail',
  auth: {
    user: 'smartfunds54@gmail.com',
    pass: 'smartfunds5433'
  }
});

exports.default = {
  userRegister: function userRegister(req, res) {
    // Joy Validation
    var result = userSchema.validate(req.body);
    if (result.error) {
      res.status(422).json({
        success: false,
        msg: 'Validation err: ' + result.error.details[0].message
      });
      return;
    }

    var _req$body = req.body,
        username = _req$body.username,
        email = _req$body.email,
        password = _req$body.password,
        mobileNumber = _req$body.mobileNumber;


    _user2.default.findOne({ email: email }).then(function (user) {
      if (user) {
        res.json({ success: false, msg: 'Email already exists' });
      } else {
        _bcryptNodejs2.default.genSalt(10, function (err, salt) {
          _bcryptNodejs2.default.hash(password, salt, null, function (err2, hash) {
            if (err2) throw err2;
            var query = {
              username: username,
              mobileNumber: mobileNumber,
              email: email,
              password: hash
            };
            _user2.default.create(query, function (err3, createdUser) {
              if (err3) console.log(err3);
              res.json({
                success: true,
                userID: createdUser._id,
                msg: 'The user was succesfully registered'
              });
            });
          });
        });
      }
    });
  },
  userLogin: function userLogin(req, res) {
    // Joy Validation
    var result = userSchema.validate(req.body);
    if (result.error) {
      res.status(422).json({
        success: false,
        msg: 'Validation err: ' + result.error.details[0].message
      });
      return;
    }

    var email = req.body.email;
    var password = req.body.password;


    _user2.default.findOne({ email: email }, null, null, function (err, user) {
      if (err) throw err;

      if (!user) {
        return res.json({ success: false, msg: 'Wrong credentials' });
      }

      if (!user.password) {
        return res.json({ success: false, msg: 'No password' });
      }

      _bcryptNodejs2.default.compare(password, user.password, function (_err2, isMatch) {
        if (isMatch) {
          if (!process.env.SECRET) {
            throw new Error('SECRET not provided');
          }
          var token = _jsonwebtoken2.default.sign(user.toJSON(), process.env.SECRET, {
            expiresIn: 86400 // 1 week
          });

          var query = { userId: user._id, token: token };
          _activeSession2.default.create(query, function () {
            // Delete the password (hash)
            user.password = undefined;
            return res.json({
              success: true,
              token: token,
              user: user
            });
          });
        } else {
          return res.json({ success: false, msg: 'Wrong credentials' });
        }
      });
    });
  },
  userLogout: function userLogout(req, res) {
    var _req$body2 = req.body,
        tokenId = _req$body2.tokenId,
        token = _req$body2.token;

    _activeSession2.default.deleteMany({ token: token }, function (err) {
      if (err) {
        res.json({ success: false });
      }
      res.json({ success: true });
    });
  },

  getAllUsers: function getAllUsers(_req, res) {
    _user2.default.find({}, function (err, users) {
      if (err) {
        res.json({ success: false });
      }
      users = users.map(function (item) {
        var x = item;
        x.password = undefined;
        x.__v = undefined;
        return x;
      });
      res.json({ success: true, users: users });
    });
  },
  editUser: function editUser(req, res) {
    var _req$body3 = req.body,
        userID = _req$body3.userID,
        username = _req$body3.username,
        email = _req$body3.email,
        investedAmount = _req$body3.investedAmount,
        currentAmount = _req$body3.currentAmount;


    _user2.default.find({ _id: userID }).then(function (user) {
      if (user.length === 1) {
        var query = { _id: user[0]._id };
        var newvalues = {
          $set: { username: username, email: email, investedAmount: investedAmount, currentAmount: currentAmount }
        };
        _user2.default.updateOne(query, newvalues, null, function (err) {
          if (err) {
            // eslint-disable-next-line max-len
            res.json({
              success: false,
              msg: 'There was an error. Please contract the administator'
            });
          }
          res.json({ success: true });
        });
      } else {
        res.json({ success: false });
      }
    });
  },
  getTransactionHistory: function getTransactionHistory(req, res) {
    var id = req.params.id;
    // const { email } = req.body

    _user2.default.findById(id, function (err, result) {
      var email = result.email;

      _transactionHistory2.default.find({ email: email }, function (err, data) {
        if (err) {
          res.json({ success: false });
          console.log(err);
        }
        // console.log(data);
        res.json({ succss: true, data: data });
      });
      console.log(result);
    });
  },
  resetPassword: function resetPassword(req, res) {
    if (req.body.email == '') {
      res.status(400).send('Email required');
      return res.json({ success: false, msg: 'Email address is wrong' });
    }
    console.error(req.body.email);

    _user2.default.findOne({ email: req.body.email }).then(function (user) {
      if (!user) {
        console.error('Email not found!');
        // res.status(403).send('Email not found!');
        return res.json({ success: false, msg: 'No user found with this Email' });
      } else {
        var token = _jsonwebtoken2.default.sign({ _id: user.id }, process.env.SECRET, {
          expiresIn: '20m'
        });

        user.resetToken = token;
        user.save().then(function (result) {
          var mailOptions = {
            from: 'smartfunds54@gmail.com',
            to: '' + user.email,
            subject: 'Link To Reset Password',
            text: 'You are receiving this because you (or someone else) have requested to reset the password of your account. \n\n' + 'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it: \n\n' + (process.env.CLIENT_URL + '/users/reset/' + token + '\n') + 'if you did not requested this, please ignore this email and your password will remain unchanged'
          };
          console.log('Sending Email');

          transporter.sendMail(mailOptions, function (err, response) {
            if (err) {
              console.error('There was an error: ', err);
              return res.json({ success: false, msg: 'Error sending mail' });
            } else {
              console.log('here is the res: ', response);
              res.status(200).json({ succes: true, msg: 'recovery email sent' });
            }
          });
        });
      }
    });
  },
  newPassword: function newPassword(req, res) {
    _user2.default.findOne({ resetToken: req.body.resetToken }, function (err, data) {
      if (!data) console.log('Error');else {
        _bcryptNodejs2.default.genSalt(10, function (err, salt) {
          if (err) console.log(err);
          _bcryptNodejs2.default.hash(req.body.password, salt, null, function (err2, hash) {
            if (err2) throw err2;
            data.password = hash;
            data.resetToken = null;
          });
        });
        data.save().then(function () {
          console.log('Password upadted successfully');
          res.status(200).send({ message: 'password updated' });
        });
      }
    });
  },
  reset: function reset(req, res) {
    _user2.default.findOne({
      resetToken: req.body.resetToken
    }).then(function (user) {
      if (user == null) {
        console.error('password reset link is invalid or has expired');
        res.status(403).send('password reset link is invalid or has expired');
      } else {
        res.status(200).send({
          username: user.username,
          message: 'password reset link a-ok'
        });
      }
    });
  },
  changePassword: function changePassword(req, res) {
    var _req$body4 = req.body,
        email = _req$body4.email,
        password = _req$body4.password,
        newPassword = _req$body4.newPassword;


    _user2.default.findOne({ email: email }, function (err, user) {
      // if(!password ) {
      //   return res.json({ success: false, msg:'Current password is required to create a new one'})
      // }

      _bcryptNodejs2.default.compare(password, user.password, function (_err2, isMatch) {
        if (!password || !isMatch) {
          return res.json({
            success: false,
            msg: 'Current password is required to create a new one'
          });
        }
        if (isMatch) {
          _bcryptNodejs2.default.genSalt(10, function (err, salt) {
            if (err) console.log(err);
            _bcryptNodejs2.default.hash(newPassword, salt, null, function (err2, hash) {
              if (err2) throw err2;
              user.password = hash;
            });
          });
          user.save().then(function () {
            console.log('Password upadted successfully');
            res.status(200).send({ message: 'password updated' });
          });
        } else {
          res.json({ success: false });
        }
      });
    });
  },
  addOrWithdrawRequest: function addOrWithdrawRequest(req, res) {
    var _req$body5 = req.body,
        email = _req$body5.email,
        amount = _req$body5.amount,
        addOrWithdraw = _req$body5.addOrWithdraw;

    if (email == '') {
      res.status(400).send('Not authenticated');
    }
    _user2.default.findOne({ email: email }).then(function (user) {
      var mailOptions = {
        from: '' + user.email,
        to: 'smartfunds54@gmail.com',
        subject: 'Add or withdraw money request',
        text: user.username + ' : ' + user.email + ' ---- is requesting for ' + addOrWithdraw + ' fund\n' + ('Total amount ' + user.username + ' wants to ' + addOrWithdraw + ' is ' + amount + '\n\n') + 'Get back to the user and consider the request'
      };

      console.log('Send Email');

      transporter.sendMail(mailOptions, function (err, response) {
        if (err) {
          console.error('There was an error: ', err);
          res.json({ success: false, msg: 'Request mail not sent due to some technical error' });
        } else {
          console.log('Here is the response', response);
          res.status(200).json({ success: true, msg: 'Request email has been sent ' });
        }
      });
    });
  }

};
//# sourceMappingURL=userController.js.map