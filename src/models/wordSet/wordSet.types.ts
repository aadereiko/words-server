import { IWordDocument } from './../word/word.types';
import { Document, Model } from "mongoose";

const SYSTEM = 'SYSTEM';
const CUSTOM = 'CUSTOM';

export const WORD_SET_TYPES = {
    SYSTEM,
    CUSTOM,
}

export const USER_WORD_SET_DEFAUL_LIST = [{
    name: 'Hard',
    description: 'Should be repeated everyday',
}, {
    name: 'Easy',
    description: 'Repeat once a two days',
}, {
    name: 'Errors',
    description: 'Repeat once a week',
}]

export type IWordSetType = 'SYSTEM' | 'CUSTOM';
export interface IWordSet {
    name: string;
    owner: IWordSetDocument['_id'];
    description?: string;

    createdAt: Date;
    updatedAt: Date;
    lastRepetition: Date;

    setType: IWordSetType;
    words?: Array<IWordDocument>;
}

export interface IWordSetDocument extends IWordSet, Document { }
export interface IWordSetModel extends Model<IWordSetDocument> { }

