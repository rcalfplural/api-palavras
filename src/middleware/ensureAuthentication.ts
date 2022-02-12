import { verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface IPayload{
    sub: string;
}

export async function ensureAuthentication(req: Request, res: Response, next: NextFunction){
    // get the raw token
    const rawToken = req.headers.authorization;

    if(!rawToken){
        return res.status(401).end();
    }

    const [ bearer, token ] = rawToken.split(" ");

    // validate token
    try{
        const { sub } = verify(token, process.env.SECRET) as IPayload;
        req.user_id = sub.toString();

        return next();
    }
    catch(err){

        return res.status(401).end();
    }
}