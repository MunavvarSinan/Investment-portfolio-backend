import mongoose from 'mongoose';
const { Schema } = mongoose;
const opts = { toJSON: { virtuals: true } };

const UserSchema = new Schema(
  {
    username: {
      type: String,
      // required: false,
    },
    email: {
      type: String,
      required: true,
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
      default: 'user',
    },
    investedAmount: {
      type: Number,
      default: 0,
      required: true,
      // ref: 'InvestedAmount',
    },
    currentAmount: {
      type: Number,
      default: 0,
      required: true,
      // ref: 'CurrentAmount',
    },
    profitAndLoss: {
      type: Number,
      required: true,
      default: 0,
    },
    transactionHistory: [
      {
        type: Schema.Types.ObjectId,
        // required: true,
        ref: 'transactionHistory',
      },
    ],
    date: {
      type: Date,
      default: Date.now,
    },
  },
  opts
);

const User = mongoose.model('User', UserSchema);
export default User;
