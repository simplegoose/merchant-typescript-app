import { Schema, model } from "mongoose";

const TransactionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
}, 
{
    timestamps: true
});

export const Transaction = model('Transaction', TransactionSchema);