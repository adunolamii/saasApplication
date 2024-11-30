// models/invoice.js
import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  dueDate: { 
    type: Date, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['paid', 'unpaid', 'overdue'], 
    default: 'unpaid' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

const Invoice = mongoose.models.Invoice || mongoose.model('Invoice', invoiceSchema);

export default Invoice;
