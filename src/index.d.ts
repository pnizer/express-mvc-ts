declare namespace Express {
    export interface Request { 
        user: any;
    }
}

declare module 'mime-types' {
    export function lookup(path: string): string;
    export function contentType(type: string): string;
    export function extension(type: string): string;
    export function charset(type: string): string;
    
    export var types: string[];
    export var extensions: string[][];
}

declare module 'uuid' {
    interface V4Options {
        random?: number[],
        rng?: () => number[]
    }
    export function v4(options?: V4Options) : string;
    export function v4(options: V4Options, buffer: number[], offset?: number) : number[];
    export function v4(options: V4Options, buffer: Buffer, offset?: number) : Buffer;
}

declare module 'base64-url' {
    export function encode(data: string|Buffer): string;
    export function decode(str: string): string;
    export function escape(str: string): string;
    export function unescape(str: string): string;
}
