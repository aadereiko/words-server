import { WORD_SET_TYPES } from './wordSet.types';
import { Schema } from "mongoose";

const WordSetSchema = new Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    owner: { type: Schema.Types.ObjectId, requried: true, ref: 'User' },
    lastRepetition: { type: Date, default: null },
    setType: { type: String, enum: [WORD_SET_TYPES.CUSTOM, WORD_SET_TYPES.SYSTEM], default: WORD_SET_TYPES.CUSTOM }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    }
});

WordSetSchema.virtual('words', {
    ref: 'Word',
    localField: '_id',
    foreignField: 'setIds',
    justOne: false,
})

export default WordSetSchema;
