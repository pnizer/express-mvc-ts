import { MongoRepository } from "../repository/mongo-repository";
import * as pzr from "../commons/promizer";

import * as crypto from 'crypto';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';

import * as mime from 'mime-types';
import * as uuid from "uuid";

export interface Image {
    _id: string,
    sha1: string,
    name: string,
    size: number,
    extension: string,
    mimetype: string
}

export class StorageService {
    static STORAGE_LOCATION: string = process.env.STORAGE_DIR || './data';

    static async store(file: Express.Multer.File) : Promise<Image> {
        // console.log(`storing file: ${file.originalname}...`);
        let ext = mime.extension(file.mimetype);        

        let sha1 = await new Promise<string>((resolve, reject) => {
            let hash = crypto.createHash('sha1');

            fs.createReadStream(file.path)
                .on('data', chunk => hash.update(chunk))
                .on('end', () => resolve(hash.digest('hex')))
                .on('error', reject);
        });
        // console.log(`> sha1: ${sha1}`);
        
        let storedImage = await MongoRepository.images.findOne({sha1, name: file.originalname});

        if (storedImage) {
            // console.log(`> already in database. id: ${storedImage._id}`);
            await fs.unlink(file.path);
            return storedImage;
        }

        let imageDiffName = await MongoRepository.images.findOne({sha1});
        if (imageDiffName) {
            // console.log(`> already stored, but with different name`);
            await fs.unlink(file.path);            
        } else {
            // console.log(`> moving to data directory...`);                
            let folder = this.imageFolder(sha1);
            let exists = await pzr.value(fs.exists)(folder)
            if (!exists) {
                await pzr.errvalue(mkdirp)(folder);
            }

            let path = `${folder}/${sha1}.${ext}`;
            await pzr.err(fs.rename)(file.path, path);
        }

        // console.log(`> saving in database...`);
        let image: Image = {
            _id: uuid.v4(),
            sha1,
            extension: ext,
            name: file.originalname,
            size: file.size,
            mimetype: file.mimetype
        };

        let result = await MongoRepository.images.insert(image);
        return result.ops[0];
    }

    private static imageFolder(sha1: string) {
        return `${this.STORAGE_LOCATION}/${sha1.substr(0, 2)}/${sha1.substr(2, 2)}`;
    }

    static imagePath(image: Image) {
        let sha1 = image.sha1;
        return `${sha1.substr(0, 2)}/${sha1.substr(2, 2)}/${sha1}.${image.extension}`;
    }
}
