import { IUserDocument } from './../models/user/user.types';
import { DataStoredInToken } from './../general/types/token.types';
import { UserModel } from './../models/user/user.model';
import { env } from './../config/env';
import { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import { generateResponse } from '../general/helpers/request';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            throw new Error("It isn't able to get a token");
        }

        const decoded = jwt.verify(token, env.JWT_SECRET) as DataStoredInToken;
        const user = await UserModel.findById(decoded._id);

        if (!user) {
            throw new Error("Token isn't valid");
        }

        // @ts-ignore
        req.user = user;

        next();
    } catch (e) {
        res.status(401).send(generateResponse(null, e));
    }
}

export interface IReqAuthMiddleware extends Request {
    user: IUserDocument;
}