import { Component } from '@angular/core';
import { CurrencyService } from './service/currency.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  selectedCurrency: string = 'INR'; // selected value by default is INR
  constructor(private currencyService: CurrencyService) {}
  sendCurrency(event: string) {
    console.log(event); // this event here has the value of our dropdown

    // the setter is done here
    this.currencyService.setCurrency(event);
  }
}
