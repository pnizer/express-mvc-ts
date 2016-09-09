import { MongoClient, Db, Server, Collection } from "mongodb";

export class MongoRepository {
    private static _db: Db;
    
    static async connect() {
        if (this._db) return;

        try {
            this._db = await MongoClient.connect("mongodb://localhost:27017/mydb");            
            console.log('Connected to MongoDb');

            // indexes
            await MongoRepository.users.createIndex({username: 1}, {unique: true});
            await MongoRepository.users.createIndex({role: 1});

            await MongoRepository.images.createIndex({sha1: 1});
            await MongoRepository.images.createIndex({sha1: 1, name:1});
        } catch (err) {            
            console.error(err);        
        }
    } 

    static get db() : Db { return this._db; }     

    static get users() : Collection { return this.db.collection('users'); }
    static get images() : Collection { return this.db.collection('images'); }
}
 
MongoRepository.connect();
