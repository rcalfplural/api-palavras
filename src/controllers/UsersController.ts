import { Request, Response, NextFunction } from "express";
import { getCustomRepository } from "typeorm";
import { UserRepository } from "../model/UserRepository";
import { hash } from "bcrypt";
import { User } from "../entities/User";

class UsersController{
    async store(req: Request, res: Response, next: NextFunction){
        try{
            const usersRepository: UserRepository = getCustomRepository(UserRepository);
            const { username, password, profilePicture = "", isAdmin = false } = req.body;

            const userExists: User | undefined = await usersRepository.findOne({ username });
            if(!username || !password) throw new Error("Required data not provided.");
            if(userExists) throw new Error("User already registered.");

            const passwordHash: string = await hash(password, 8);

            const user: User = usersRepository.create({ username, isAdmin, password: passwordHash, profilePicture });

            await usersRepository.save(user);

            user.password = "segredo";
            return res.status(201).json({ message: "User created", user });
        }catch(err){
            next(err);
        }
    }
    async index(req: Request, res: Response, next: NextFunction){
        try{
            const usersRepository: UserRepository = getCustomRepository(UserRepository);

            const [ users, count ] = await usersRepository.findAndCount();
            
            // excluding password manuakemtnesd
            users.forEach((u: User)=> u.password="segredo");

            return res.status(200).json({
                total: count,
                users
            });
        }catch(err){
            next(err);
        }
    }
    async update(req: Request, res: Response, next: NextFunction){
        try{
            const { user_id } = req;
            const { username, password } = req.body;

            const usersRepository: UserRepository = getCustomRepository(UserRepository);

            const userExist = await usersRepository.findOne({ id: user_id });


            if(userExist.id != req.user_id){
                throw new Error("Forbidden!");
            }

            const anotherExist = await usersRepository.findOne({ username });
            if(anotherExist && anotherExist.id != user_id){   
                throw new Error("Username already taken.")
            }
            userExist.password = (password) ? password : userExist.password;
            userExist.username = (username) ? username : userExist.username;

            await usersRepository.save(userExist);

            return res.status(200).json(userExist);
        }catch(err){
            console.error(err);
            return next(err);
        }
    }
}

export { UsersController };