import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', // This makes the service available app-wide
})
export class GlobalStateService {
  private _dataInitialized: boolean = false; // Default state

  commonArticles: {
    16: {
      p1: number;
      p2: number;
      p3: number;
    };
    17: {
      p1: number;
      p2: number;
      p3: number;
    };
    26: {
      p1: number;
      p2: number;
      p3: number;
    };
  } = {
    16: {
      p1: 0,
      p2: 0,
      p3: 0,
    },
    17: {
      p1: 0,
      p2: 0,
      p3: 0,
    },
    26: {
      p1: 0,
      p2: 0,
      p3: 0,
    },
  };

  // Getter for the variable
  get dataInitialized(): boolean {
    return this._dataInitialized;
  }

  // Setter for the variable
  set dataInitialized(value: boolean) {
    this._dataInitialized = value;
  }

  // Method to toggle the variable
  toggleMenu(): void {
    this._dataInitialized = !this._dataInitialized;
  }
}
