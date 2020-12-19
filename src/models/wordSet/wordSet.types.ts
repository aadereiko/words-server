import { IWordDocument } from './../word/word.types';
import { IUserDocument } from './../user/user.types';
import { Document, Model } from "mongoose";


export interface IWordSet {
    name: string;
    owner: IWordSetDocument['_id'];
    description?: string;

    createdAt: Date;
    updatedAt: Date;

    words?: Array<IWordDocument>;
}

export interface IWordSetDocument extends IWordSet, Document { }
export interface IWordSetModel extends Model<IWordSetDocument> { }

