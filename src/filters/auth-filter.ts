import * as moment from "moment";

import { HMAC_SECRET }  from "../controllers/auth";
import { TokenHelper }  from "../security/token";
import { MongoRepository } from "../repository/mongo-repository";

export function auth() {
    return (req, res, next) => {
        let auth = req.header('Authorization');
        if (!auth || !auth.startsWith('Bearer ')) {
            res.status(401).send("401 Unauthorized");
            return;
        } 

        let json = TokenHelper.extractToken(auth.substr(7), HMAC_SECRET);
        if (!json) {
            res.status(401).send("Invalid token");
            return;            
        }

        let data: {username: string, expires: string} = JSON.parse(json);
        if (moment(data.expires).isBefore(new Date())) {
            res.status(401).send("Token expired");
            return;                        
        }

        MongoRepository.users.findOne({username: data.username}).then(user => {
            if (!user) {
                res.status(401).send("User not found!");
                return;                                            
            }

            req.user = user;
            next();
        }).catch(err => {
            console.error(err);            
            res.status(401).send("User not found!");
        });
    }
}