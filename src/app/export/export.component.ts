import { Component, OnInit } from '@angular/core';
import { ClarityModule, ClrLoadingState } from '@clr/angular';
import { ClarityIcons, downloadIcon } from '@cds/core/icon';
import {
  DataService,
  SellWishItem,
  SellDirectItem,
  Production,
  Order,
  WorkingTime,
} from '../data.service';
import { CommonModule } from '@angular/common';
import * as xml2js from 'xml2js';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-export',
  standalone: true,
  imports: [ClarityModule, CommonModule, TranslateModule, RouterModule],
  templateUrl: './export.component.html',
  styleUrl: './export.component.scss',
})
export class ExportComponent implements OnInit {
  downloadBtnState: ClrLoadingState = ClrLoadingState.DEFAULT;

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

      this.filterItems();
    } else {
      console.error('Data is null or not available.');
    }
  }

  filterItems(): void {
    this.orderListItems = this.orderListItems.filter(order => order.quantity > 0);
    this.productionListItems = this.productionListItems.filter(production => production.quantity > 0);
  }
  downloadOutputAsXML(): void {
    const output = this.dataService.getData()?.output;

    this.downloadBtnState = ClrLoadingState.LOADING;

    if (!output) {
      console.error('Output data is null or undefined');
      this.downloadBtnState = ClrLoadingState.ERROR;
      return;
    }

    const formattedOutput = {
      input: {
        qualitycontrol: {
          $: {
            type: "no",
            losequantity: output.qualityControl.loseQuantity,
            delay: output.qualityControl.delay,
          },
        },
        sellwish: {
          item: output.sellWish.items.map((item: any) => ({
            $: {
              article: item.article,
              quantity: item.quantity,
            },
          })),
        },
        selldirect: {
          item: output.sellDirect.items.map((item: any) => ({
            $: {
              article: item.article,
              quantity: item.quantity,
              price: item.price,
              penalty: item.penalty,
            },
          })),
        },
        orderlist: {
          order: output.orderList.orders.map((order: any) => ({
            $: {
              article: order.article,
              quantity: order.quantity,
              modus: order.modus,
            },
          })),
        },
        productionlist: {
          production: output.productionList.productions.map(
            (production: any) => ({
              $: {
                article: production.article,
                quantity: production.quantity,
              },
            })
          ),
        },
        workingtimelist: {
          workingtime: output.workingTimeList.workingTimes.map(
            (workingTime: any) => ({
              $: {
                station: workingTime.station,
                shift: workingTime.shift,
                overtime: workingTime.overtime,
              },
            })
          ),
        },
      },
    };

    const builder = new xml2js.Builder();
    const xml = builder.buildObject(formattedOutput);

    const blob = new Blob([xml], { type: 'application/xml' });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'output.xml';

    link.click();

    window.URL.revokeObjectURL(link.href);

    this.downloadBtnState = ClrLoadingState.SUCCESS;
  }
}

ClarityIcons.addIcons(downloadIcon);
