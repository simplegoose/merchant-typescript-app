import { Schema, model } from "mongoose";
import { IStock } from "../interfaces/models-interfaces";

const StockSchema = new Schema<IStock>({
    itemName: {
        type: String,
        required: true
    },
    itemCount: {
        type: Number,
        required: true
    },
    itemPrice: {
        type: String,
        required: true
    },
    itemType: {
        type: String,
        required: true
    }
},
{
    timestamps: true
});

export const Stock = model('Stock', StockSchema);