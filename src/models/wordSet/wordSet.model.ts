import { IWordSetDocument } from './wordSet.types';
import { model } from 'mongoose';
import WordSetSchema from './wordSet.schema';

export const WordSetModel = model<IWordSetDocument>("WordSet", WordSetSchema);