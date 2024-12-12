import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', // This makes the service available app-wide
})
export class GlobalStateService {
  private _dataInitialized: boolean = false; // Default state

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
