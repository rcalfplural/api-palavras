import { NextFunction, Request, Response, Router } from "express";
import { AnagramsController } from "./controllers/AnagramsController";
import { AuthenticationController } from "./controllers/AuthenticationController";
import { WordsController } from "./controllers/WordsController";
import { ensureAdmin } from "./middleware/ensureAdmin";
import { ensureAuthentication } from "./middleware/ensureAuthentication";

const router = Router();

// controllers
const wordsController = new WordsController();
const anagramsController = new AnagramsController();
const authenticationController = new AuthenticationController();


router.get("/", (req: Request, res: Response, next: NextFunction)=>{
    return res.json({ message: "OK" }); 
});

router.get("/words", wordsController.index);
router.get("/words/:word", wordsController.show);

router.post("/words", wordsController.store);

router.put("/words/update", wordsController.update);
router.delete("/words/remove/:word", wordsController.remove);

router.get("/anagrams/:word", anagramsController.index);
export default router;