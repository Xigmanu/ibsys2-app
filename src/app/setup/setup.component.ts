import { Component, OnInit } from '@angular/core';
import { parseString } from 'xml2js';
import { FormControl, FormGroup } from '@angular/forms';
import { JsonPipe, CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule, ClrLoadingState } from '@clr/angular';
import { RouterOutlet, RouterModule } from '@angular/router';
import {
  DataStructure,
  Input,
  WarehouseStock,
  InwardStockMovementOrder,
  FutureInwardStockMovementOrder,
  IdleTimeCost,
  WaitingListWorkstation,
  MissingPart,
  OrderInWork,
  CompletedOrder,
  CompletedOrderBatch,
  CycleTimeOrder,
} from '../data.service';
import { DataService } from '../data.service';
import { TranslateModule } from '@ngx-translate/core';
import { GlobalStateService } from '../shared/global-state.service';

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
    TranslateModule,
  ],
  templateUrl: './setup.component.html',
  styleUrl: './setup.component.css',
})
export class SetupComponent implements OnInit {
  constructor(
    private dataService: DataService,
    public globalState: GlobalStateService
  ) {}

  data: DataStructure = {
    input: {
      metaData: {
        game: '',
        group: '',
        period: '',
        forecast: {
          p1: 0,
          p2: 0,
          p3: 0,
        },
      },
      warehouseStock: [],
      inwardStockMovement: [],
      futureInwardStockMovement: [],
      idleTimeCosts: [],
      waitingListWorkstations: [],
      waitingListStock: [],
      ordersInWork: [],
      completedOrders: [],
      cycleTimes: { startedOrders: 0, waitingOrders: 0, orders: [] },
      result: {
        general: {
          capacity: { current: 0, average: 0, all: 0 },
          possibleCapacity: { current: 0, average: 0, all: 0 },
          relPossibleNormalCapacity: { current: 0, average: 0, all: 0 },
          productiveTime: { current: 0, average: 0, all: 0 },
          efficiency: { current: 0, average: 0, all: 0 },
          sellwish: { current: 0, average: 0, all: 0 },
          salesQuantity: { current: 0, average: 0, all: 0 },
          deliveryReliability: { current: 0, average: 0, all: 0 },
          idleTime: { current: 0, average: 0, all: 0 },
          idleTimeCosts: { current: 0, average: 0, all: 0 },
          storeValue: { current: 0, average: 0, all: 0 },
          storageCosts: { current: 0, average: 0, all: 0 },
        },
        defectiveGoods: {
          quantity: { current: 0, average: 0, all: 0 },
          costs: { current: 0, average: 0, all: 0 },
        },
        normalSale: {
          salesPrice: { current: 0, average: 0, all: 0 },
          profit: { current: 0, average: 0, all: 0 },
          profitPerUnit: { current: 0, average: 0, all: 0 },
        },
        directSale: {
          profit: { current: 0, average: 0, all: 0 },
          contractPenalty: { current: 0, average: 0, all: 0 },
        },
        marketplaceSale: {
          profit: { current: 0, average: 0, all: 0 },
        },
        summary: {
          profit: { current: 0, average: 0, all: 0 },
        },
      },
    },
    output: {
      qualityControl: { type: '', loseQuantity: 0, delay: 0 },
      sellWish: { items: [] },
      sellDirect: { items: [] },
      orderList: { orders: [] },
      productionList: { productions: [] },
      workingTimeList: { workingTimes: [] },
    },
    disposition: {
      p1: [],
      p2: [],
      p3: [],
    },
    decisions: {
      production: {
        period2: {
          p1: 0,
          p2: 0,
          p3: 0,
        },
        period3: {
          p1: 0,
          p2: 0,
          p3: 0,
        },
        period4: {
          p1: 0,
          p2: 0,
          p3: 0,
        },
      },
      forecast: {
        period2: {
          p1: 0,
          p2: 0,
          p3: 0,
        },
        period3: {
          p1: 0,
          p2: 0,
          p3: 0,
        },
        period4: {
          p1: 0,
          p2: 0,
          p3: 0,
        },
      },
    },
  };

  ngOnInit(): void {
    const data = this.dataService.getData();
    if (data) {
      this.data = data;
    } else {
      console.error('Data is null or not available.');
    }
  }

  uploadBtnState: ClrLoadingState = ClrLoadingState.DEFAULT;

  protected readonly form = new FormGroup({
    files: new FormControl<FileList | null>(null),
  });

  public jsonData: any;
  public loadedData: any;
  public mappingError: boolean = false;

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

  toFixedNumber(value: number, decimals: number) {
    return Number(Number(value).toFixed(decimals));
  }

  //Mapping work.
  mapXmlData(jsonData: any): void {
    this.uploadBtnState = ClrLoadingState.LOADING;
    var dataSet: DataStructure = this.dataService.getData();
    this.mappingError = false;
    this.globalState.dataInitialized = false;

    console.log(jsonData);

    try {
      var input: Input = {
        metaData: {
          game: jsonData.results.$.game,
          group: jsonData.results.$.group,
          period: String(Number(jsonData.results.$.period) + 1),
          forecast: {
            p1: Number(jsonData.results.forecast.$.p1),
            p2: Number(jsonData.results.forecast.$.p2),
            p3: Number(jsonData.results.forecast.$.p3),
          },
        },
        warehouseStock: jsonData.results.warehousestock.article.map(
          (article: any): WarehouseStock => ({
            id: Number(article.$.id),
            amount: Number(article.$.amount),
            startAmount: Number(article.$.startamount),
            pct: article.$.pct,
            price: parseFloat(article.$.price),
            stockValue: parseFloat(article.$.stockvalue),
          })
        ),
        inwardStockMovement: jsonData.results.inwardstockmovement.order.map(
          (order: any): InwardStockMovementOrder => ({
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
          })
        ),
        futureInwardStockMovement:
          jsonData.results.futureinwardstockmovement.order.map(
            (order: any): FutureInwardStockMovementOrder => ({
              orderPeriod: Number(order.$.orderperiod),
              id: Number(order.$.id),
              mode: Number(order.$.mode),
              article: Number(order.$.article),
              amount: Number(order.$.amount),
            })
          ),
        idleTimeCosts: jsonData.results.idletimecosts.workplace.map(
          (workplace: any): IdleTimeCost => ({
            id: Number(workplace.$.id),
            setupEvents: Number(workplace.$.setupevents),
            idleTime: Number(workplace.$.idletime),
            wageIdleTimeCosts: parseFloat(workplace.$.wageidletimecosts),
            wageCosts: parseFloat(workplace.$.wagecosts),
            machineIdleTimeCosts: parseFloat(workplace.$.machineidletimecosts),
          })
        ),
        waitingListWorkstations: jsonData.results.waitinglistworkstations
          ?.workplace
          ? jsonData.results.waitinglistworkstations.workplace.map(
              (workplace: any): WaitingListWorkstation => ({
                id: Number(workplace.$.id),
                timeNeed: Number(workplace.$.timeneed),
                waitingList: workplace.waitinglist
                  ? Array.isArray(workplace.waitinglist)
                    ? workplace.waitinglist
                        .map((wait: any) =>
                          wait.$
                            ? {
                                period: Number(wait.$.period || 0),
                                order: Number(wait.$.order || 0),
                                firstBatch: Number(wait.$.firstbatch || 0),
                                lastBatch: Number(wait.$.lastbatch || 0),
                                item: Number(wait.$.item || 0),
                                amount: Number(wait.$.amount || 0),
                                timeNeed: Number(wait.$.timeneed || 0),
                              }
                            : null
                        )
                        .filter(Boolean) // Filter out null entries
                    : workplace.waitinglist.$
                    ? [
                        {
                          period: Number(workplace.waitinglist.$.period || 0),
                          order: Number(workplace.waitinglist.$.order || 0),
                          firstBatch: Number(
                            workplace.waitinglist.$.firstbatch || 0
                          ),
                          lastBatch: Number(
                            workplace.waitinglist.$.lastbatch || 0
                          ),
                          item: Number(workplace.waitinglist.$.item || 0),
                          amount: Number(workplace.waitinglist.$.amount || 0),
                          timeNeed: Number(
                            workplace.waitinglist.$.timeneed || 0
                          ),
                        },
                      ]
                    : []
                  : [], // Default to an empty array if waitinglist is missing
              })
            )
          : [], // Default to an empty array if waitinglistworkstations is missing
        waitingListStock: jsonData.results.waitingliststock?.missingpart
          ? jsonData.results.waitingliststock.missingpart.map(
              (part: any): MissingPart => ({
                id: Number(part.$.id),
                workplace: part.workplace
                  ? [
                      {
                        id: Number(part.workplace.$.id),
                        timeneed: Number(part.workplace.$.timeneed),
                        waitingList: part.workplace.waitinglist
                          ? Array.isArray(part.workplace.waitinglist)
                            ? part.workplace.waitinglist
                                .map((wait: any) =>
                                  wait.$
                                    ? {
                                        period: Number(wait.$.period || 0),
                                        order: Number(wait.$.order || 0),
                                        firstBatch: Number(
                                          wait.$.firstbatch || 0
                                        ),
                                        lastBatch: Number(
                                          wait.$.lastbatch || 0
                                        ),
                                        item: Number(wait.$.item || 0),
                                        amount: Number(wait.$.amount || 0),
                                        timeNeed: Number(wait.$.timeNeed || 0),
                                      }
                                    : null
                                )
                                .filter(Boolean) // Remove null entries
                            : part.workplace.waitinglist.$
                            ? [
                                {
                                  period: Number(
                                    part.workplace.waitinglist.$.period || 0
                                  ),
                                  order: Number(
                                    part.workplace.waitinglist.$.order || 0
                                  ),
                                  firstBatch: Number(
                                    part.workplace.waitinglist.$.firstbatch || 0
                                  ),
                                  lastBatch: Number(
                                    part.workplace.waitinglist.$.lastbatch || 0
                                  ),
                                  item: Number(
                                    part.workplace.waitinglist.$.item || 0
                                  ),
                                  amount: Number(
                                    part.workplace.waitinglist.$.amount || 0
                                  ),
                                  timeNeed: Number(
                                    part.workplace.waitinglist.$.timeNeed || 0
                                  ),
                                },
                              ]
                            : []
                          : [], // Default to an empty array if waitinglist is missing
                      },
                    ]
                  : [], // Default to an empty array if workplace is missing
              })
            )
          : [], // Default to an empty array if waitingliststock is missing
        ordersInWork: (jsonData.results.ordersinwork?.workplace || []).map(
          (workplace: any): OrderInWork => ({
            id: Number(workplace.$.id || 0),
            period: Number(workplace.$.period || 0),
            order: Number(workplace.$.order || 0),
            batch: Number(workplace.$.batch || 0),
            item: Number(workplace.$.item || 0),
            amount: Number(workplace.$.amount || 0),
            timeNeed: Number(workplace.$.timeneed || 0),
          })
        ),
        completedOrders: jsonData.results.completedorders.order.map(
          (order: any): CompletedOrder => ({
            period: Number(order.$.period),
            id: Number(order.$.id),
            item: Number(order.$.item),
            quantity: Number(order.$.quantity),
            cost: parseFloat(order.$.cost),
            averageUnitCosts: parseFloat(order.$.averageunitcosts),
            batches: Array.isArray(order.batch)
              ? order.batch.map(
                  (batch: any): CompletedOrderBatch => ({
                    id: Number(batch.$.id),
                    amount: Number(batch.$.amount),
                    cycleTime: Number(batch.$.cycletime),
                    cost: parseFloat(batch.$.cost),
                  })
                )
              : [],
          })
        ),
        cycleTimes: {
          startedOrders: Number(jsonData.results.cycletimes.$.startedorders),
          waitingOrders: Number(jsonData.results.cycletimes.$.waitingorders),
          orders: jsonData.results.cycletimes.order.map(
            (order: any): CycleTimeOrder => ({
              id: Number(order.$.id),
              period: Number(order.$.period),
              startTime: order.$.starttime,
              finishTime: order.$.finishtime,
              cycleTimeMin: Number(order.$.cycletimemin),
              cycleTimeFactor: parseFloat(order.$.cycletimefactor),
            })
          ),
        },
        result: {
          general: {
            capacity: {
              current: Number(
                jsonData.results.result.general.capacity.$.current
              ),
              average: Number(
                jsonData.results.result.general.capacity.$.average
              ),
              all: Number(jsonData.results.result.general.capacity.$.all),
            },
            possibleCapacity: {
              current: Number(
                jsonData.results.result.general.possiblecapacity.$.current
              ),
              average: Number(
                jsonData.results.result.general.possiblecapacity.$.average
              ),
              all: Number(
                jsonData.results.result.general.possiblecapacity.$.all
              ),
            },
            relPossibleNormalCapacity: {
              current: this.toFixedNumber(
                Number(
                  jsonData.results.result.general.relpossiblenormalcapacity.$.current.replace(
                    '%',
                    ''
                  )
                ) / 100,
                4
              ),
              average: this.toFixedNumber(
                Number(
                  jsonData.results.result.general.relpossiblenormalcapacity.$.average.replace(
                    '%',
                    ''
                  )
                ) / 100,
                4
              ),
              all:
                jsonData.results.result.general.relpossiblenormalcapacity.$
                  .all === '-'
                  ? 0
                  : this.toFixedNumber(
                      Number(
                        jsonData.results.result.general.relpossiblenormalcapacity.$.all.replace(
                          '%',
                          ''
                        )
                      ) / 100,
                      4
                    ),
            },
            productiveTime: {
              current: Number(
                jsonData.results.result.general.productivetime.$.current
              ),
              average: Number(
                jsonData.results.result.general.productivetime.$.average
              ),
              all: Number(jsonData.results.result.general.productivetime.$.all),
            },
            efficiency: {
              current: this.toFixedNumber(
                Number(
                  jsonData.results.result.general.effiency.$.current.replace(
                    '%',
                    ''
                  )
                ) / 100,
                4
              ),
              average: this.toFixedNumber(
                Number(
                  jsonData.results.result.general.effiency.$.average.replace(
                    '%',
                    ''
                  )
                ) / 100,
                4
              ),
              all:
                jsonData.results.result.general.effiency.$.all === '-'
                  ? 0
                  : this.toFixedNumber(
                      Number(
                        jsonData.results.result.general.effiency.$.all.replace(
                          '%',
                          ''
                        )
                      ) / 100,
                      4
                    ),
            },
            sellwish: {
              current: Number(
                jsonData.results.result.general.sellwish.$.current
              ),
              average: Number(
                jsonData.results.result.general.sellwish.$.average
              ),
              all: Number(jsonData.results.result.general.sellwish.$.all),
            },
            salesQuantity: {
              current: Number(
                jsonData.results.result.general.salesquantity.$.current
              ),
              average: Number(
                jsonData.results.result.general.salesquantity.$.average
              ),
              all: Number(jsonData.results.result.general.salesquantity.$.all),
            },
            deliveryReliability: {
              current: this.toFixedNumber(
                Number(
                  jsonData.results.result.general.deliveryreliability.$.current.replace(
                    '%',
                    ''
                  )
                ) / 100,
                4
              ),
              average: this.toFixedNumber(
                Number(
                  jsonData.results.result.general.deliveryreliability.$.average.replace(
                    '%',
                    ''
                  )
                ) / 100,
                4
              ),
              all:
                jsonData.results.result.general.deliveryreliability.$.all ===
                '-'
                  ? 0
                  : this.toFixedNumber(
                      Number(
                        jsonData.results.result.general.deliveryreliability.$.all.replace(
                          '%',
                          ''
                        )
                      ) / 100,
                      4
                    ),
            },

            idleTime: {
              current: Number(
                jsonData.results.result.general.idletime.$.current
              ),
              average: Number(
                jsonData.results.result.general.idletime.$.average
              ),
              all: Number(jsonData.results.result.general.idletime.$.all),
            },
            idleTimeCosts: {
              current: Number(
                jsonData.results.result.general.idletimecosts.$.current
              ),
              average: Number(
                jsonData.results.result.general.idletimecosts.$.average
              ),
              all: Number(jsonData.results.result.general.idletimecosts.$.all),
            },
            storeValue: {
              current: Number(
                jsonData.results.result.general.storevalue.$.current
              ),
              average: Number(
                jsonData.results.result.general.storevalue.$.average
              ),
              all:
                jsonData.results.result.general.storevalue.$.all === '-'
                  ? 0
                  : Number(jsonData.results.result.general.storevalue.$.all),
            },
            storageCosts: {
              current: Number(
                jsonData.results.result.general.storagecosts.$.current
              ),
              average: Number(
                jsonData.results.result.general.storagecosts.$.average
              ),
              all: Number(jsonData.results.result.general.storagecosts.$.all),
            },
          },
          defectiveGoods: {
            quantity: {
              current: Number(
                jsonData.results.result.defectivegoods.quantity.$.current
              ),
              average: Number(
                jsonData.results.result.defectivegoods.quantity.$.average
              ),
              all: Number(
                jsonData.results.result.defectivegoods.quantity.$.all
              ),
            },
            costs: {
              current: Number(
                jsonData.results.result.defectivegoods.costs.$.current
              ),
              average: Number(
                jsonData.results.result.defectivegoods.costs.$.average
              ),
              all: Number(jsonData.results.result.defectivegoods.costs.$.all),
            },
          },
          normalSale: {
            salesPrice: {
              current: Number(
                jsonData.results.result.normalsale.salesprice.$.current
              ),
              average: Number(
                jsonData.results.result.normalsale.salesprice.$.average
              ),
              all:
                jsonData.results.result.normalsale.salesprice.$.all === '-'
                  ? 0
                  : Number(jsonData.results.result.normalsale.salesprice.$.all),
            },
            profit: {
              current: Number(
                jsonData.results.result.normalsale.profit.$.current
              ),
              average: Number(
                jsonData.results.result.normalsale.profit.$.average
              ),
              all: Number(jsonData.results.result.normalsale.profit.$.all),
            },
            profitPerUnit: {
              current: Number(
                jsonData.results.result.normalsale.profitperunit.$.current
              ),
              average: Number(
                jsonData.results.result.normalsale.profitperunit.$.average
              ),
              all:
                jsonData.results.result.normalsale.profitperunit.$.all === '-'
                  ? 0
                  : Number(
                      jsonData.results.result.normalsale.profitperunit.$.all
                    ),
            },
          },
          directSale: {
            profit: {
              current: Number(
                jsonData.results.result.directsale.profit.$.current
              ),
              average: Number(
                jsonData.results.result.directsale.profit.$.average
              ),
              all: Number(jsonData.results.result.directsale.profit.$.all),
            },
            contractPenalty: {
              current: Number(
                jsonData.results.result.directsale.contractpenalty.$.current
              ),
              average: Number(
                jsonData.results.result.directsale.contractpenalty.$.average
              ),
              all: Number(
                jsonData.results.result.directsale.contractpenalty.$.all
              ),
            },
          },
          marketplaceSale: {
            profit: {
              current: Number(
                jsonData.results.result.marketplacesale.profit.$.current
              ),
              average: Number(
                jsonData.results.result.marketplacesale.profit.$.average
              ),
              all: Number(jsonData.results.result.marketplacesale.profit.$.all),
            },
          },
          summary: {
            profit: {
              current: Number(jsonData.results.result.summary.profit.$.current),
              average: Number(jsonData.results.result.summary.profit.$.average),
              all: Number(jsonData.results.result.summary.profit.$.all),
            },
          },
        },
      };
      dataSet.input = input;
      this.dataService.initialSync();

      this.loadedData = dataSet;
    } catch (error) {
      console.error('Error while mapping data:', error);
      this.mappingError = true;
      this.uploadBtnState = ClrLoadingState.ERROR;
      return;
    }

    this.globalState.dataInitialized = true;
    this.uploadBtnState = ClrLoadingState.SUCCESS;
  }
}
