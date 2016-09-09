import { post, get } from "../mvc/routes";
import { Request, Response } from "express";
import { MongoRepository } from "../repository/mongo-repository";

import * as bcrypt from "bcryptjs";
import * as moment from "moment";

import { User } from "../controllers/users";

import { TokenHelper } from "../security/token";
import * as pzr from "../commons/promizer"; 

export const HMAC_SECRET = "mysecret";

export class AuthController {
    @post('/')
    async index(req: Request, res: Response) {
        let user = await MongoRepository.users.findOne({username: req.body.username});
        if (!user) {
            res.status(401).end();
            return;
        }

        let success = await pzr.errvalue(bcrypt.compare)(req.body.password, user.password);
        if (success) {
            let tokenData = {username: user.username, expires: moment().add(3, "days").toISOString() }
            res.json({token: TokenHelper.generateToken(JSON.stringify(tokenData), HMAC_SECRET)});                
        } else {
            res.status(401).end();
        }
    }
}
