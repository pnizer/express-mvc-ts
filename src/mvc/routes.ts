import * as express from "express";

type Action =  {(req: express.Request, res: express.Response): any}
type Filter =  {(req: express.Request, res: express.Response, next: express.NextFunction): any}

interface ClassFilter {    
    filter: Filter 
}

interface MethodFilter {
    filter: Filter, 
    action: Action 
}

interface Route {
    method: Method,
    path: string,
    handlers: express.RequestHandler[],
    action: Action;
}

interface ControllerFunction {
    new (): Controller,
    _classFilters?: ClassFilter[]
}

interface Controller {     
    _routes?: Route[],
    _methodFilters?: MethodFilter[]
    _noFilters?: Action[],
    defaultCatch?(req: express.Request, res: express.Response, err: any)
}

export type Method = 'all' | 'get' |  'post' | 'delete' | 'put' | 'patch';

export function action(method: Method , path: string, ...handlers: express.RequestHandler[]): MethodDecorator {
   return (target: Controller, name: string, descriptor: TypedPropertyDescriptor<Action>) => {
      let routes = target._routes || (target._routes = []);      
      routes.push( {method, path, handlers, action: descriptor.value} );
   };
}

export let all = (path: string, ...handlers: express.RequestHandler[]) => action('all', path, ...handlers);
export let get = (path: string, ...handlers: express.RequestHandler[]) => action('get', path, ...handlers);
export let post = (path: string, ...handlers: express.RequestHandler[]) => action('post', path, ...handlers);
export let put = (path: string, ...handlers: express.RequestHandler[]) => action('put', path, ...handlers);
export let del = (path: string, ...handlers: express.RequestHandler[]) => action('delete', path, ...handlers);
export let patch = (path: string, ...handlers: express.RequestHandler[]) => action('patch', path, ...handlers);

export function filter(f: Filter): ClassDecorator & MethodDecorator {
    return (target: Controller | ControllerFunction, name?: string, descriptor?: TypedPropertyDescriptor<Action>) => {
        if (name) {
            let ctrl = target as Controller;
            let filters = ctrl._methodFilters || (ctrl._methodFilters = []);                    
            filters.push( {action: descriptor.value, filter: f} );
        } else {
            let ctrlFn = target as ControllerFunction;
            let filters = ctrlFn._classFilters || (ctrlFn._classFilters = []);                    
            filters.push( {filter: f} );
        }
    }
}

export function noFilter(ctrl: Controller, name: string, descriptor: TypedPropertyDescriptor<Action>) {
    let noFilters = ctrl._noFilters || (ctrl._noFilters = []);                    
    noFilters.push( descriptor.value );
}

export function routes(ctrlFn: ControllerFunction) : express.Router {
   let instance = new ctrlFn();
   let router = express.Router();   

   instance._routes.forEach( r => {
       if (ctrlFn._classFilters && (!instance._noFilters || !instance._noFilters.find(ac => ac == r.action))) {
           ctrlFn._classFilters.forEach(cf => {
               router[r.method](r.path, cf.filter);
           });
       }

        if (instance._methodFilters) {
            instance._methodFilters.filter(mf => mf.action === r.action).forEach(mf => {
                router[r.method](r.path, mf.filter);
            });
        }
        
        let action = r.action.bind(instance);       
        router[r.method](r.path, ...r.handlers, (req, res) => {                                      
            Promise.resolve().then(() => action(req, res)).catch(err => {
                if (!instance.defaultCatch) {
                    console.error(err);
                    res.status(500).json(err);
                } else {
                    instance.defaultCatch(req, res, err);
                }
            });
       })
    });
   return router;
}
