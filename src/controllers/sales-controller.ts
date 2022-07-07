import { Request, Response } from 'express';
import { responseMessage, formatToSeconds } from '../utils/utils';
import { Stock } from '../models/stock-model';
import { Sales } from '../models/sales-model';

//Method to save uploaded stock to db
export const uploadSale = async (req: Request, res: Response) => {
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
        itemPrice,
        totalSale,
        itemType,
        sqft
    } = req.body;

    if (
        !itemName ||
        !totalSale ||
        !itemPrice ||
        !itemType 
    ) {
        return res.status(400).send({ message: responseMessage[400] });
    }

    /**
     * The following code queries data from stock db,
     * we then decrement it's quantity value according to sqft
     * provided by user. NB **THIS IS APPLICABLE FOR GLASS ONLY.
     * 
     * For **PUTTY, we are going to query the db get the total
     * quantity then multiply by 40. Then we will decrement the value.
     * 
     * For the rest of the products, we will decrement the quantity
     * according to total sale and item price.
     */
    let existingStockData;

    try {
        existingStockData = await Stock.findOne({ itemName });
        if(!existingStockData) return res.status(404).send({ message: responseMessage[404] });
        if(sqft && itemType === 'Glass') {
            let itemCount = existingStockData.itemCount - sqft;

            await Stock.updateOne({ itemName }, { itemCount: itemCount });
        } else if(itemType === 'Putty') {
            let itemCount = (existingStockData.itemCount * 40) - (totalSale / itemPrice);

            let newItemCount = itemCount / 40;

            await Stock.updateOne({ itemName }, { itemCount: newItemCount });
        } else {
            let itemCount = existingStockData.itemCount - (totalSale / itemPrice);

            await Stock.updateOne({ itemName }, { itemCount });
        }
    } catch (error: any) {
        console.error(error);
        return res.status(500).send({ message: responseMessage.serverError });
    }
    
    /**
     * Initialize sale object
     * Then proceed to save it to the db
     */

    const newSale = new Sales({
        itemName,
        itemType,
        totalSale,
        itemPrice
    });

    try {
        await newSale.save();

        return res.status(200).send({ message: responseMessage.saved});
    } catch (error: any) {
        return res.status(500).send({ message: responseMessage.serverError});
    }
    
}

//Method to retrieve sales 
export const getSales = async (req: Request, res: Response) => {
    //Check for empty requests
    if (!req.params) {
        return res.status(400).send({ message: `${responseMessage[400]}: You should have some params sent.`});
    }
    //Check if query exists
    if (Object.keys(req.params).length > 1) {
        let seconds: number = formatToSeconds({ duration: parseInt(req.params.duration), durationType: req.params.durationType});
        try {
            const salesData = await Sales.find({ createdAt: { $gt: Date.now() - seconds }});
    
            res.send(salesData);
        } catch (error: any) {
            res.status(500).send({ message: responseMessage.serverError});
        }
    }
    try {
        const salesData = await Sales.find({});
        res.status(200).send(salesData);
    } catch (error: any) {
        res.status(500).send({ message: responseMessage.serverError});
    }
}