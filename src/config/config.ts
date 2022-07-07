require('dotenv').config();
import { Setting } from "../interfaces/config-interface";

const {
    MONGO_URI,
    JWT_SECRET
} = process.env;

export const settings = <Setting>{
    database: MONGO_URI,
    secret: JWT_SECRET
};