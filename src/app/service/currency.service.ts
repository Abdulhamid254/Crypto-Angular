import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  // creating a behaviour subject that helps us pass data btween components

  private selectedCurrency$: BehaviorSubject<string> =
    new BehaviorSubject<string>('INR');
  constructor() {}

  //configuring the getters & setters
  getCurrency() {
    return this.selectedCurrency$.asObservable();
  }

  setCurrency(currency: string) {
    this.selectedCurrency$.next(currency);
  }
}
