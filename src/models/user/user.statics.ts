import { IUserDocument, IUserModel } from "./user.types";
import * as bcrypt from "bcrypt";

export async function findByAge(
    this: IUserModel,
    min?: number,
    max?: number
): Promise<IUserDocument[]> {
    return this.find({ age: { $gte: min || 0, $lte: max || Infinity } });
}

export async function findByCredentials(this: IUserModel, email: string, password: String) {
    const user = await this.findOne({ email });

    if (!user) {
        throw new Error("User not found");
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);

    if (!isPasswordMatching) {
        throw new Error("Unmatched passwords");
    }

    return user;
}