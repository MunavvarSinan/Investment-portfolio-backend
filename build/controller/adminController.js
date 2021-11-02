'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _admin = require('../models/admin.js');

var _admin2 = _interopRequireDefault(_admin);

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _bcryptNodejs = require('bcrypt-nodejs');

var _bcryptNodejs2 = _interopRequireDefault(_bcryptNodejs);

var _activeSession = require('../models/activeSession.js');

var _activeSession2 = _interopRequireDefault(_activeSession);

var _user = require('../models/user.js');

var _user2 = _interopRequireDefault(_user);

var _transactionHistory = require('../models/transactionHistory.js');

var _transactionHistory2 = _interopRequireDefault(_transactionHistory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var adminSchema = _joi2.default.object().keys({
  email: _joi2.default.string().email().required(),
  username: _joi2.default.string().alphanum().min(4).max(15).optional(),
  password: _joi2.default.string().required()
});

exports.default = {
  adminRegister: function adminRegister(req, res) {
    var result = adminSchema.validate(req.body);
    if (result.error) {
      res.status(422).json({
        success: false,
        msg: 'Validation Error ' + result.error.details[0].message
      });
      return;
    }

    var _req$body = req.body,
        username = _req$body.username,
        email = _req$body.email,
        password = _req$body.password;


    _admin2.default.findOne({ email: email }).then(function (admin) {
      if (admin) {
        res.json({ success: false, msg: 'Email already Exists' });
      } else {
        _bcryptNodejs2.default.genSalt(10, function (err, salt) {
          _bcryptNodejs2.default.hash(password, salt, null, function (err2, hash) {
            if (err2) throw err2;

            var query = {
              username: username,
              email: email,
              password: hash
            };
            _admin2.default.create(query, function (err3, createAdmin) {
              if (err3) throw err3;
              res.json({
                success: true,
                adminId: createAdmin._id,
                msg: 'Admin was created successfully'
              });
            });
          });
        });
      }
    });
  },
  adminLogin: function adminLogin(req, res) {
    var result = adminSchema.validate(req.body);

    if (result.error) {
      res.status(422).json({
        success: false,
        msg: 'Validation error: ' + result.error.details[0].message
      });
      return;
    }

    var _req$body2 = req.body,
        email = _req$body2.email,
        password = _req$body2.password;


    _admin2.default.findOne({ email: email }, null, null, function (err, admin) {
      if (err) throw err;

      if (!admin) {
        return res.json({ success: false, msg: 'Wrong Credentials' });
      }

      if (!admin.password) {
        return res.json({ success: false, msg: 'Please enter the password' });
      }

      _bcryptNodejs2.default.compare(password, admin.password, function (_err2, isMatch) {
        if (isMatch) {
          if (!process.env.SECRET) {
            throw new Error('Secret key is not provided');
          }

          var token = _jsonwebtoken2.default.sign(admin.toJSON(), process.env.SECRET, {
            expiresIn: 86400
          });

          var query = { adminId: admin._id, token: token };
          _activeSession2.default.create(query, function () {
            admin.password = undefined;
            return res.json({
              success: true,
              token: token,
              admin: admin
            });
          });
        } else {
          return res.json({ success: false, msg: 'Wrong credentials' });
        }
      });
    });
  },
  adminLogout: function adminLogout(req, res) {
    var token = req.body.token;


    _activeSession2.default.deleteMany({ token: token }, function (err) {
      if (err) {
        res.json({ success: false });
      }
      res.json({ success: true });
    });
  },
  getAllAdmin: function getAllAdmin(_req, res) {
    _admin2.default.find({}, function (err, admins) {
      if (err) res.json({ success: false });

      admins = admins.map(function (item) {
        var x = item;
        x.password = undefined;
        x.__v = undefined;
        return x;
      });
      res.json({ success: true, admins: admins });
      console.log(admins);
    });
  },
  getAllUsers: function getAllUsers(_req, res) {
    _user2.default.find({}, function (err, users) {
      if (err) {
        res.josn({ success: false });
      }
      users = users.map(function (item) {
        var x = item;
        x.password = undefined;
        x.__V = undefined;
        return x;
      });
      res.json({ success: true, users: users });
      console.log(users);
    });
  },
  deleteUser: function deleteUser(req, res, next) {
    _user2.default.findByIdAndDelete(req.params.id, req.body, function (err, user) {
      if (err) return next(err);
      res.json(user);
    });
  },
  deleteAdmin: function deleteAdmin(req, res, next) {

    _admin2.default.findByIdAndDelete(req.params.id, req.body, function (err, admin) {
      if (err) return next(err);
      res.json(admin);
    });
  },
  editUserDetails: function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res, next) {
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _user2.default.findById(req.params.id, function (err, data) {
                if (!data) return next(new Error('Unable to fetch user details'));else {
                  data.username = req.body.username;
                  data.email = req.body.email;
                  data.investedAmount = req.body.investedAmount;
                  data.currentAmount = req.body.currentAmount;
                  data.profitAndLoss = req.body.profitAndLoss;
                }
                data.save().then(function (usr) {
                  res.json('User updated successfully');
                }).catch(function (err) {
                  res.status(400).send('Unable to update user');
                });
              });

            case 1:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    function editUserDetails(_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    }

    return editUserDetails;
  }(),
  addTransactionHistory: function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res, next) {
      var id, _req$body3, email, amount, date;

      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              id = req.params.id;
              _req$body3 = req.body, email = _req$body3.email, amount = _req$body3.amount, date = _req$body3.date;


              _user2.default.findById(id, function (err, data) {
                // .populate('transactionHistory')
                // .exec((err, res) => {
                if (!data) return next(new Error('Unable to fetch user details'));
                var history = new _transactionHistory2.default({
                  // _id: id,
                  email: email,
                  amount: amount,
                  date: date
                });
                history.save().then(function (usr) {
                  res.json({ success: true });
                }).catch(function (err) {
                  return console.log(err);
                });
                // history.populate('transactionHistory')
                console.log(data.transactionHistory);

                console.log(history);
              });

            case 3:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    }));

    function addTransactionHistory(_x4, _x5, _x6) {
      return _ref2.apply(this, arguments);
    }

    return addTransactionHistory;
  }(),

  addUsers: function addUsers(req, res) {
    var result = userSchema.validate(req.body);
    if (result.error) {
      res.status(422).json({
        success: false,
        msg: 'Validation err: ' + result.error.details[0].message
      });
      return;
    }

    var _req$body4 = req.body,
        username = _req$body4.username,
        mobileNumber = _req$body4.mobileNumber,
        email = _req$body4.email,
        password = _req$body4.password;


    _user2.default.findOne({ email: email }).then(function (user) {
      if (user) {
        res.json({ success: false, msg: "Email already exists" });
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
              if (err3) console.log(err3);;
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
  }
};
//# sourceMappingURL=adminController.js.map