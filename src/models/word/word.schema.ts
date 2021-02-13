import { Schema } from "mongoose";

const WordSchema = new Schema({
    eng: { type: String, trim: true },
    rus: { type: String, trim: true },
    imgUrl: { type: String, trim: true, required: false },
    setIds: [{ type: Schema.Types.ObjectId, requried: true, ref: 'WordSet' }]
}, {
    timestamps: true,
});

export default WordSchema;
