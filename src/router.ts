import { NextFunction, Request, Response, Router } from "express";
import { WordsController } from "./controllers/WordsController";

const router = Router();

// controllers
const wordsController = new WordsController();

router.get("/", (req: Request, res: Response, next: NextFunction)=>{
    return res.json({ message: "OK" }); 
});

router.get("/words", wordsController.index);

router.post("/words", wordsController.store);

export default router;