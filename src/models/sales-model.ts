import { Schema, model } from "mongoose";
import { ISales } from "../interfaces/models-interfaces";

const SalesSchema = new Schema<ISales>({
    itemName: {
        type: String,
        required: true
    },
    itemPrice: {
        type: String,
        required: true
    },
    totalSale: {
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

export const Sales = model('Sales', SalesSchema);