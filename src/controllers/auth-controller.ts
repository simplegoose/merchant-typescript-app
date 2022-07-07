const { responseMessage } = require("../utils/utils");
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { settings } from '../config/config';
import { User } from '../models/users-model';
import bcrypt from "bcryptjs";
const { secret } = settings;

export const login = async (req: Request, res: Response) => {
    if(!req.body) {
        return res.status(400).send({ message: responseMessage[400] });
    }
    
    const { userName, password, rememberMe } = req.body;

    if(!userName || !password) {
        return res.status(400).send({ message: responseMessage[400] });
    }

    let existingUser;

    try {
        existingUser = await User.findOne({ $or: [
            { email: userName },
            { phoneNumber: userName }
        ] });
        if(!existingUser) {
            
            return res.status(401).send({ message: responseMessage[401] });
        }
    } catch (error: any) {
        return res.status(500).send({message: `An error occured: ${error.message}`});
    }
    
    try {
        let isPasswordCompared = await bcrypt.compare(password, existingUser.password);
        if(isPasswordCompared) {
            if(existingUser?.token) {
                try {
                    jwt.verify(existingUser.token, secret);
                    return res.status(201).send({ authToken: existingUser.token });  
                } catch (error: any) {
                    
                }
            }

            const token = jwt.sign(
                {userName},
                secret,
                {
                    expiresIn: rememberMe ? '365d' : '2h'
                }
            );
            await User.updateOne({ email: existingUser.email }, { token });

            return res.status(200).send({ authToken: token });
        }

        res.status(401).send({message: responseMessage[401]})
    } catch (error: any) {
        res.status(500).send({message: `An error occured: ${error.message}`})
    }
}

export const signUp = async (req: Request, res: Response) => {
    const { 
        username,
        email,
        phoneNumber,
        password,
    } = req.body;

    if(!username || !email || !phoneNumber || !password) {
        res.status(400).send({ message: responseMessage[400] });
    }

    let existingUser;

    try {
        existingUser = await User.findOne({ $or: [
            { email },
            { phoneNumber }
        ] });
        if(existingUser) {
            return res.status(200).send({ message: 'A user with similar email or phone number exists!' });
        }
    } catch (error: any) {
        return res.status(500).send({message: `An error occured: ${error.message}`});
    }

    const saltRound = 10;
    const salt = bcrypt.genSaltSync(saltRound);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = new User({
        ...req.body,
        password: hashedPassword,
        token: ''
    });

    try {
        await newUser.save();
        
        res.status(200).send({ message: 'New user has been created.'})
    } catch (error: any) {
        return res.status(500).send({message: `An error occured: ${error.message}`});
    }
}

export const dropUser = async (req: Request, res: Response) => {
    if(!req.query) {
        return res.status(400).send({ message: responseMessage[400] });
    }
    const { userName } = req.query;
    let existingUser;

    try {
        existingUser = await User.findOne({ $or: [
            { email: userName },
            { phoneNumber: userName }
        ] });
        if(!existingUser) {
            return res.status(404).send({ message: 'User does\'nt exist.'})
        }
    } catch (error: any) {
        return res.status(500).send({message: `An error occured: ${error.message}`});
    }

    try {
        await User.deleteOne({ $or: [
            { email: userName },
            { phoneNumber: userName }
        ] });

        res.status(200).send({ message: 'User has been deleted successfully.'})
    } catch (error: any) {
        return res.status(500).send({message: `An error occured: ${error.message}`});
    }
}

export const checkIfLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
    const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({ message: "A token is required for authentication" });
    }
    try {
        const decoded = jwt.verify(token, secret);
    } catch (err) {
        return res.status(401).send({ message: "Invalid Token" });
    }

    return next();
}

export const authOnAppStart = async (req: Request, res: Response) => {
    const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
        return res.status(401).send({ message: "A token is required for authentication" });
    }
    try {
        const decoded = jwt.verify(token, secret);
        console.log(decoded);
        res.status(200).send({ auth: true });
    } catch (err) {
        return res.status(401).send({ message: "Invalid Token" });
    }
}

export const getAll = async (req: Request, res: Response) => {
    res.status(200).send(await User.find({}));
};