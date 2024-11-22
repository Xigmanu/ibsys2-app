import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/////////////////////////////////////////////////////////////////////////
//
// INTERFACES START
//
/////////////////////////////////////////////////////////////////////////

export interface QualityControl {
  type: string;
  loseQuantity: number;
  delay: number;
}

export interface SellWishItem {
  article: number;
  quantity: number;
}

export interface SellDirectItem {
  article: number;
  quantity: number;
  price: number;
  penalty: number;
}

export interface Order {
  article: number;
  quantity: number;
  modus: number;
}

export interface Production {
  article: number;
  quantity: number;
}

export interface WorkingTime {
  station: number;
  shift: number;
  overtime: number;
}

export interface Output {
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

export interface WarehouseStock {
  id: number;
  amount: number;
  startAmount: number;
  pct: string;
  price: number;
  stockValue: number;
}

export interface InwardStockMovementOrder {
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

export interface FutureInwardStockMovementOrder {
  orderPeriod: number;
  id: number;
  mode: number;
  article: number;
  amount: number;
}

export interface IdleTimeCost {
  id: number;
  setupEvents: number;
  idleTime: number;
  wageIdleTimeCosts: number;
  wageCosts: number;
  machineIdleTimeCosts: number;
}

export interface WaitingListWorkstation {
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

export interface MissingPart {
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

export interface OrderInWork {
  id: number;
  period: number;
  order: number;
  batch: number;
  item: number;
  amount: number;
  timeNeed: number;
}

export interface CompletedOrderBatch {
  id: number;
  amount: number;
  cycleTime: number;
  cost: number;
}

export interface CompletedOrder {
  period: number;
  id: number;
  item: number;
  quantity: number;
  cost: number;
  averageUnitCosts: number;
  batches: CompletedOrderBatch[];
}

export interface CycleTimeOrder {
  id: number;
  period: number;
  startTime: string;
  finishTime: string;
  cycleTimeMin: number;
  cycleTimeFactor: number;
}

export interface MetaData {
  game: string;
  group: string;
  period: string;
}

export interface Result {
  general: ResultGeneral;
  defectiveGoods: ResultDefectiveGoods;
  normalSale: ResultNormalSale;
  directSale: ResultDirectSale;
  marketplaceSale: ResultMarketplaceSale;
  summary: ResultSummary;
}

export interface ResultGeneral {
  capacity: {
    current: number;
    average: number;
    all: number;
  };
  possibleCapacity: {
    current: number;
    average: number;
    all: number;
  };
  relPossibleNormalCapacity: {
    //Needs to be converted from string to decimal!!
    current: number;
    average: number;
    all: number;
  };
  productiveTime: {
    current: number;
    average: number;
    all: number;
  };
  efficiency: {
    //Needs to be converted from string to decimal!!
    current: number;
    average: number;
    all: number;
  };
  sellwish: {
    current: number;
    average: number;
    all: number;
  };
  salesQuantity: {
    current: number;
    average: number;
    all: number;
  };
  deliveryReliability: {
    //Needs to be converted from string to decimal!!
    current: number;
    average: number;
    all: number;
  };
  idleTime: {
    current: number;
    average: number;
    all: number;
  };
  idleTimeCosts: {
    current: number;
    average: number;
    all: number;
  };
  storeValue: {
    current: number;
    average: number;
    all: number;
  };
  storageCosts: {
    current: number;
    average: number;
    all: number;
  };
}

export interface ResultDefectiveGoods {
  quantity: {
    current: number;
    average: number;
    all: number;
  };
  costs: {
    current: number;
    average: number;
    all: number;
  };
}

export interface ResultNormalSale {
  salesPrice: {
    current: number;
    average: number;
    all: number;
  };
  profit: {
    current: number;
    average: number;
    all: number;
  };
  profitPerUnit: {
    current: number;
    average: number;
    all: number;
  };
}

export interface ResultDirectSale {
  profit: {
    current: number;
    average: number;
    all: number;
  };
  contractPenalty: {
    current: number;
    average: number;
    all: number;
  };
}

export interface ResultMarketplaceSale {
  profit: {
    current: number;
    average: number;
    all: number;
  };
}

export interface ResultSummary {
  profit: {
    current: number;
    average: number;
    all: number;
  };
}

export interface Input {
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
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  private data: DataStructure = {
    input: {
      metaData: { game: '', group: '', period: '' },
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
  };

  setData(data: DataStructure): void {
    this.data = data;
  }

  getData(): DataStructure {
    return this.data;
  }

  generateSampleData(): void {
    this.http.get('/assets/debug/sample.json').subscribe((response: any) => {
      this.data = response;
      console.log('Sample data loaded.');
    });
  }
}
