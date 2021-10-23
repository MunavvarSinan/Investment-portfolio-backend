import mongoose from 'mongoose';
const { Schema } = mongoose;
const opts = { toJSON: { virtuals: true } };

const AdminSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    // match: /^([a-z\-]+@smartfunds\.co\.in)$/,
  },
  password: {
    type: String,
    required: true,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  role: {
    type: String,
    default: 'admin',
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, opts);

const Admin = mongoose.model('Admin', AdminSchema);
export default Admin;
