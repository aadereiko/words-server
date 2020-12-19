import { model } from "mongoose";
import { IUserDocument } from "./user.types";
import UserSchema from "./user.schema";
import * as bcrypt from 'bcrypt';

UserSchema.pre<IUserDocument>('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
})

export const UserModel = model<IUserDocument>("User", UserSchema);