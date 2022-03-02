import { getCustomRepository } from "typeorm";
import { UserRepository } from "../model/UserRepository";
import { compare } from "bcrypt";
import { Request, Response, NextFunction } from "express";
import { User } from "../entities/User";
import { sign } from "jsonwebtoken";

class AuthenticationController{

    async store(req: Request, res: Response, next: NextFunction){
        try{
            const { username, password } = req.body;
            const userRepository: UserRepository = getCustomRepository(UserRepository);
            const userExist: User | undefined = await userRepository.findOne({ username });
            console.log(`É o iambu chitao e o chororo ${username} e ${password}`);
            console.log(req.body.body);
            if(!userExist) throw new Error("Authentication failed. Check your credentials. (user nao existe)");
            console.log(password, userExist.password);
            if(!await compare(password, userExist.password)) throw new Error("Authentication failed. Check your credentials.");

            const token = sign({
                username,
            }, String(process.env.SECRET), {
                expiresIn: "7d",
                subject: userExist.id
            });

            
            res.setHeader('Access-Control-Allow-Credentials','true');
            return res.status(200).cookie("authentication", token, {
                httpOnly: true,
                secure: true
            }).json({
                message: "OK"
            });
        }catch(err){
            console.error(err);
            next(err);
        }
    }
}

export { AuthenticationController };