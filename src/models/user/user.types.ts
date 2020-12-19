import { IWordSetDocument } from './../wordSet/wordSet.types';
import { TokenData } from './../../general/types/token.types';
import { Document, Model } from "mongoose";

export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;

    createdAt: Date;
    updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {
    sameLastName: (this: IUserDocument) => Promise<Document[]>;
    generateAuthToken: (this: IUserDocument) => TokenData;

    // virtuals
    wordSets?: Array<IWordSetDocument>;
}

export interface IUserModel extends Model<IUserDocument> {
    findByAge: (
        this: IUserModel,
        min?: number,
        max?: number
    ) => Promise<IUserDocument[]>;
    findByCredentials: (
        this: IUserModel,
        email: string,
        password: string,
    ) => Promise<IUserDocument>
}