import { Component, OnInit } from '@angular/core';
import { ClarityModule } from '@clr/angular';
import { ClarityIcons, downloadIcon } from '@cds/core/icon';
import { DataService, SellWishItem, SellDirectItem, Production, Order, WorkingTime } from '../data.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-export',
  standalone: true,
  imports: [
    ClarityModule,
    CommonModule
  ],
  templateUrl: './export.component.html',
  styleUrl: './export.component.scss'
})
export class ExportComponent implements OnInit {
  sellWishItems: SellWishItem[] = [];
  sellDirectItems: SellDirectItem[] = [];
  orderListItems: Order[] = [];
  productionListItems: Production[] = [];
  workingTimeListItems: WorkingTime[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    const data = this.dataService.getData();
    if (data) {
      this.sellWishItems = data.output.sellWish.items;
      this.sellDirectItems = data.output.sellDirect.items;
      this.orderListItems = data.output.orderList.orders;
      this.productionListItems = data.output.productionList.productions;
      this.workingTimeListItems = data.output.workingTimeList.workingTimes;
    } else {
      console.error("Data is null or not available.");
    }
  }
}


ClarityIcons.addIcons(downloadIcon);
