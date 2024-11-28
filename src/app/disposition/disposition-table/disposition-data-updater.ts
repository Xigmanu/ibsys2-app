import { AbstractControl, FormArray } from "@angular/forms";
import { DispositionTableRow, DispositionTableRowName } from "./disposition-util";
import { DataStructure } from "../../data.service";

const articleComponentMap = [
    [[1], [26, 51], [16, 17, 50], [4, 10, 49], [7, 13, 18]],
    [[2], [26, 56], [16, 17, 55], [5, 11, 54], [8, 14, 19]],
    [[3], [26, 31], [16, 17, 30], [6, 12, 29], [9, 15, 20]],
];
const primaryArticleIds: number[] = [1, 2, 3];
const commonComponentIds: number[] = [26, 16, 17];

export function createTableRows(dataStruct: DataStructure, articleIdx: number): DispositionTableRow[] {
    const map = articleComponentMap[articleIdx]
    if (!map) {
        return [];
    }
    const initialRows = map.reduce((merged, arr) => merged.concat(arr)).map(id => getDataById(dataStruct, id))
    
}

/**
 * Reads values from the passed struct for item/order id and constructs an initial table row.
 */
function getDataById(struct: DataStructure, id: number): DispositionTableRow {
    const sellWish = (id in primaryArticleIds) ? struct.output.sellWish.items.find(item => item.article == id)?.quantity ?? 0: 0;
    const oldStock = struct.input.warehouseStock.find(stock => stock.id == id)?.amount ?? 0;
    const queuedOrder = struct.input.waitingListWorkstations
        .map(wlw => wlw.waitingList
            ?.filter(vl => vl.order == id)
            .map(order => order.amount ?? 0)
            .reduce((sum, amount) => sum + amount, 0))
        .map(value => value ?? 0)
        .reduce((sum, amount) => sum + amount, 0)
    const activeOrder = struct.input.ordersInWork
        .filter(order => order.order == id)
        .map(order => order.amount ?? 0)
        .reduce((sum, amount) => sum + amount, 0);
    
    return {
        [DispositionTableRowName.ARTICLE_ID]: id,
        [DispositionTableRowName.SALES_REQUEST]: sellWish,
        [DispositionTableRowName.STOCK_SAFETY]: 0,
        [DispositionTableRowName.STOCK_OLD]: (id in commonComponentIds) ? oldStock / 3 : oldStock,
        [DispositionTableRowName.ORDERS_QUEUED]: (id in commonComponentIds) ? queuedOrder * 3 : queuedOrder,
        [DispositionTableRowName.ORDERS_ACTIVE]: (id in commonComponentIds) ? activeOrder * 3 : activeOrder,
        [DispositionTableRowName.ORDERS_PROD]: 0
    }
}

function calculateProdOrderForRow(rowControl: AbstractControl<any, any>): number {
    const sellReq = rowControl.get(DispositionTableRowName.SALES_REQUEST)?.value;
    const stockSafety = rowControl.get(DispositionTableRowName.STOCK_SAFETY)?.value;
    const stockOld = rowControl.get(DispositionTableRowName.STOCK_OLD)?.value;
    const orderQueued = rowControl.get(DispositionTableRowName.ORDERS_QUEUED)?.value;
    const orderActive = rowControl.get(DispositionTableRowName.ORDERS_ACTIVE)?.value;

    const order = sellReq + stockSafety - stockOld - orderQueued - orderActive;
    return order < 0 ? 0 : order;
}