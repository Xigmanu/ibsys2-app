import { Component } from '@angular/core';
import { parseString } from 'xml2js';
import { FormControl, FormGroup } from '@angular/forms';
import { JsonPipe, CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule, ClrLoadingState } from '@clr/angular';
import { RouterOutlet, RouterModule } from '@angular/router';
import { DataStructure, Input, WarehouseStock, InwardStockMovementOrder, FutureInwardStockMovementOrder, IdleTimeCost, WaitingListWorkstation, MissingPart, OrderInWork, CompletedOrder, CompletedOrderBatch, CycleTimeOrder } from '../data.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-setup',
  standalone: true,
  imports: [
    JsonPipe, 
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ClarityModule,
    RouterModule,
    RouterOutlet,
  ],
  templateUrl: './setup.component.html',
  styleUrl: './setup.component.css'
})
export class SetupComponent {
  uploadBtnState: ClrLoadingState = ClrLoadingState.DEFAULT;
  constructor(private dataService: DataService) {}

  protected readonly form = new FormGroup({
    files: new FormControl<FileList | null>(null),
  });

  public jsonData: any; 
  public loadedData: any;
  public mappingError: boolean = false;
  public mappingSuccess: boolean = false;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const xmlData = reader.result as string;
        this.convertXmlToJson(xmlData);
      };
      reader.readAsText(file);
    }
    
  }



  convertXmlToJson(xml: string): void {
    parseString(xml, { explicitArray: false }, (err, result) => {
      if (err) {
        //console.error('Fehler beim Parsen des XML:', err);
      } else {
        this.jsonData = result; 
        //console.log('JSON-Daten:', this.jsonData);
      }
    });
  }

  //Mapping work.
  mapXmlData(jsonData: any): void {
    this.uploadBtnState = ClrLoadingState.LOADING;
    var dataSet: DataStructure = this.dataService.getData();
    this.mappingError = false;
    this.mappingSuccess = false;

    try {
      var input: Input = {
        metaData: {
            game: jsonData.results.$.game,
            group: jsonData.results.$.group,
            period: jsonData.results.$.period,
        },
        warehouseStock: jsonData.results.warehousestock.article.map((article: any): WarehouseStock => ({
            id: Number(article.$.id),
            amount: Number(article.$.amount),
            startAmount: Number(article.$.startamount),
            pct: article.$.pct,
            price: parseFloat(article.$.price),
            stockValue: parseFloat(article.$.stockvalue),
        })),
        inwardStockMovement: jsonData.results.inwardstockmovement.order.map((order: any): InwardStockMovementOrder => ({
            orderPeriod: Number(order.$.orderperiod),
            id: Number(order.$.id),
            mode: Number(order.$.mode),
            article: Number(order.$.article),
            amount: Number(order.$.amount),
            time: Number(order.$.time),
            materialCosts: parseFloat(order.$.materialcosts),
            orderCosts: parseFloat(order.$.ordercosts),
            entireCosts: parseFloat(order.$.entirecosts),
            pieceCosts: parseFloat(order.$.piececosts),
        })),
        futureInwardStockMovement: jsonData.results.futureinwardstockmovement.order.map((order: any): FutureInwardStockMovementOrder => ({
            orderPeriod: Number(order.$.orderperiod),
            id: Number(order.$.id),
            mode: Number(order.$.mode),
            article: Number(order.$.article),
            amount: Number(order.$.amount),
        })),
        idleTimeCosts: jsonData.results.idletimecosts.workplace.map((workplace: any): IdleTimeCost => ({
            id: Number(workplace.$.id),
            setupEvents: Number(workplace.$.setupevents),
            idleTime: Number(workplace.$.idletime),
            wageIdleTimeCosts: parseFloat(workplace.$.wageidletimecosts),
            wageCosts: parseFloat(workplace.$.wagecosts),
            machineIdleTimeCosts: parseFloat(workplace.$.machineidletimecosts),
        })),
        waitingListWorkstations: jsonData.results.waitinglistworkstations.workplace.map((workplace: any): WaitingListWorkstation => ({
            id: Number(workplace.$.id),
            timeNeed: Number(workplace.$.timeneed),
            waitingList: workplace.waitinglist ? (Array.isArray(workplace.waitinglist) ? workplace.waitinglist : [workplace.waitinglist]).map((wait: any) => ({
                period: Number(wait.$.period),
                order: Number(wait.$.order),
                firstBatch: Number(wait.$.firstbatch),
                lastBatch: Number(wait.$.lastbatch),
                item: Number(wait.$.item),
                amount: Number(wait.$.amount),
                timeNeed: Number(wait.$.timeneed),
            })) : undefined,
        })),
        waitingListStock: jsonData.results.waitingliststock.missingpart.map((part: any): MissingPart => ({
            id: Number(part.$.id),
            waitingList: Array.isArray(part.waitinglist) ? part.waitinglist.map((wait: any) => ({
                period: Number(wait.$.period),
                order: Number(wait.$.order),
                firstBatch: Number(wait.$.firstbatch),
                lastBatch: Number(wait.$.lastbatch),
                item: Number(wait.$.item),
                amount: Number(wait.$.amount),
            })) : [],
        })),
        ordersInWork: jsonData.results.ordersinwork.workplace.map((workplace: any): OrderInWork => ({
            id: Number(workplace.$.id),
            period: Number(workplace.$.period),
            order: Number(workplace.$.order),
            batch: Number(workplace.$.batch),
            item: Number(workplace.$.item),
            amount: Number(workplace.$.amount),
            timeNeed: Number(workplace.$.timeneed),
        })),
        completedOrders: jsonData.results.completedorders.order.map((order: any): CompletedOrder => ({
            period: Number(order.$.period),
            id: Number(order.$.id),
            item: Number(order.$.item),
            quantity: Number(order.$.quantity),
            cost: parseFloat(order.$.cost),
            averageUnitCosts: parseFloat(order.$.averageunitcosts),
            batches: Array.isArray(order.batch) ? order.batch.map((batch: any): CompletedOrderBatch => ({
                id: Number(batch.$.id),
                amount: Number(batch.$.amount),
                cycleTime: Number(batch.$.cycletime),
                cost: parseFloat(batch.$.cost),
            })) : [],
        })),
        cycleTimes: {
            startedOrders: Number(jsonData.results.cycletimes.$.startedorders),
            waitingOrders: Number(jsonData.results.cycletimes.$.waitingorders),
            orders: jsonData.results.cycletimes.order.map((order: any): CycleTimeOrder => ({
                id: Number(order.$.id),
                period: Number(order.$.period),
                startTime: order.$.starttime,
                finishTime: order.$.finishtime,
                cycleTimeMin: Number(order.$.cycletimemin),
                cycleTimeFactor: parseFloat(order.$.cycletimefactor),
            })),
        },
        result: {
            general: {
                capacity: jsonData.results.result.general.capacity.$,
                possibleCapacity: jsonData.results.result.general.possiblecapacity.$,
                relPossibleNormalCapacity: jsonData.results.result.general.relpossiblenormalcapacity.$,
                productiveTime: jsonData.results.result.general.productivetime.$,
                efficiency: jsonData.results.result.general.effiency.$, //Why does this have a typo???!!!
                sellwish: jsonData.results.result.general.sellwish.$,
                salesQuantity: jsonData.results.result.general.salesquantity.$,
                deliveryReliability: jsonData.results.result.general.deliveryreliability.$,
                idleTime: jsonData.results.result.general.idletime.$,
                idleTimeCosts: jsonData.results.result.general.idletimecosts.$,
                storeValue: jsonData.results.result.general.storevalue.$,
                storageCosts: jsonData.results.result.general.storagecosts.$
            },
            defectiveGoods: {
                quantity: jsonData.results.result.defectivegoods.quantity.$,
                costs: jsonData.results.result.defectivegoods.costs.$
            },
            normalSale: {
                salesPrice: jsonData.results.result.normalsale.salesprice.$,
                profit: jsonData.results.result.normalsale.profit.$,
                profitPerUnit: jsonData.results.result.normalsale.profitperunit.$
            },
            directSale: {
                profit: jsonData.results.result.directsale.profit.$,
                contractPenalty: jsonData.results.result.directsale.contractpenalty.$
            },
            marketplaceSale: {
                profit: jsonData.results.result.marketplacesale.profit.$
            },
            summary: {
                profit: jsonData.results.result.summary.profit.$
            }
          }
      };
      dataSet.input = input;
      this.loadedData = dataSet;
    }
    catch (error) {
      this.mappingError = true;
      this.uploadBtnState = ClrLoadingState.ERROR;
      return;
    }

    this.mappingSuccess = true;
    this.uploadBtnState = ClrLoadingState.SUCCESS;
  }
}
