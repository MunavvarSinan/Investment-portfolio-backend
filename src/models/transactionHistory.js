import mongoose from 'mongoose'
const { Schema } = mongoose;


const transactionHistorySchema = new Schema({
  email :{
      type:String,
      required: true
  },
  amount: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default : Date.now
  }
})

const TransactionHistory = mongoose.model('transactionHistory', transactionHistorySchema);
export default TransactionHistory