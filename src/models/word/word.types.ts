import { IWordSetDocument } from './../wordSet/wordSet.types';
import { Document, Model } from "mongoose";


export interface IWord {
    eng?: string;
    rus?: string;
    setIds: Array<IWordSetDocument["_id"]>;
    imgUrl?: string;

    createdAt: Date;
    updatedAt: Date;
}

export interface IWordDocument extends IWord, Document { }
export interface IWordModel extends Model<IWordDocument> { }

