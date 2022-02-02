import { Request, Response, NextFunction } from "express";
import { getCustomRepository, Repository } from "typeorm";
import { Word } from "../entities/Word";
import { WordRepository } from "../model/WordRepository";
import Factorial from "../utils/Factorial";
import IsPalindrome from "../utils/Palindrome";

class WordsController{
    static validClasses: string[] = [
        "substantivo",
        "adjetivo",
        "artigo",
        "numeral",
        "pronome",
        "verbo",
        "advérbio",
        "preposição",
        "conjunção",
        "interjeição"
    ];
    async store(req: Request, res: Response, next: NextFunction){
        try{
            const { word, use_rate, definition, wordClass } = req.body;
            const wordRepository = getCustomRepository(WordRepository);

            const wordExist: Word | undefined = await wordRepository.findOne({ word, word_class: wordClass });

            if(wordExist) throw new Error("Word already asigned");

            if(wordClass && !WordsController.validClasses.includes(String(wordClass).toLowerCase())) throw new Error("Invalid word class.");
            
            const isPalindrome = IsPalindrome(word);
            const length: number = word.length;
            const possibleAnagrams: number = Factorial(length);

            const rate = (use_rate)?use_rate:0;
            const def = (definition)?definition:"<definition pending>";
            const className = (wordClass)?wordClass:"<class pending>";

            const schema = wordRepository.create({ is_palindrom: isPalindrome, word, anagram_number: possibleAnagrams, length, use_rate: rate, definition: def, word_class: className });

            await wordRepository.save(schema);

            return res.status(201).json({ new_word: schema });
        }catch(err){
            next(err);
        }

    };
    async index(req: Request, res: Response, next: NextFunction){
        try{
            const wordRepository = getCustomRepository(WordRepository);
            const { page = 1 } = req.query;

            const [words, n] = await wordRepository.findAndCount();
            // paginations 
            let thisPage = Number(page);
            
            const maxItems = 1;
            const maxPages = Math.floor(n / maxItems);
            if(thisPage > maxPages) thisPage = maxPages;
            if(thisPage < 0) thisPage = 0;
            const startIndex = (thisPage-1) * maxItems;
            const endIndex = startIndex + maxItems;

            const data = (n > maxItems)?words.slice(startIndex, endIndex):words;
            return res.status(200).json({ page: thisPage, total: n, words: data });
        }catch(err){
            next(err);
        }
    }
    async show(req: Request, res: Response, next: NextFunction){
        try{
            const { word } = req.params;
            const wordRepository = getCustomRepository(WordRepository);

            const theWord = await wordRepository.find({where: {word}});

            if(!theWord) throw new Error("Word not found. Probably not signed on db.");

            return res.status(200).json({ theWord });
        }catch(err){
            next(err);
        }
    }

    async update(req: Request, res: Response, next: NextFunction){
        try{
            const { word, use_rate, definition, wordClass } = req.body;
            const wordRepository: WordRepository = getCustomRepository(WordRepository);

            const wordExist: Word | undefined = await wordRepository.findOne({ word, word_class: wordClass });

            if(!wordExist) throw new Error("This word was not signed.");
            if(wordClass && !WordsController.validClasses.includes(String(wordClass).toLowerCase())) throw new Error("Invalid word class.");
            

            const isPalindrome: boolean = IsPalindrome(word);
            const length: number = word.length;
            const possibleAnagrams: number = Factorial(length);

            wordExist.anagram_number = possibleAnagrams;
            wordExist.is_palindrom = isPalindrome;
            wordExist.length = length;
            wordExist.use_rate = (use_rate)?use_rate:0;
            wordExist.definition = (definition)?definition:wordExist.definition;
            wordExist.word_class = (wordClass)?wordClass:wordExist.word_class;

            await wordRepository.save(wordExist);

            return res.status(201).json({ new_word: wordExist });
        }catch(err){
            next(err);
        }

    }
    async remove(req: Request, res: Response, next: NextFunction){
        try{
            const { word } = req.params;
            const wordRepository: WordRepository = getCustomRepository(WordRepository);

            const wordExist: Word | undefined = await wordRepository.findOne({ word });

            if(!wordExist) throw new Error("This word was not signed.");

            const removed = await wordRepository.delete(wordExist.id);

            return res.status(201).json({ removed: removed });
        }catch(err){
            next(err);
        }

    }
}

export { WordsController };