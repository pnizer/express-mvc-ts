import { post, get, put, filter, noFilter } from "../mvc/routes";
import { Request, Response } from "express";
import { MongoRepository } from "../repository/mongo-repository";

import { auth }  from "../filters/auth-filter";
import * as pzr from "../commons/promizer";

import * as bcrypt from "bcryptjs";

export interface User {
    _id?: string,    
    username: string,
    password: string,
    role: string,
    data: any
}

@filter(auth())
export class UsersController {
    @get('/')
    @noFilter
    async index(req: Request, res: Response) {        
        let response = await MongoRepository.users.find().toArray();
        res.json(response);
    }

    @get('/me')
    async me(req: Request, res: Response) {
        res.json(req.user);
    }

    @put('/me')
    async updateMe(req: Request, res: Response) {
        let response = await MongoRepository.users.update({_id: req.user._id}, { $set: {data: req.body.data} });
        res.json(response);
    }    

    @noFilter        
    @post('/')
    async saveuser(req: Request, res: Response) {
        if (req.body.role.toLowerCase() == "admin") {
            res.status(403).end();
            return;
        }
        
        let result = await MongoRepository.users.findOne({username: req.body.username});
        if (result) {
            res.status(409).send('Duplicated username!');
            return;                
        }

        let user: User = {
            username: req.body.username, 
            password: req.body.password, 
            role: req.body.role, 
            data: req.body.data
        };
        user.password = await pzr.errvalue(bcrypt.hash)(user.password, 10);

        result = await MongoRepository.users.insert(user); 
        res.json(result.ops[0]);              
    }
}
