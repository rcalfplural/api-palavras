import express, { Request, Response, NextFunction } from "express";

import router from "./router";

import "./database";

const app = express();

app.use(express.json());
app.use(router);
app.use((error: Error, req: Request, res: Response, next: NextFunction)=>{
    if(error instanceof Error){
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