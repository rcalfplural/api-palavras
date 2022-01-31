import { Request, Response, NextFunction } from "express";
import { getCustomRepository, Repository } from "typeorm";
import { Word } from "../entities/Word";
import { WordRepository } from "../model/WordRepository";
import Factorial from "../utils/Factorial";
import IsPalindrome from "../utils/Palindrome";

class AnagramsController{
    async index(req: Request, res: Response, next: NextFunction){
        try{
            const { word } = req.params;
            const wordRepository = getCustomRepository(WordRepository);
        
            const wordExist = await wordRepository.findOne({ word });

            if(!wordExist) throw new Error("This word was not signed.");

            const anagrams = await wordRepository.find({ where: { anagram_of: wordExist }});

            return res.status(200).json({ anagramas: anagrams });
        }catch(err){
            next(err);
        }
    }
}

export { AnagramsController };