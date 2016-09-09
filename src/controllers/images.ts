import { post, get, filter } from "../mvc/routes";
import { Request, Response } from "express";
import { MongoRepository } from "../repository/mongo-repository";
import { ObjectID } from "mongodb";

import { StorageService, Image } from "../services/storage";

import * as multer from "multer";

import { auth }  from "../filters/auth-filter";

export class ImagesController {
    @get('/:id')
    async index(req: Request, res: Response) {
        let result = await MongoRepository.images.findOne({_id: req.params.id});
        if (!result) {
            res.status(404).end();
        } else {
            res.json(result);
        }
    }

    @filter(auth())
    @post('/', multer({dest: 'uploads/'}).single('image'))
    async save(req: Request, res: Response) {     
        let image = await StorageService.store(req.file);
        res.json(image);
    }
}
