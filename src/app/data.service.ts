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
  forecast: Forecast;
}

export interface Forecast {
  p1: number;
  p2: number;
  p3: number;
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

export interface Disposition {
  p1: DispoItem[];
  p2: DispoItem[];
  p3: DispoItem[];
}

export interface DispoItem {
  articleId: string;
  safetyStock: number;
}

export interface ForecastInput {
  period2: ProductionValues,
  period3: ProductionValues,
  period4: ProductionValues
}

export interface ProductionInput {
  period2: ProductionValues,
  period3: ProductionValues,
  period4: ProductionValues
}

export interface ProductionValues {
  p1: number,
  p2: number,
  p3: number,
}

export interface DataStructure {
  input: Input;
  output: Output;
  disposition: Disposition;
  decisions: {
    production: ProductionInput
    forecast: ForecastInput;
  }
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
      metaData: { game: '', group: '', period: '',
        forecast: {
          p1: 0,
          p2: 0,
          p3: 0,
        }
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
        }
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
        }
      },
    }
  };

  setData(data: DataStructure): void {
    this.data = data;
  }

  getData(): DataStructure {
    return this.data;
  }

  deepMerge(target: any, source: any): any {
    for (const key of Object.keys(source)) {
      if (
        source[key] &&
        typeof source[key] === 'object' &&
        !Array.isArray(source[key])
      ) {
        if (!target[key] || typeof target[key] !== 'object') {
          target[key] = {};
        }
        this.deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
    return target;
  }


  generateInputSampleData(): void {
    this.http.get('/assets/debug/sample_input.json').subscribe((response: any) => {
      this.deepMerge(this.data, response);
      this.initialSync();
      console.log('Sample data loaded.');
    });
  }

  //Loads data from Input over to other areas. Only use during initialization!!
  initialSync(): void {
    this.data.output.sellWish.items = [
      {
        article: 1,
        quantity: this.data.input.metaData.forecast.p1,
      },
      {
        article: 2,
        quantity: this.data.input.metaData.forecast.p2,
      },
      {
        article: 3,
        quantity: this.data.input.metaData.forecast.p3,
      },
    ];
  }

  generateOutputSampleData(): void {
    this.http.get('/assets/debug/sample_output.json').subscribe((response: any) => {
      this.deepMerge(this.data, response);
      console.log('Sample data loaded.');
    });
  }

  getDispoStock(production: keyof Disposition, article: string): DispoItem {
    const list = this.data.disposition[production];

    for (const entry of list) {
      if (entry.articleId === article) {
        return entry;
      }
    }

    return {
      articleId: 'ERROR',
      safetyStock: 0,
    };
  }

  getDispoAllStock(production: keyof Disposition): DispoItem[] {
    return this.data.disposition[production];
  }

  getProductionListArticle(articleId: number): number{
    let output = 0;
    if(this.data.output.productionList.productions.length === 0) {
      return output;
    }
    for ( var item of this.data.output.productionList.productions ) {
      if (item.article == articleId) {
        output += item.quantity;
      }
    }
    return output;
  }
  getDecisionProduction(articleId:number){
    let output = 0;
    return this.data.decisions.production;
  }

  // Destructive function. Forces a merge of the article orders and places the new summarized order at first known position or at the end.
  // Use this when setting a new order.
  setProductionListArticle(articleId: number, quantity: number): void{
    //Erase previous entries for this article.
    let position = -1;
    for ( let i = 0; i < this.data.output.productionList.productions.length; i++ ) {
      var item: Production = this.data.output.productionList.productions[i];
      if (item.article == articleId) {
        position = i;
        this.data.output.productionList.productions.splice(position, 1);
      }
    }
    //Insert new Element at start
    let newItem: Production = {
      article: articleId,
      quantity: quantity,
    }
    if (position > -1) {
      this.data.output.productionList.productions.splice(position, 0, newItem);
    }
    else {
      this.data.output.productionList.productions.push(newItem);
    }

  }

  //Simply adds a new production order at the end of the array.
  addProductionListArticle(articleId: number, quantity: number): void{
    //Insert new Element
    let newItem: Production = {
      article: articleId,
      quantity: quantity,
    }
    this.data.output.productionList.productions.push(newItem)
  }

  mergeProductionListArticles(index: number): void {
    const productions = this.data.output.productionList.productions;
  
    if (index < 0 || index >= productions.length) {
      return;
    }
  
    const currentProduction = productions[index];
    const targetArticle = currentProduction.article;
    let totalQuantity = 0;
    
    // Calculate total quantity and find indices to remove
    const indicesToRemove: number[] = [];
    for (let i = 0; i < productions.length; i++) {
      if (productions[i].article === targetArticle) {
        totalQuantity += productions[i].quantity;
        if (i !== index) {
          indicesToRemove.push(i);
        }
      }
    }
    
    // Calculate how many elements before our target index will be removed
    const shiftsBeforeTarget = indicesToRemove.filter(i => i < index).length;
    
    // Remove from highest index to lowest
    for (let i = indicesToRemove.length - 1; i >= 0; i--) {
      productions.splice(indicesToRemove[i], 1);
    }
    
    // Update quantity at adjusted position
    const adjustedIndex = index - shiftsBeforeTarget;
    productions[adjustedIndex].quantity = totalQuantity;
}

  splitProductionListArticle(index: number, splitQuantity: number): void {
    const productions = this.data.output.productionList.productions;
  
    if (index < 0 || index >= productions.length) {
      return; 
    }
  
    const production = productions[index];
    const originalQuantity = production.quantity;
  
    if (splitQuantity <= 0 || splitQuantity >= originalQuantity) {
      return;
    }
  
    production.quantity = splitQuantity;
  
    const remainingQuantity = originalQuantity - splitQuantity;
    const newProduction: Production = {
      article: production.article,
      quantity: remainingQuantity,
    };
  
    productions.splice(index + 1, 0, newProduction);
  }
}
