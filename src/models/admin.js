import mongoose from 'mongoose';
const { Schema } = mongoose;

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
  date: {
    type: Date,
    default: Date.now,
  },
});

const Admin = mongoose.model('Admin', AdminSchema);
export default Admin;
