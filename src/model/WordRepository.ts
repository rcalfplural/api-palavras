import { Repository, EntityRepository } from "typeorm";
import { Word } from "../entities/Word";

@EntityRepository(Word)
class WordRepository extends Repository<Word>{};

export { WordRepository };