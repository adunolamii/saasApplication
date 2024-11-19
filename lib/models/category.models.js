import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            enum: ['income', 'expense'],
            required: true,
        },
        color: {
            type: String,
            required: true,
            default: '#000000',
        },
           },
    {
        timestamps: true
    }
);


export default mongoose.models.Category || mongoose.model('Category', CategorySchema);
