import { authMiddleware, IReqAuthMiddleware } from './../middlewares/auth';
import { WordModel } from './../models/word/word.model';
import { generateResponse } from './../general/helpers/request';
import express, { Request, Response } from 'express';
import { WordSetModel } from '../models/wordSet/wordSet.model';
import { wordSetsRouter } from './wordSets';

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

        const newWord = new WordModel(req.body);
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
            const setToAddWord = await WordSetModel.findById(setId);

            if (!setToAddWord) {
                return res.status(404).send(generateResponse(null, "Word set is not found"));
            }

            if (String(setToAddWord.owner) !== String(userId)) {
                return res.status(403).send(generateResponse(null, "You have no rights to watch the words of this set"));
            }

            const words = await setToAddWord.populate('words').execPopulate();

            console.log(words);

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
            return res.status(400).send(generateResponse(null, "Set id is not provided"));
        }


        const wordToDelete = await WordModel.findById(wordId);
        if (!wordToDelete) {
            return res.status(404).send(generateResponse(null, "Word is not found"));
        }

        const setOfWordToDelete = await WordSetModel.findById(wordToDelete.setId);
        if (!setOfWordToDelete) {
            return res.status(404).send(generateResponse(null, "Set is not found"));
        }

        const userId = (req as IReqAuthMiddleware).user._id;

        if (!(String(userId) === String(setOfWordToDelete.owner))) {
            return res.status(403).send(generateResponse(null, "You have no rights to remove this word"));
        }

        await wordToDelete.delete();
        return res.send(generateResponse(wordToDelete, null, "Word has been deleted"));
    } catch (e) {
        res.status(500).send(generateResponse(null, e));
    }
})

export { router as wordsRouter };
