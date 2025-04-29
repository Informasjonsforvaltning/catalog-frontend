
export interface DataStorage<T> {    
    get: () => T | null;
    set: (values: T) => void;
    delete: () => void;
}

export type LocalDataStorageConfig = {
    key: string;
}

export class LocalDataStorage<T> implements DataStorage<T> {

    key: string;

    constructor(config: LocalDataStorageConfig) {
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
