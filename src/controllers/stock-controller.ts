import { Request, Response } from "express";
import { Stock } from "../models/stock-model";
import { responseMessage } from "../utils/utils";

//Method to save uploaded stock to db
export const uploadStock = async (req: Request, res: Response) => {
    //Check for empty requests
    if (!req.body) {
        return res.status(400).send({ message: responseMessage[400]});
    }

    if (Object.keys(req.body).length < 0) {
        return res.status(400).send({ message: responseMessage[400]});
    }
    
    /**
     * First destructure req.body object
     * Proceed to check if all required fields are present
     */
    const {
        itemName,
        itemCount,
        itemPrice,
        itemType
    } = req.body;

    if (
        !itemName ||
        !itemCount ||
        !itemPrice ||
        !itemType 
    ) {
        return res.status(400).send({ message: responseMessage[400]});
    }

    /**
     * Check if a stock item with @itemName exists,
     * if it does update the document instead of creating
     * a new one.
     */

    let existingStock = await Stock.find({ itemName });
    if (existingStock.length > 0) {
        try {
            await Stock.updateOne({itemName}, { itemCount, itemPrice, itemType });
    
            return res.status(200).send({ message: responseMessage.saved }); 
        } catch (error) {
            return res.status(500).send({ message: responseMessage.serverError});
        }
    }

    /**
     * Initialize stock object
     * Then proceed to save it to the db
     */

    const newStock = new Stock({
        itemName,
        itemCount,
        itemType,
        itemPrice
    });

    try {
        await newStock.save();

        return res.status(200).send({ message: responseMessage.saved});
    } catch (error) {
        return res.status(500).send({ message: responseMessage.serverError});
    }
    
}

//Method to retrieve stock 
export const getStock = async (req: Request, res: Response) => {
    try {
        const stockData = await Stock.find({});

        res.status(200).send(stockData);
    } catch (error) {
        res.status(500).send({ message: responseMessage.serverError});
    }
}