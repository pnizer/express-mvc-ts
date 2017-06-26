export function errvalue<T>(fn: (cb: (err: any, value: T) => any) => any): () => Promise<T>;
export function errvalue<T, P1>(fn: (p1: P1, cb: (err: any, value: T) => any) => any): (p1: P1) => Promise<T>;
export function errvalue<T, P1, P2>(fn: (p1: P1, p2: P2, cb: (err: any, value: T) => any) => any): (p1: P1, p2: P2) => Promise<T>;
export function errvalue<T, P1, P2, P3>(fn: (p1: P1, p2: P2, p3: P3, cb: (err: any, value: T) => any) => any): (p1: P1, p2: P2, p3: P3) => Promise<T>;
export function errvalue<T, P1, P2, P3, P4>(fn: (p1: P1, p2: P2, p3: P3, p4: P4, cb: (err: any, value: T) => any) => any): (p1: P1, p2: P2, p3: P3, p4: P4) => Promise<T>;

export function errvalue<T>(fn: (...args: any[]) => any): (...args: any[]) => Promise<T> {
    return (...args: any[]) => {
        return new Promise((resolve, reject) => {
            fn(... [...args, (err, value) => err ? reject(err) : resolve(value)]);
        });
    };
}

export function err(fn: (cb: (err: any) => any) => any): () => Promise<void>;
export function err<P1>(fn: (p1: P1, cb: (err: any) => any) => any): (p1: P1) => Promise<void>;
export function err<P1, P2>(fn: (p1: P1, p2: P2, cb: (err: any) => any) => any): (p1: P1, p2: P2) => Promise<void>;
export function err<P1, P2, P3>(fn: (p1: P1, p2: P2, p3: P3, cb: (err: any) => any) => any): (p1: P1, p2: P2, p3: P3) => Promise<void>;
export function err<P1, P2, P3, P4>(fn: (p1: P1, p2: P2, p3: P3, p4: P4, cb: (err: any) => any) => any): (p1: P1, p2: P2, p3: P3, p4: P4) => Promise<void>;

export function err(fn: (...args: any[]) => any): (...args: any[]) => Promise<void> {
    return (...args: any[]) => {
        return new Promise<void>((resolve, reject) => {
            fn(... [...args, err => err ? reject(err) : resolve()]);
        });
    };
}

export function value<T>(fn: (cb: (value: T) => any) => any): () => Promise<T>;
export function value<T, P1>(fn: (p1: P1, cb: (value: T) => any) => any): (p1: P1) => Promise<T>;
export function value<T, P1, P2>(fn: (p1: P1, p2: P2, cb: (value: T) => any) => any): (p1: P1, p2: P2) => Promise<T>;
export function value<T, P1, P2, P3>(fn: (p1: P1, p2: P2, p3: P3, cb: (value: T) => any) => any): (p1: P1, p2: P2, p3: P3) => Promise<T>;
export function value<T, P1, P2, P3, P4>(fn: (p1: P1, p2: P2, p3: P3, p4: P4, cb: (value: T) => any) => any): (p1: P1, p2: P2, p3: P3, p4: P4) => Promise<T>;

export function value<T>(fn: (...args: any[]) => any): (...args: any[]) => Promise<T> {
    return (...args: any[]) => {
        return new Promise((resolve) => {
            fn(... [...args, value => resolve(value)]);
        });
    };
}


export function promisify<T>(obj: T, methods: string[]): void {
    for (let method of methods) {
        obj[method] = errvalue(obj[method].bind(obj))
    }
}

export function newCb<T>(resolve, reject): (err: any, value: T) => void {
    return (err, value) => {
        if (err) {
            reject(err);
        } else {
            resolve(value);
        }
    }
}

export function ErrValue<T>(fn: (cb: (err: any, value: T) => any) => any): Promise<T> {
    return new Promise((resolve, reject) => {
        fn(newCb(resolve, reject))
    })
}
