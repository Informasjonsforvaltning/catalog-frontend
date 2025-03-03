
export interface CatalogStorage<T> {    
    get: () => T | null;
    set: (values: T) => void;
    delete: () => void;
}

export type CatalogLocalStorageConfig = {
    key: string;
}

export class CatalogLocalStorage<T> implements CatalogStorage<T> {

    key: string;

    constructor(config: CatalogLocalStorageConfig) {
        this.key = config.key;
    }

    get(): T | null {
        const savedData = localStorage.getItem(this.key);
        if (savedData) {
            return JSON.parse(savedData) as T;
        }
        return null;
    }

    set(data: T) {
        localStorage.setItem(this.key, JSON.stringify(data));
    }

    delete() {
        localStorage.removeItem(this.key);  
    }
}
