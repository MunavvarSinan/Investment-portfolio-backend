import Admin from '../models/admin';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt-nodejs';
import ActiveSession from '../models/activeSession';
import User from '../models/user';
import InvestedAmount from '../models/investedAmount';
import { OAuth2Client} from 'google-auth-library'
const admin = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const adminSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  username: Joi.string().alphanum().min(4).max(15).optional(),
  password: Joi.string().required(),
});

export default {
  adminRegister: (req, res) => {
    const result = adminSchema.validate(req.body);
    if (result.error) {
      res.status(422).json({
        success: false,
        msg: `Validation Error ${result.error.details[0].message}`,
      });
      return;
    }

    const { username, email, password } = req.body;

    Admin.findOne({ email }).then((admin) => {
      if (admin) {
        res.json({ success: false, msg: 'Email already Exists' });
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, null, (err2, hash) => {
            if (err2) throw err2;

            const query = {
              username,
              email,
              password: hash,
            };
            Admin.create(query, (err3, createAdmin) => {
              if (err3) throw err3;
              res.json({
                success: true,
                adminId: createAdmin._id,
                msg: 'Admin was created successfully',
              });
            });
          });
        });
      }
    });
  },
  adminLogin: (req, res) => {
    const result = adminSchema.validate(req.body);

    if (result.error) {
      res.status(422).json({
        success: false,
        msg: `Validation error: ${result.error.details[0].message}`,
      });
      return;
    }

    const { email, password } = req.body;

    Admin.findOne({ email }, null, null, (err, admin) => {
      if (err) throw err;

      if (!admin) {
        return res.json({ success: false, msg: 'Wrong Credentials' });
      }

      if (!admin.password) {
        return res.json({ success: false, msg: 'Please enter the password' });
      }

      bcrypt.compare(password, admin.password, (_err2, isMatch) => {
        if (isMatch) {
          if (!process.env.SECRET) {
            throw new Error('Secret key is not provided');
          }

          const token = jwt.sign(admin.toJSON(), process.env.SECRET, {
            expiresIn: 86400,
          });

          const query = { adminId: admin._id, token };
          ActiveSession.create(query, () => {
            admin.password = undefined;
            return res.json({
              success: true,
              token,
              admin,
            });
          });
        } else {
          return res.json({ success: false, msg: 'Wrong credentials' });
        }
      });
    });
  },
  adminLogout: (req, res) => {
    const { token } = req.body;

    ActiveSession.deleteMany({ token }, (err) => {
      if (err) {
        res.json({ success: false });
      }
      res.json({ success: true });
    });
  },
  getAllAdmin: (_req, res) => {
    Admin.find({}, (err, admins) => {
      if (err) res.json({ success: false });

      admins = admins.map((item) => {
        const x = item;
        x.password = undefined;
        x.__v = undefined;
        return x;
      });
      res.json({ success: true, admins });
      console.log(admins);
    });
  },
  getAllUsers: (_req, res) => {
    User.find({}, (err, users) => {
      if (err) {
        res.josn({ success: false });
      }
      users = users.map((item) => {
        const x = item;
        x.password = undefined;
        x.__V = undefined;
        return x;
      });
      res.json({ success: true, users });
    });
  },
  deleteUser: (req, res, next) => {
    const { id } = req.params.id;
    User.findByIdAndDelete(req.params.id, req.body, function (err, user) {
      if (err) return next(err);
      res.json(user);
    });
  },
  editUserDetails: async (req, res, next) => {
    User.findById(req.params.id, (err, data) => {
      // const { investedAmount, currentAmount } = req.body;
      // const profitAndLoss = currentAmount - investedAmount
      if (!data) return next(new Error('Unable to fetch user details'));
      else {
        data.username = req.body.username;
        data.email = req.body.email;
        data.investedAmount = req.body.investedAmount;
        data.currentAmount = req.body.currentAmount;
        data.profitAndLoss = req.body.profitAndLoss;
      }
      data
        .save()
        .then((usr) => {
          res.json('User updated successfully');
        })
        .catch((err) => {
          res.status(400).send('Unable to update user');
        });
    });
  },
  googleLogin : async (req, res) => {
    const { token } = req.body;

    const ticket = await admin.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    })

    const { name, email, picture } = ticket.getPayload();

    const user = await db.user.upsert({
      where: {email: email},
      update: { name, picture},
      create: { name, email, picture}

    })
    req.session.userId = user.id

    res.status(201);
    res.json(user)
  }

};
