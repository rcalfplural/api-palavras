import express, { Request, Response, NextFunction } from "express";
import { config } from "dotenv";
import cors from "cors";

import router from "./router";

import "./database";

const app = express();
config();

app.use(cors({ origin: "https://cavalo.melitoskk.repl.co" }));
app.use(express.json());

app.use(router);
app.use((error: Error, req: Request, res: Response, next: NextFunction)=>{
    if(error instanceof Error){
        console.error(error);
        return res.status(400).json({
            error: error.message
        });
    }

    return res.status(500).json({
        status: "500",
        message: "Internal Server Error"
    });
});

app.listen(3333, ()=> console.log("> Server is on running"));