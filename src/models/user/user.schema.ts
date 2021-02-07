// @ts-nocheck

import { IUser } from './user.types';
import { Schema } from "mongoose";
import { findByAge, findByCredentials } from "./user.statics";
import { sameLastName, generateAuthToken } from "./user.methods";

const UserSchema = new Schema<IUser>({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, trim: true },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    }
});


UserSchema.virtual('wordSets', {
    ref: 'WordSet',
    localField: '_id',
    foreignField: 'owner',
    justOne: false,
})

UserSchema.statics.findByAge = findByAge;
UserSchema.statics.findByCredentials = findByCredentials;

UserSchema.methods.sameLastName = sameLastName;
UserSchema.methods.generateAuthToken = generateAuthToken;

export default UserSchema;