import * as express from "express";

type Action =  {(req: express.Request, res: express.Response): any}

interface Route {
    method: Method,
    path: string,
    fn: (req: express.Request, res: express.Response) => void; 
}

interface Controller {
    _routes?: Route[];
}

export type Method = 'get' |  'post' | 'delete' | 'put' | 'patch';

export function action(method: Method , path: string): MethodDecorator {
   return (target: Controller, name: string, descriptor: TypedPropertyDescriptor<Action>) => {
      let routes: Route[] = target._routes || (target._routes = []);      
      routes.push( {method, path, fn: descriptor.value} );
   };
}

export let get = (path: string) => action('get', path);
export let post = (path: string) => action('post', path);
export let put = (path: string) => action('put', path);
export let del = (path: string) => action('delete', path);
export let patch = (path: string) => action('patch', path);

export function routes(ctrl: {new (): Controller}) : express.Router {
   let instance = new ctrl();
   let router = express.Router();   

   instance._routes.forEach( r => router[r.method](r.path, r.fn.bind(instance)));
   return router;
}
