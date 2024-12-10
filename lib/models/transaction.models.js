const {default: mongoose} = require("mongoose")

const Schema = new mongoose.Schema({
    // date:{type: Date,
    //     default: Date.now, // Sets default to current date and time
    //     required: true,},
    amount:{type: Number, required: true},
    category:{type: String, required: true},
    description:{type: String, required: true},
    // isCompleted:{type:Boolean, default:false},
    
},
{
    timestamp:true

})
const TransactionModel = mongoose.models.transaction || mongoose.model ("transaction", Schema);

export default TransactionModel;

