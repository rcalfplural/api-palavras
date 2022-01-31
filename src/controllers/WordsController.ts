import { Request, Response, NextFunction } from "express";
import { getCustomRepository } from "typeorm";
import { Word } from "../entities/Word";
import { WordRepository } from "../model/WordRepository";
import IsPalindrome from "../utils/Palindrome";

class WordsController{
    async store(req: Request, res: Response, next: NextFunction){
        try{
            const { word } = req.body;
            const wordRepository = getCustomRepository(WordRepository);

            const wordExist: Word | undefined = await wordRepository.findOne({ word });

            if(wordExist) throw new Error("Word already asigned");

            const isPalindrome = IsPalindrome(word);

            const schema = wordRepository.create({ is_palindrom: isPalindrome, word });

            await wordRepository.save(schema);

            return res.status(201).json({ new_word: schema });
        }catch(err){
            next(err);
        }

    };
    async index(req: Request, res: Response, next: NextFunction){
        try{
            const wordRepository = getCustomRepository(WordRepository);
        
            const words = await wordRepository.find();

            return res.status(200).json({ words });
        }catch(err){
            next(err);
        }
    }
}

export { WordsController };