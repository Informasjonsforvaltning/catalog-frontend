/**
 * Enhanced LocalDataStorage with State Management
 * 
 * This module provides a comprehensive local storage solution with:
 * - State tracking and change notifications
 * - Secondary storage management
 * - State history and undo functionality
 * - Data validation
 * - Debug utilities
 * 
 * Example usage:
 * 
 * ```typescript
 * // Basic usage with state management
 * const storage = new LocalDataStorage<StorageData>({
 *   key: 'formData',
 *   secondaryKeys: ['relationData', 'tempData'],
 *   onChange: (state) => console.log('State changed:', state),
 *   enableHistory: true,
 *   maxHistorySize: 5,
 *   validateData: (data) => data && typeof data === 'object'
 * });
 * 
 * // Subscribe to state changes
 * const unsubscribe = storage.subscribe((state) => {
 *   console.log('New state:', state);
 *   console.log('Has changes:', state.hasChanges);
 *   console.log('Is dirty:', state.isDirty);
 * });
 * 
 * // Set main data
 * storage.set({ id: '1', values: { name: 'Test' }, lastChanged: new Date().toISOString() });
 * 
 * // Set secondary data
 * storage.setSecondary('relationData', { id: '2', values: { relations: [] }, lastChanged: new Date().toISOString() });
 * 
 * // Get current state
 * const state = storage.getState();
 * console.log('Current state:', state);
 * 
 * // Access state history
 * const history = storage.getHistory();
 * console.log('State history:', history);
 * 
 * // Revert to previous state
 * const reverted = storage.revertToPreviousState();
 * 
 * // Debug current state
 * storage.debugState();
 * 
 * // Clean up
 * unsubscribe();
 * storage.delete();
 * ```
 */

export interface DataStorage<T> {
  get: () => T | null;
  getSecondary: (key: string) => T | null;
  set: (values: T, loose?: boolean) => void;
  setSecondary: (key: string, values: T) => void;
  deleteSecondary: (key: string) => void;
  delete: () => void;
  // State management methods
  getState: () => StorageState<T>;
  subscribe: (callback: (state: StorageState<T>) => void) => () => void;
}

export interface StorageState<T> {
  mainData: T | null;
  secondaryData: Record<string, T | null>;
  lastChanged: Date | null;
  isDirty: boolean;
  // Additional state properties
  version: number;
  lastSaved?: Date;
}

export type LocalDataStorageConfig<T = any> = {
  key: string;
  secondaryKeys?: string[];
  onChange?: (state: StorageState<T>) => void;
  // Additional configuration options
  enableHistory?: boolean;
  maxHistorySize?: number;
  validateData?: (data: T) => boolean;
};

export class LocalDataStorage<T> implements DataStorage<T> {
  key: string;
  secondaryKeys: string[];
  private loose: boolean;
  private subscribers: Set<(state: StorageState<T>) => void> = new Set();
  private currentState: StorageState<T>;
  private onChange?: (state: StorageState<T>) => void;
  private enableHistory: boolean;
  private maxHistorySize: number;
  private validateData?: (data: T) => boolean;
  private stateHistory: StorageState<T>[] = [];

  constructor(config: LocalDataStorageConfig<T>) {
    this.key = config.key;
    this.secondaryKeys = config.secondaryKeys || [];
    this.onChange = config.onChange;
    this.enableHistory = config.enableHistory || false;
    this.maxHistorySize = config.maxHistorySize || 10;
    this.validateData = config.validateData;
    this.loose = false;

    // Initialize state
    this.currentState = this.buildState();
    
    // Subscribe to onChange callback if provided
    if (this.onChange) {
      this.subscribe(this.onChange);
    }
  }

  private buildState(): StorageState<T> {
    const mainData = this.getFromStorage(this.key);
    const secondaryData: Record<string, T | null> = {};
    
    this.secondaryKeys.forEach(key => {
      secondaryData[key] = this.getFromStorage(key);
    });

    return {
      mainData,
      secondaryData,
      lastChanged: new Date(),
      isDirty: mainData !== null || Object.values(secondaryData).some(data => data !== null),
      version: 1, // Assuming a default version
    };
  }

  private getFromStorage(key: string): T | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    const savedData = localStorage.getItem(key);
    if (savedData) {
      return JSON.parse(savedData) as T;
    }
    return null;
  }

  private notifySubscribers() {
    this.currentState = this.buildState();
    
    // Add to history if enabled
    if (this.enableHistory) {
      this.addToHistory(this.currentState);
    }
    
    this.subscribers.forEach(callback => {
      try {
        callback(this.currentState);
      } catch (error) {
        console.error('Error in storage subscriber callback:', error);
      }
    });
  }

  private addToHistory(state: StorageState<T>) {
    this.stateHistory.push({ ...state });
    if (this.stateHistory.length > this.maxHistorySize) {
      this.stateHistory.shift();
    }
  }

  private validateAndSet(data: T): boolean {
    if (this.validateData && !this.validateData(data)) {
      console.warn('Data validation failed for storage:', this.key);
      return false;
    }
    return true;
  }

  get(): T | null {
    return this.currentState.mainData;
  }

  getSecondary(key: string): T | null {
    if (!this.secondaryKeys.includes(key)) {
      throw new Error(`Key ${key} is not a secondary key`);
    }
    return this.currentState.secondaryData[key];
  }

  set(data: T, loose?: boolean) {
    this.loose = loose || false;
    if (!this.validateAndSet(data)) {
      return;
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.key, JSON.stringify(data));
    }
    this.notifySubscribers();
  }

  setSecondary(key: string, data: T) {
    if (!this.secondaryKeys.includes(key)) {
      throw new Error(`Key ${key} is not a secondary key`);
    }
    if (!this.validateAndSet(data)) {
      return;
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(data));
    }
    this.notifySubscribers();
  }

  delete() {
    if (typeof localStorage !== 'undefined') {
      console.log('[LOCAL STORAGE]: Deleting main and secondary keys');
      localStorage.removeItem(this.key);
      this.secondaryKeys.forEach((key) => {
        localStorage.removeItem(key);
      });
    }
    this.notifySubscribers();
  }

  deleteSecondary(key: string) {
    if (!this.secondaryKeys.includes(key)) {
      throw new Error(`Key ${key} is not a secondary key`);
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
      const allEmpty = this.secondaryKeys.every((key) => {
        return localStorage.getItem(key) === null;
      });
      if (allEmpty && this.loose) {
        console.log('[LOCAL STORAGE]: All secondary keys are empty, main data is loose, deleting main key');
        this.delete();
      }
    }

    this.notifySubscribers();
  }

  getState(): StorageState<T> {
    return this.currentState;
  }

  subscribe(callback: (state: StorageState<T>) => void): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  // Public methods for state management
  getHistory(): StorageState<T>[] {
    return [...this.stateHistory];
  }

  getPreviousState(): StorageState<T> | null {
    return this.stateHistory.length > 1 
      ? this.stateHistory[this.stateHistory.length - 2] 
      : null;
  }

  revertToPreviousState(): boolean {
    const previousState = this.getPreviousState();
    if (previousState) {
      this.currentState = previousState;
      this.notifySubscribers();
      return true;
    }
    return false;
  }

  clearHistory(): void {
    this.stateHistory = [];
  }

  // Utility methods for state management
  getLastChanged(): Date | null {
    return this.currentState.lastChanged;
  }

  getVersion(): number {
    return this.currentState.version;
  }

  exportState(): StorageState<T> {
    return { ...this.currentState };
  }

  importState(state: StorageState<T>): void {
    this.currentState = { ...state };
    this.notifySubscribers();
  }

  // Debug methods
  debugState(): void {
    console.log('Storage State:', {
      key: this.key,
      state: this.currentState,
      historyLength: this.stateHistory.length,
      subscribersCount: this.subscribers.size
    });
  }

  // State comparison
  isStateEqual(otherState: StorageState<T>): boolean {
    return JSON.stringify(this.currentState) === JSON.stringify(otherState);
  }
}
