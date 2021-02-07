import { generateResponse } from './../general/helpers/request';
import { authMiddleware, IReqAuthMiddleware } from './../middlewares/auth';
import { WordSetModel } from './../models/wordSet/wordSet.model';
import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/sets', async (req: Request, res: Response) => {
    try {
        const wordSets = await WordSetModel.find({});
        return res.send(generateResponse(wordSets));
    } catch (e) {
        res.status(500).send(generateResponse(null, e));
    }
});

router.post('/sets', authMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = (req as IReqAuthMiddleware).user._id;

        if (userId) {
            const newSet = new WordSetModel(req.body);
            newSet.owner = userId;
            await newSet.save();
            return res.status(201).send(generateResponse(newSet, null, 'Set has been created'));
        }
    } catch (e) {
        res.status(500).send(generateResponse(null, e));
    }
});

router.delete('/sets/:id', authMiddleware, async (req: Request, res: Response) => {
    try {
        const setId = req.params.id;
        if (!setId) {
            return res.status(400).send(generateResponse(null, "There is no set id"));
        }

        const setToRemove = await WordSetModel.findById(setId);
        if (!setToRemove) {
            return res.status(404).send(generateResponse(null, "Set not found"));
        }

        const userId = (req as IReqAuthMiddleware).user._id;

        if (String(userId) !== String(setToRemove.owner)) {
            return res.status(403).send(generateResponse(null, "You have no rights to remove this set"));
        }


        await setToRemove.delete();
        return res.send(generateResponse(setToRemove, null, "Set has been removed"));
    } catch (e) {
        res.status(500).send(generateResponse(null, e));
    }
});

router.get('/sets/me', authMiddleware, async (req: Request, res: Response) => {
    try {
        const user = await (req as IReqAuthMiddleware).user.populate('wordSets').execPopulate();
        res.send(generateResponse(user.wordSets));
    } catch (e) {
        res.status(500).send(generateResponse(null, e));
    }
})

router.patch('/sets/:id', authMiddleware, async (req: Request, res: Response) => {
    const allowedFieldsToUpdate = ['lastRepetition'];

    try {
        const setId = req.params.id;

        if (!setId) {
            return res.status(400).send(generateResponse(null, "There is no set id"));
        }

        const foundSet = await WordSetModel.findById(setId);

        if (!foundSet) {
            return res.status(404).send(generateResponse(null, "Set is not found"));
        }


        const userId = (req as IReqAuthMiddleware).user._id;

        if (String(userId) !== String(foundSet.owner)) {
            return res.status(403).send(generateResponse(null, "You have no rights to remove this set"));
        }

        const newSetInfo = req.body;
        const keysToUpdate = Object.keys(newSetInfo);

        keysToUpdate.forEach(field => {
            if (allowedFieldsToUpdate.includes(field)) {

                // @ts-ignore
                foundSet[field as string] = req.body[field];
            }
        });

        await foundSet.save();
        return res.status(200).send(generateResponse(foundSet, null, "Set was updated"));
    } catch (e) {
        res.status(500).send(generateResponse(null, e));
    }
})


export { router as wordSetsRouter };