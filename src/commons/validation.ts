import {validate} from "class-validator";
import * as _ from "underscore";

export async function createCheck<T>(constructor: {new (): T}, data: any): Promise<T> {
    return check(await extend(constructor, data));
}

export async function updateCheck<T>(obj: T, data: any): Promise<T> {
    return check(await extend(obj, data));
}

export async function extend<T>(c: T | {new (): T}, data: any): Promise<T> {
    if (!data) {
        return null;
    }

    let obj;
    if (typeof c === 'object') {
        obj = c;
    } else {
        obj = new c();
    }
    _.extend(obj, data);

    for (let prop in obj) {
        if (c.hasOwnProperty(prop)) {
            let type = Reflect.getMetadata('design:type', obj, prop);
            if (typeof type === 'undefined') {
                delete obj[prop];
            }
        }
    }

    return obj;
}

export async function check<T>(object: T): Promise<T> {
    let errors = await validate(object);
    if (errors.length == 0) {
        return object;
    }
    throw errors;
}
