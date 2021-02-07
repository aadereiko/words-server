import { WORD_SET_TYPES, USER_WORD_SET_DEFAUL_LIST } from './../models/wordSet/wordSet.types';
import { WordSetModel } from './../models/wordSet/wordSet.model';

export const createDefaultSetsForUser = async (userId: string) => {
    USER_WORD_SET_DEFAUL_LIST.forEach(async ({ name, description }) => {
        try {
            const createdSet = new WordSetModel({
                owner: userId,
                name: name || 'Default set',
                description,
                setType: WORD_SET_TYPES.SYSTEM,
            });

            await createdSet.save();
        } catch (e) {
            throw new Error(e);
        }
    });
}