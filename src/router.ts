import { NextFunction, Request, Response, Router } from "express";
import { AnagramsController } from "./controllers/AnagramsController";
import { UsersController } from "./controllers/UsersController";
import { WordsController } from "./controllers/WordsController";

const router = Router();

// controllers
const wordsController = new WordsController();
const anagramsController = new AnagramsController();
const usersController = new UsersController();

router.get("/", (req: Request, res: Response, next: NextFunction)=>{
    return res.json({ message: "OK" }); 
});

router.get("/words", wordsController.index);
router.get("/words/:word", wordsController.show);

router.post("/words", wordsController.store);
router.post("/users", usersController.store);

router.put("/words/update", wordsController.update);
router.delete("/words/remove/:word", wordsController.remove);

router.get("/anagrams/:word", anagramsController.index);

export default router;