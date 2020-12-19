import { Schema } from "mongoose";

const WordSetSchema = new Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    owner: { type: Schema.Types.ObjectId, requried: true, ref: 'User' }
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
    foreignField: 'setId',
    justOne: false,
})

export default WordSetSchema;
