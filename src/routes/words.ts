import { findLastDisallowedField } from './../general/helpers/validation';
import { WordSetModel } from './../models/wordSet/wordSet.model';
import { authMiddleware, IReqAuthMiddleware } from './../middlewares/auth';
import { WordModel } from './../models/word/word.model';
import { generateResponse } from './../general/helpers/request';
import express, { Request, Response } from 'express';

const router = express.Router();

router.post('/words', authMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = (req as IReqAuthMiddleware).user._id;
        const { setId, ...restReqBody } = req.body;
        if (!setId) {
            return res.status(400).send(generateResponse(null, "Word set is not provided"));
        }

        const wordSet = await WordSetModel.findById(setId);

        if (!wordSet) {
            return res.status(404).send(generateResponse(null, "Word set not found"));
        }

        if (String(wordSet.owner) !== String(userId)) {
            return res.status(403).send(generateResponse(null, "You have no rights to add words to this set"));
        }

        const newWord = new WordModel({
            ...restReqBody,
            setIds: [setId],
        });

        await newWord.save();

        return res.status(201).send(generateResponse(newWord, null, "Word has been added"));
    } catch (e) {
        res.status(500).send(generateResponse(null, e));
    }
})

router.get('/words', async (req: Request, res: Response) => {
    try {
        const allWords = await WordModel.find({});

        return res.send(generateResponse(allWords));
    } catch (e) {
        res.status(500).send(generateResponse(null, e));
    }
});

router.get('/words/:setId', authMiddleware, async (req: Request, res: Response) => {
    try {
        const { setId } = req.params;
        if (!setId) {
            return res.status(400).send(generateResponse(null, "Set id is not provded"));
        }

        const userId = (req as IReqAuthMiddleware).user._id;

        if (userId) {
            const wordSet = await WordSetModel.findById(setId);

            if (!wordSet) {
                return res.status(404).send(generateResponse(null, "Word set is not found"));
            }

            if (String(wordSet.owner) !== String(userId)) {
                return res.status(403).send(generateResponse(null, "You have no rights to watch the words of this set"));
            }

            const words = await wordSet.populate('words').execPopulate();
            return res.send(generateResponse(words))
        }
    } catch (e) {
        res.status(500).send(generateResponse(null, e));
    }
})

router.delete('/words/:id', authMiddleware, async (req: Request, res: Response) => {
    try {
        const wordId = req.params.id;

        if (!wordId) {
            return res.status(400).send(generateResponse(null, "Word id is not provided"));
        }

        const wordToDelete = await WordModel.findById(wordId);
        if (!wordToDelete) {
            return res.status(404).send(generateResponse(null, "Word is not found"));
        }

        await wordToDelete.delete();
        return res.send(generateResponse(wordToDelete, null, "Word has been deleted"));
    } catch (e) {
        res.status(500).send(generateResponse(null, e));
    }
})

router.patch('/words/:id', authMiddleware, async (req: Request, res: Response) => {
    try {
        const allowedFields = ['imgUrl', 'rus', 'eng'];
        const dissalowedField = findLastDisallowedField(req.body, allowedFields);

        if (dissalowedField) {
            return res.status(400).send(generateResponse(null, `${dissalowedField} isn't allowed to be changed`));
        }

        const wordId = req.params.id;

        if (!wordId) {
            return res.status(400).send(generateResponse(null, "Word id is not provided"));
        }

        const wordToUpdate = await WordModel.findById(wordId);
        if (!wordToUpdate) {
            return res.status(404).send(generateResponse(null, "Word is not found"));
        }

        Object.keys(req.body).forEach((field) => {
            const value = req.body[field];
            if (value) {
                // @ts-ignore
                wordToUpdate[field] = value;
            }
        });

        await wordToUpdate.save();

        return res.send(generateResponse(wordToUpdate, null, "A word successfully updated"));
    } catch (e) {
        return res.status(500).send(generateResponse(null, e));
    }
});

router.patch('/words/:id/addToSet', authMiddleware, async (req: Request, res: Response) => {
    try {
        const wordId = req.params.id;
        if (!wordId) {
            return res.status(400).send(generateResponse(null, "A word id is not provided"));
        }

        const setId = req.body.setId;
        if (!setId) {
            return res.status(400).send(generateResponse(null, "A set id is not provided"));
        }

        const setToAdd = await WordSetModel.findById(setId);
        if (!setToAdd) {
            return res.status(404).send(generateResponse(null, "A set is not found"));
        }

        const userId = (req as IReqAuthMiddleware).user._id;

        if (String(userId) !== String(setToAdd.owner)) {
            return res.status(403).send(generateResponse(null, "You have no rights to update this set"));
        }

        const wordToBeAdded = await WordModel.findById(wordId);
        if (!wordToBeAdded) {
            return res.status(404).send(generateResponse(null, "A word is not found"));
        }

        if (!wordToBeAdded.setIds.includes(setId)) {
            wordToBeAdded.setIds.push(setId);
            await wordToBeAdded.save();
        } else {
            return res.status(400).send(generateResponse(null, "A word has been already added to a set"));
        }

        return res.send(generateResponse(wordToBeAdded, null, "A set added"));
    } catch (e) {
        res.status(500).send(generateResponse(null, e));
    }
})

router.patch('/words/:wordId/removeSet', authMiddleware, async (req: Request, res: Response) => {
    try {
        const wordId = req.params.wordId;
        if (!wordId) {
            return res.status(400).send(generateResponse(null, "A word id is not provided"));
        }

        const setId = req.body.setId;
        if (!setId) {
            return res.status(400).send(generateResponse(null, "A set id is not provided"));
        }

        const setToRemove = await WordSetModel.findById(setId);
        if (!setToRemove) {
            return res.status(404).send(generateResponse(null, "A set is not found"));
        }

        const userId = (req as IReqAuthMiddleware).user._id;

        if (String(userId) !== String(setToRemove.owner)) {
            return res.status(403).send(generateResponse(null, "You have no rights to update this set"));
        }

        const word = await WordModel.findById(wordId);
        if (!word) {
            return res.status(404).send(generateResponse(null, "A word is not found"));
        }

        if (word.setIds.includes(setId)) {
            word.setIds = word.setIds.filter(id => String(setId) !== String(id));

            if (!word.setIds.length) {
                await word.delete();

                return res.send(generateResponse(null, "A word has been removed at all"));
            }

            await word.save();
        } else {
            return res.status(400).send(generateResponse(null, "A set didn't have this word"));
        }

        return res.send(generateResponse(word, null, "A set removed"));
    } catch (e) {
        res.status(500).send(generateResponse(null, e));
    }
})


export { router as wordsRouter };
