import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../service/api.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { CurrencyService } from '../service/currency.service';

@Component({
  selector: 'app-coin-list',
  templateUrl: './coin-list.component.html',
  styleUrls: ['./coin-list.component.scss'],
})
export class CoinListComponent implements OnInit {
  // storing banner data with a property
  // bannerData: Record<string, string | number>[] = [];
  bannerData: any = [];
  currency: string = 'INR'; // by default selected currency is INR
  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = [
    'symbol',
    'current_price',
    'price_change_percentage_24h',
    'market_cap',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private api: ApiService,
    private router: Router,
    private currencyService: CurrencyService
  ) {}

  ngOnInit(): void {
    this.getAllData();
    this.getBannerData();
    //setting the currency value
    this.currencyService.getCurrency().subscribe((val) => {
      this.currency = val;
      // updates
      this.getAllData();
      this.getBannerData();
    });
  }

  getBannerData() {
    this.api.getTrendingCurrency(this.currency).subscribe((res) => {
      console.log(res);
      this.bannerData = res;
    });
  }
  getAllData() {
    this.api.getCurrency(this.currency).subscribe((res) => {
      console.log(res);
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  // we are taking the row value because under the row value is where we have the ID
  goToDetails(row: any) {
    this.router.navigate(['coin-detail', row.id]);
  }
}
