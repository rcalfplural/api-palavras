// import { Request, Response, NextFunction } from "express";
// import { getCustomRepository } from "typeorm";


// export async function ensureAdmin(req: Request, res: Response, next: NextFunction){
//     try{
//         const { user_id } = req;
//         const userRepository: UserRepository = getCustomRepository(UserRepository);
//         const userExist: User | undefined = await userRepository.findOne({ id: user_id });
//         if(!userExist){
//             return res.status(401).end();
//         }

//         if(!userExist.isAdmin){
//             return res.status(403).end();
//         }

//         return next();
//     }catch(err){
//         return res.status(403).end();
//     }
// }