import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  selectedCurrency: string = 'INR'; // selected value by default is INR
  constructor() {}
  sendCurrency(event: string) {
    console.log(event);
  }
}
