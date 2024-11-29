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

    updateRowsData(initialRows)
   
    return initialRows;
}

export function updateRowsData(rows: DispositionTableRow[]): void {
    const map = articleComponentMap[getPrimaryArticleId(rows) - 1]
    if (!map) {
        return;
    }
    let a = 0
    for (let i = 0; i < map.length; i++) {
        if (i == 0) {
            calculateProdOrderForRow(rows[i]);
            a += map[i].length
            continue;
        }
        const lastProdOrder = getRowById(rows, map[i - 1].at(-1))
        for (let j = 0; j < map[i].length; j++) {
            rows[j + a][DispositionTableRowName.SALES_REQUEST] = lastProdOrder[DispositionTableRowName.ORDERS_PROD]
            calculateProdOrderForRow(rows[j + a], lastProdOrder[DispositionTableRowName.ORDERS_QUEUED])
        }
        a += map[i].length
    }

}

function getPrimaryArticleId(rows: DispositionTableRow[]): number {
    return rows.find(row => row[DispositionTableRowName.ARTICLE_ID] in primaryArticleIds)?.[DispositionTableRowName.ARTICLE_ID]!
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

    const isCommonId = commonComponentIds.find(next => next === id)
    return {
        [DispositionTableRowName.ARTICLE_ID]: id,
        [DispositionTableRowName.SALES_REQUEST]: sellWish,
        [DispositionTableRowName.STOCK_SAFETY]: 0,
        [DispositionTableRowName.STOCK_OLD]: (isCommonId) ? Math.trunc(oldStock / 3) : oldStock,
        [DispositionTableRowName.ORDERS_QUEUED]: (isCommonId) ? Math.trunc(queuedOrder / 3) : queuedOrder,
        [DispositionTableRowName.ORDERS_ACTIVE]: (isCommonId) ? Math.trunc(activeOrder / 3) : activeOrder,
        [DispositionTableRowName.ORDERS_PROD]: 0
    }
}

function getRowById(rows: DispositionTableRow[], id: number): DispositionTableRow {
    return rows.find(row => row[DispositionTableRowName.ARTICLE_ID] == id)!
}

function calculateProdOrderForRow(row: DispositionTableRow, prevWaitingListAmount: number | undefined = undefined) {
    const salesRequest = row[DispositionTableRowName.SALES_REQUEST];
    const stockSafety = row[DispositionTableRowName.STOCK_SAFETY] ?? 0;
    const stockOld = row[DispositionTableRowName.STOCK_OLD];
    const ordersQueued = row[DispositionTableRowName.ORDERS_QUEUED];
    const ordersActive = row[DispositionTableRowName.ORDERS_ACTIVE];

    const prodOrder = salesRequest + stockSafety - stockOld - ordersQueued - ordersActive + (prevWaitingListAmount ?? 0);

    row[DispositionTableRowName.ORDERS_PROD] = prodOrder < 0 ? 0 : prodOrder;
}