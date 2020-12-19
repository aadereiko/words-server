import { IWordDocument } from './word.types';
import { model } from 'mongoose';
import WordSchema from './word.schema';


export const WordModel = model<IWordDocument>("Word", WordSchema);