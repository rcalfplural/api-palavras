import { Request, Response, NextFunction } from "express";
import { getCustomRepository, Repository, FindManyOptions, MoreThanOrEqual } from "typeorm";
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
            const { page = 1, sort = null, min_rate = null, rate = null, min_anagram = null, anagram = null, min_length = null, length = null } = req.query;
            const sortOpt = sort as 1 | "ASC" | -1 | "DESC";
            // const opt = sort ? { order: { use_rate: sortOpt }} : {};
            const opt: FindManyOptions<Word> = { where: {} };
            if(rate || min_rate) opt.where["use_rate"] = (min_rate)? MoreThanOrEqual(min_rate):(rate)?Number(rate):{};
            if(anagram || min_anagram) opt.where["anagram_number"] = (min_anagram)? MoreThanOrEqual(min_anagram):(anagram)? Number(anagram) :{};
            if(length || min_length) opt.where = { ...<Object>opt.where, length: (min_length)? MoreThanOrEqual(min_length):(length)? Number(length) :{}};
            console.log(opt);
            const [words, n] = await wordRepository.findAndCount(opt);
            // paginations 
            let thisPage = Number(page);
            
            const maxItems = 5;
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

            const wordExist: Word | undefined = await wordRepository.findOne({ id: word });

            if(!wordExist) throw new Error("This word was not signed.");

            const removed = await wordRepository.delete(wordExist.id);

            return res.status(201).json({ removed: removed });
        }catch(err){
            next(err);
        }

    }
}

export { WordsController };