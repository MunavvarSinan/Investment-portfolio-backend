import mongoose from 'mongoose'
const { Schema } = mongoose;


const transactionHistorySchema = new Schema({
  email :{
      type: Schema.Types.ObjectId,
      required: true
  },
  amount: {
    type: number,
    required: true
  },
  date: {
    type: Date,
    required: true,
  }
})

const TransactionHistory = mongoose.model('transactionHistory', transactionHistorySchema);
export default TransactionHistory