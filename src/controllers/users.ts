import { action, get } from "../mvc/routes";
import { Request, Response } from "express";

export class UsersController {
    foo = 'barra';

    @get('/')
    index(req: Request, res: Response) {                
        res.json( {foo: this.foo} );
    }

    @action('get', '/x')
    x(req: Request, res: Response) {
        res.json(this.foo);
    }
}
