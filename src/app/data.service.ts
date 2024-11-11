import { Injectable } from '@angular/core';

/////////////////////////////////////////////////////////////////////////
//
// INTERFACES START
//
/////////////////////////////////////////////////////////////////////////

interface QualityControl {
  type: string;
  loseQuantity: number;
  delay: number;
}

interface SellWishItem {
  article: number;
  quantity: number;
}

interface SellDirectItem {
  article: number;
  quantity: number;
  price: number;
  penalty: number;
}

interface Order {
  article: number;
  quantity: number;
  modus: number;
}

interface Production {
  article: number;
  quantity: number;
}

interface WorkingTime {
  station: number;
  shift: number;
  overtime: number;
}

interface Output {
  qualityControl: QualityControl;
  sellWish: {
    items: SellWishItem[];
  };
  sellDirect: {
    items: SellDirectItem[];
  };
  orderList: {
    orders: Order[];
  };
  productionList: {
    productions: Production[];
  };
  workingTimeList: {
    workingTimes: WorkingTime[];
  };
}

interface WarehouseStock {
  id: number;
  amount: number;
  startAmount: number;
  pct: string;
  price: number;
  stockValue: number;
}

interface InwardStockMovementOrder {
  orderPeriod: number;
  id: number;
  mode: number;
  article: number;
  amount: number;
  time: number;
  materialCosts: number;
  orderCosts: number;
  entireCosts: number;
  pieceCosts: number;
}

interface FutureInwardStockMovementOrder {
  orderPeriod: number;
  id: number;
  mode: number;
  article: number;
  amount: number;
}

interface IdleTimeCost {
  id: number;
  setupEvents: number;
  idleTime: number;
  wageIdleTimeCosts: number;
  wageCosts: number;
  machineIdleTimeCosts: number;
}

interface WaitingListWorkstation {
  id: number;
  timeNeed: number;
  waitingList?: {
    period: number;
    order: number;
    firstBatch: number;
    lastBatch: number;
    item: number;
    amount: number;
    timeNeed: number;
  }[];
}

interface MissingPart {
  id: number;
  waitingList: {
    period: number;
    order: number;
    firstBatch: number;
    lastBatch: number;
    item: number;
    amount: number;
  }[];
}

interface OrderInWork {
  id: number;
  period: number;
  order: number;
  batch: number;
  item: number;
  amount: number;
  timeNeed: number;
}

interface CompletedOrderBatch {
  id: number;
  amount: number;
  cycleTime: number;
  cost: number;
}

interface CompletedOrder {
  period: number;
  id: number;
  item: number;
  quantity: number;
  cost: number;
  averageUnitCosts: number;
  batches: CompletedOrderBatch[];
}

interface CycleTimeOrder {
  id: number;
  period: number;
  startTime: string;
  finishTime: string;
  cycleTimeMin: number;
  cycleTimeFactor: number;
}

interface MetaData {
  game: string;
  group: string;
  period: string;
}

interface Result {
  general: ResultGeneral;
  defectiveGoods: ResultDefectiveGoods;
  normalSale: ResultNormalSale;
  directSale: ResultDirectSale;
  marketplaceSale: ResultMarketplaceSale;
  summary: ResultSummary;
}

interface ResultGeneral {
  capacity: {
      current: number;
      average: number;
      all: number;
  },
  possibleCapacity: {
      current: number;
      average: number;
      all: number;
  },
  relPossibleNormalCapacity: {//Needs to be converted from string to decimal!!
      current: number;
      average: number;
      all: number;
  },
  productiveTime: {
      current: number;
      average: number;
      all: number;
  },
  efficiency: {//Needs to be converted from string to decimal!!
      current: number; 
      average: number;
      all: number;
  },
  sellwish: {
      current: number;
      average: number;
      all: number;
  },
  salesQuantity: {
      current: number;
      average: number;
      all: number;
  },
  deliveryReliability: {//Needs to be converted from string to decimal!!
      current: number;
      average: number;
      all: number;
  },
  idleTime: {
      current: number;
      average: number;
      all: number;
  },
  idleTimeCosts: {
      current: number;
      average: number;
      all: number;
  },
  storeValue: {
      current: number;
      average: number;
      all: number;
  },
  storageCosts: {
      current: number;
      average: number;
      all: number;
  },
}

interface ResultDefectiveGoods {
  quantity: {
      current: number;
      average: number;
      all: number;
  },
  costs: {
      current: number;
      average: number;
      all: number;
  },
}

interface ResultNormalSale {
  salesPrice: {
      current: number;
      average: number;
      all: number;
  },
  profit: {
      current: number;
      average: number;
      all: number;
  },
  profitPerUnit: {
      current: number;
      average: number;
      all: number;
  },
}

interface ResultDirectSale {
  profit: {
      current: number;
      average: number;
      all: number;
  },
  contractPenalty: {
      current: number;
      average: number;
      all: number;
  },
}

interface ResultMarketplaceSale {
  profit: {
      current: number;
      average: number;
      all: number;
  },
}

interface ResultSummary {
  profit: {
      current: number;
      average: number;
      all: number;
  },
}

interface Input {
  metaData: MetaData;
  warehouseStock: WarehouseStock[];
  inwardStockMovement: InwardStockMovementOrder[];
  futureInwardStockMovement: FutureInwardStockMovementOrder[];
  idleTimeCosts: IdleTimeCost[];
  waitingListWorkstations: WaitingListWorkstation[];
  waitingListStock: MissingPart[];
  ordersInWork: OrderInWork[];
  completedOrders: CompletedOrder[];
  cycleTimes: {
    startedOrders: number;
    waitingOrders: number;
    orders: CycleTimeOrder[];
  };
  result: Result;
}

export interface DataStructure {
  input: Input;
  output: Output;
}

/////////////////////////////////////////////////////////////////////////
//
// INTERFACES END
//
/////////////////////////////////////////////////////////////////////////

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private data: DataStructure | null = null;

  setData(data: DataStructure): void {
    this.data = data;
  }

  getData(): DataStructure | null {
    return this.data;
  }

  generateSampleData(): void {
    this.data = {
      "input": {
        "metaData": {
          "game": "179",
          "group": "7",
          "period": "6"
        },
        "warehouseStock": [
          {
            "id": 1,
            "amount": 120,
            "startAmount": 100,
            "pct": "120.00",
            "price": 754.02,
            "stockValue": 90482.05
          }
        ],
        "inwardStockMovement": [
          {
            "orderPeriod": 5,
            "id": 7,
            "mode": 5,
            "article": 41,
            "amount": 900,
            "time": 37440,
            "materialCosts": 48.6,
            "orderCosts": 50.0,
            "entireCosts": 98.6,
            "pieceCosts": 0.11
          }
        ],
        "futureInwardStockMovement": [
          {
            "orderPeriod": 5,
            "id": 9,
            "mode": 5,
            "article": 45,
            "amount": 900
          }
        ],
        "idleTimeCosts": [
          {
            "id": 1,
            "setupEvents": 2,
            "idleTime": 1500,
            "wageIdleTimeCosts": 940.5,
            "wageCosts": 1093.5,
            "machineIdleTimeCosts": 15.0
          }
        ],
        "waitingListWorkstations": [
          {
            "id": 2,
            "timeNeed": 350,
            "waitingList": [
              {
                "period": 6,
                "order": 23,
                "firstBatch": 19,
                "lastBatch": 25,
                "item": 55,
                "amount": 70,
                "timeNeed": 350
              }
            ]
          }
        ],
        "waitingListStock": [
          {
            "id": 14,
            "waitingList": [
              {
                "period": 6,
                "order": 20,
                "firstBatch": 11,
                "lastBatch": 23,
                "item": 54,
                "amount": 130
              }
            ]
          }
        ],
        "ordersInWork": [
          {
            "id": 2,
            "period": 6,
            "order": 23,
            "batch": 18,
            "item": 55,
            "amount": 10,
            "timeNeed": 12
          }
        ],
        "completedOrders": [
          {
            "period": 5,
            "id": 5,
            "item": 8,
            "quantity": 100,
            "cost": 2723.82,
            "averageUnitCosts": 27.24,
            "batches": [
              {
                "id": 13,
                "amount": 10,
                "cycleTime": 1336,
                "cost": 343.63
              }
            ]
          }
        ],
        "cycleTimes": {
          "startedOrders": 11,
          "waitingOrders": 9,
          "orders": [
            {
              "id": 13,
              "period": 5,
              "startTime": "5-4-5-40",
              "finishTime": "6-1-2-45",
              "cycleTimeMin": 440,
              "cycleTimeFactor": 6.15
            }
          ]
        },
        "result": {
          "general": {
            "capacity": {
              "current": 100,
              "average": 95,
              "all": 110
            },
            "possibleCapacity": {
              "current": 100,
              "average": 90,
              "all": 120
            },
            "relPossibleNormalCapacity": {
              "current": 0.95,
              "average": 0.90,
              "all": 0.98
            },
            "productiveTime": {
              "current": 80,
              "average": 75,
              "all": 85
            },
            "efficiency": {
              "current": 0.85,
              "average": 0.8,
              "all": 0.9
            },
            "sellwish": {
              "current": 500,
              "average": 450,
              "all": 550
            },
            "salesQuantity": {
              "current": 450,
              "average": 400,
              "all": 480
            },
            "deliveryReliability": {
              "current": 0.9,
              "average": 0.85,
              "all": 0.95
            },
            "idleTime": {
              "current": 20,
              "average": 15,
              "all": 25
            },
            "idleTimeCosts": {
              "current": 200,
              "average": 180,
              "all": 220
            },
            "storeValue": {
              "current": 5000,
              "average": 4500,
              "all": 5500
            },
            "storageCosts": {
              "current": 50,
              "average": 45,
              "all": 55
            }
          },
          "defectiveGoods": {
            "quantity": {
              "current": 5,
              "average": 4,
              "all": 6
            },
            "costs": {
              "current": 100,
              "average": 90,
              "all": 110
            }
          },
          "normalSale": {
            "salesPrice": {
              "current": 1000,
              "average": 950,
              "all": 1100
            },
            "profit": {
              "current": 500,
              "average": 450,
              "all": 550
            },
            "profitPerUnit": {
              "current": 5,
              "average": 4.5,
              "all": 5.5
            }
          },
          "directSale": {
            "profit": {
              "current": 400,
              "average": 350,
              "all": 450
            },
            "contractPenalty": {
              "current": 50,
              "average": 45,
              "all": 55
            }
          },
          "marketplaceSale": {
            "profit": {
              "current": 300,
              "average": 280,
              "all": 320
            }
          },
          "summary": {
            "profit": {
              "current": 800,
              "average": 750,
              "all": 850
            }
          }
        }
      },
      "output": {
        "qualityControl": {
          "type": "Standard",
          "loseQuantity": 5,
          "delay": 2
        },
        "sellWish": {
          "items": [
            {
              "article": 1,
              "quantity": 100
            },
            {
              "article": 2,
              "quantity": 150
            }
          ]
        },
        "sellDirect": {
          "items": [
            {
              "article": 1,
              "quantity": 50,
              "price": 100.5,
              "penalty": 5.0
            }
          ]
        },
        "orderList": {
          "orders": [
            {
              "article": 21,
              "quantity": 200,
              "modus": 5
            }
          ]
        },
        "productionList": {
          "productions": [
            {
              "article": 4,
              "quantity": 300
            }
          ]
        },
        "workingTimeList": {
          "workingTimes": [
            {
              "station": 1,
              "shift": 1,
              "overtime": 120
            }
          ]
        }
      }
    }
  }
}
