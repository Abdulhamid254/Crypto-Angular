import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../service/api.service';
import { ActivatedRoute } from '@angular/router';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts'; // HELPS IN UPDATING OUR CHART
import { CurrencyService } from '../service/currency.service';

@Component({
  selector: 'app-coin-detail',
  templateUrl: './coin-detail.component.html',
  styleUrls: ['./coin-detail.component.scss'],
})
export class CoinDetailComponent implements OnInit {
  coinData: any;
  coinId!: string;
  days: number = 30;
  currency: string = 'INR';
  // chartconfiguration here is the interface
  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [], // dataset & labels as blank since we will be fillingthem dynamically
        label: `Price Trends`,
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: '#009688',
        pointBackgroundColor: '#009688',
        pointBorderColor: '#009688',
        pointHoverBackgroundColor: '#009688',
        pointHoverBorderColor: '#009688',
      },
    ],
    labels: [],
  };
  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      point: {
        radius: 1,
      },
    },

    plugins: {
      legend: { display: true },
    },
  };

  //defining the chart type
  public lineChartType: ChartType = 'line';
  @ViewChild(BaseChartDirective) myLineChart!: BaseChartDirective;

  // getting the id from the routes that is why we are using activated routes
  constructor(
    private api: ApiService,
    private activatedRoute: ActivatedRoute,
    private currencyService: CurrencyService
  ) {}

  ngOnInit(): void {
    // getting the id from the params
    this.activatedRoute.params.subscribe((val) => {
      this.coinId = val['id'];
    });
    this.getCoinData();
    this.getGraphData(this.days);
    this.currencyService.getCurrency().subscribe((val) => {
      this.currency = val;
      this.getGraphData(this.days);
      this.getCoinData();
    });
  }

  getCoinData() {
    this.api.getCurrencyById(this.coinId).subscribe((res) => {
      console.log(this.coinData);
      if (this.currency === 'USD') {
        res.market_data.current_price.inr = res.market_data.current_price.usd;
        res.market_data.market_cap.inr = res.market_data.market_cap.usd;
      }
      res.market_data.current_price.inr = res.market_data.current_price.inr;
      res.market_data.market_cap.inr = res.market_data.market_cap.inr;
      this.coinData = res;
    });
  }

  getGraphData(days: number) {
    this.days = days; // this brings out the dynamics of 30 90 year
    this.api;
    this.api
      .getGrpahicalCurrencyData(this.coinId, this.currency, this.days)
      .subscribe((res) => {
        setTimeout(() => {
          this.myLineChart.chart?.update(); // update call on clicking of the button
        }, 200);
        this.lineChartData.datasets[0].data = res.prices.map((a: any) => {
          return a[1];
        });
        this.lineChartData.labels = res.prices.map((a: any) => {
          let date = new Date(a[0]);
          let time =
            date.getHours() > 12
              ? `${date.getHours() - 12}: ${date.getMinutes()} PM`
              : `${date.getHours()}: ${date.getMinutes()} AM`;
          return this.days === 1 ? time : date.toLocaleDateString();
          // .getGrpahicalCurrencyData(this.coinId, 'INR', this.days)
          // .subscribe((res) => {
          //   // console.log(res);
          //   //getting the data
          //   this.lineChartData.datasets[0].data = res.prices.map((a: any) => {
          //     return a[1]; //we RE RETURNING THE 2ND ELEMENT OF THE ARRAY
          //   });
          //   // getting the labels
          //   this.lineChartData.labels = res.price((a: any) => {
          //     // bt it wants to return time here below we are coverting them to proper formats date and time
          //     let date = new Date(a[0]);
          //     let time =
          //       date.getHours() > 12
          //         ? `${date.getHours() - 12}: ${date.getMinutes()} PM`
          //         : `${date.getHours()}: ${date.getMinutes()} AM`;
          //     // if our days is equal to 1 return time else date
          //     return this.days === 1 ? time : date.toLocaleDateString();
        });
      });
  }
}
