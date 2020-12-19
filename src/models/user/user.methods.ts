import { DataStoredInToken, TokenData } from './../../general/types/token.types';
import { env } from './../../config/env';
import { Document } from "mongoose";
import { IUserDocument } from "./user.types";
import * as jwt from 'jsonwebtoken';

export async function sameLastName(this: IUserDocument): Promise<Document[]> {
    return this.model("user").find({ lastName: this.lastName });
}

export async function generateAuthToken(this: IUserDocument): Promise<TokenData> {
    const user = this;

    const secret = env.JWT_SECRET;
    const dataStoredInToken: DataStoredInToken = {
        _id: user._id,
        email: user.email,
    }

    return { token: jwt.sign(dataStoredInToken, secret) };
}