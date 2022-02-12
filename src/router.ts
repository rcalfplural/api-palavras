import { NextFunction, Request, Response, Router } from "express";
import { AnagramsController } from "./controllers/AnagramsController";
import { AuthenticationController } from "./controllers/AuthenticationController";
import { UsersController } from "./controllers/UsersController";
import { WordsController } from "./controllers/WordsController";
import { ensureAdmin } from "./middleware/ensureAdmin";
import { ensureAuthentication } from "./middleware/ensureAuthentication";

const router = Router();

// controllers
const wordsController = new WordsController();
const anagramsController = new AnagramsController();
const usersController = new UsersController();
const authenticationController = new AuthenticationController();


router.get("/", (req: Request, res: Response, next: NextFunction)=>{
    return res.json({ message: "OK" }); 
});

router.get("/words", wordsController.index);
router.get("/words/:word", wordsController.show);

router.post("/words", ensureAuthentication, ensureAdmin, wordsController.store);
router.post("/users", usersController.store);

router.put("/words/update", wordsController.update);
router.delete("/words/remove/:word", ensureAuthentication, ensureAdmin, wordsController.remove);

router.get("/anagrams/:word", anagramsController.index);
router.get("/users", usersController.index);
router.post("/users/auth", authenticationController.store);

export default router;