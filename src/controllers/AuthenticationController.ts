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

            if(!userExist) throw new Error("Authentication failed. Check your credentials.");

            if(!await compare(password, userExist.password)) throw new Error("Authentication failed. Check your credentials.");

            const token = sign({
                username,
            }, String(process.env.SECRET), {
                expiresIn: "7d",
                subject: userExist.id
            });

            return res.status(200).cookie("authentication", token, {
                httpOnly: true,
                secure: true
            }).json({
                message: "OK"
            });
        }catch(err){
            next(err);
        }
    }
}

export { AuthenticationController };