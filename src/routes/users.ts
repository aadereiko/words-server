import { generateResponse } from './../general/helpers/request';
import { UserModel } from './../models/user/user.model';
import express, { Request, Response } from 'express';
import { IUserModel } from '../models/user/user.types';

const router = express.Router();

router.post('/users', async (req: Request, res: Response) => {
    const newUser = new UserModel(req.body);
    try {
        await newUser.save();
        return res.status(201).send(generateResponse(newUser));
    } catch (e) {
        res.status(500).send(generateResponse(null, e))
    }
})

router.get('/users', async (req: Request, res: Response) => {
    try {
        const users = await UserModel.find({});
        res.send(generateResponse(users));
    } catch (e) {
        res.status(500).send(generateResponse(null, e))
    }
})

router.delete('/users/:id', async (req: Request, res: Response) => {
    try {
        const user = await UserModel.findById(req.params.id);
        if (!user) {
            return res.status(401).send(generateResponse(null, "User not found"));
        }

        await UserModel.findByIdAndDelete(user._id);
        return res.send(generateResponse(user, null, "User has been removed"));
    } catch (e) {
        res.status(500).send(generateResponse(null, e))
    }
})

router.post('/users/auth', async (req: Request, res: Response) => {
    try {
        if (!req.body.email || !req.body.password) {
            return res.status(400).send(generateResponse(null, "Invalid data"));
        }

        const user = await (UserModel as IUserModel).findByCredentials(req.body.email, req.body.password);

        if (user) {
            const { token } = await user.generateAuthToken();

            res.send((generateResponse({
                token,
                user,
            }, null, "Successfully signed in")))
        }

    } catch (e) {
        res.status(400).send(generateResponse(null, e))
    }
})

export { router as usersRouter };