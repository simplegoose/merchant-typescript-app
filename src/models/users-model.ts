import { Schema, model } from "mongoose";
import { IUser } from "../interfaces/models-interfaces";

const UserSchema = new Schema<IUser>({
    username: String,
    email: String,
    phoneNumber: String,
    password: String,
    token: String
});

export const User = model('User', UserSchema);