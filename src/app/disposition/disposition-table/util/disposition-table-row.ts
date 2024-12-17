import {
  DataStructure,
  DispoItem,
  Disposition,
  MissingPart,
  WaitingListWorkstation,
} from '../../../data.service';

const articleComponentMap: number[][][] = [
  [[1], [26, 51], [16, 17, 50], [4, 10, 49], [7, 13, 18]],
  [[2], [26, 56], [16, 17, 55], [5, 11, 54], [8, 14, 19]],
  [[3], [26, 31], [16, 17, 30], [6, 12, 29], [9, 15, 20]],
];
const primaryArticleIds: number[] = [1, 2, 3];
const commonComponentIds: number[] = [26, 16, 17];

export enum DispositionTableRowName {
  ARTICLE_ID = 'article_id',
  SALES_REQUEST = 'sales_request',
  HELPER_COL = 'helper_col', // is here just for consistency
  STOCK_SAFETY = 'stock_safety',
  STOCK_OLD = 'stock_old',
  ORDERS_QUEUED = 'orders_queued',
  ORDERS_ACTIVE = 'orders_active',
  ORDERS_PROD = 'orders_prod',
}

export interface DispositionTableRow {
  [DispositionTableRowName.ARTICLE_ID]: number;
  [DispositionTableRowName.SALES_REQUEST]: number;
  [DispositionTableRowName.STOCK_SAFETY]: number | undefined;
  [DispositionTableRowName.HELPER_COL]: number;
  [DispositionTableRowName.STOCK_OLD]: number;
  [DispositionTableRowName.ORDERS_QUEUED]: number;
  [DispositionTableRowName.ORDERS_ACTIVE]: number;
  [DispositionTableRowName.ORDERS_PROD]: number;
}

export function createDispositionTableRows(
  dataStruct: DataStructure,
  endProductId: number
): DispositionTableRow[] {
  const endProductIdx: number = endProductId - 1;

  const map: number[][] = articleComponentMap[endProductIdx];
  if (!map) {
    return [];
  }
  const initialRows: DispositionTableRow[] = map
    .reduce((merged, arr) => merged.concat(arr))
    .map((id) => createDispositionRow(dataStruct, id, endProductIdx));

  updateTableData(initialRows, map);
  return initialRows;
}

export function updateDispositionTableRows(rows: DispositionTableRow[]): void {
  const map: number[][] = articleComponentMap[getEndProductId(rows) - 1];
  if (map) {
    updateTableData(rows, map);
  }
}

export function getDispositionKey(
  endProductId: number
): keyof Disposition | undefined {
  return primaryArticleIds.find((id) => id === endProductId)
    ? (('p' + endProductId) as keyof Disposition)
    : undefined;
}

export function getEndProductId(rows: DispositionTableRow[]): number {
  return rows
    .map((row) => row[DispositionTableRowName.ARTICLE_ID])
    .find((articleId) => primaryArticleIds.includes(articleId))!;
}

export function isCommonArticle(articleId: number): boolean {
  return commonComponentIds.find((next) => next === articleId) ? true : false;
}

function updateTableData(rows: DispositionTableRow[], map: number[][]): void {
  let offset: number = 0;

  for (let i = 0; i < map.length; i++) {
    if (i == 0) {
      rows[i][DispositionTableRowName.ORDERS_PROD] = calculateProdOrderForRow(
        rows[i]
      );
      offset += map[i].length;
      continue;
    }

    const prevLastRow: DispositionTableRow = getRowById(
      rows,
      map[i - 1].at(-1)
    );
    for (let j = 0; j < map[i].length; j++) {
      const currentRow = rows[j + offset];
      currentRow[DispositionTableRowName.SALES_REQUEST] =
        prevLastRow[DispositionTableRowName.ORDERS_PROD];
      currentRow[DispositionTableRowName.HELPER_COL] =
        prevLastRow[DispositionTableRowName.ORDERS_QUEUED];

      currentRow[DispositionTableRowName.ORDERS_PROD] =
        calculateProdOrderForRow(currentRow);
    }
    offset += map[i].length;
  }
}

/**
 * Reads values from the passed struct for item/order id and constructs an initial table row.
 *
 * @param data Input data
 * @param articleId Current article id
 * @param endProductId Current end product id. I.e. P1-3.
 * @returns Row for a disposition table
 */
function createDispositionRow(
  data: DataStructure,
  articleId: number,
  endProductId: number
): DispositionTableRow {
  const sellWish = getSellWish(data, articleId);
  const oldStock =
    data.input.warehouseStock.find((stock) => stock.id == articleId)?.amount ??
    0;
  const queuedOrder = getQueuedOrderAmount(data, articleId);
  const activeOrder = getActiveOrderAmount(data, articleId);
  const safetyStock: number = getSafetyStock(data, articleId, endProductId);
  const isCommonId = commonComponentIds.find((next) => next === articleId);

  return {
    [DispositionTableRowName.ARTICLE_ID]: articleId,
    [DispositionTableRowName.SALES_REQUEST]: sellWish,
    [DispositionTableRowName.STOCK_SAFETY]: safetyStock,
    [DispositionTableRowName.HELPER_COL]: 0,
    [DispositionTableRowName.STOCK_OLD]: isCommonId
      ? Math.ceil(oldStock / 3)
      : oldStock,
    [DispositionTableRowName.ORDERS_QUEUED]: isCommonId
      ? Math.ceil(queuedOrder / 3)
      : queuedOrder,
    [DispositionTableRowName.ORDERS_ACTIVE]: isCommonId
      ? Math.ceil(activeOrder / 3)
      : activeOrder,
    [DispositionTableRowName.ORDERS_PROD]: 0,
  };
}

function getSellWish(data: DataStructure, articleId: number): number {
  if (primaryArticleIds.find((next) => next === articleId)) {
    return (
      data.output.sellWish.items.find((item) => item.article === articleId)
        ?.quantity ?? 0
    );
  }
  return 0;
}

function getQueuedOrderAmount(data: DataStructure, articleId: number): number {
  // Stores already processed batches mapped to an item id in order to avoid aggregating duplicates.
  let articleBatchCache = new Map<number, { first: number; last: number }[]>();

  const workstationSum: number = getWLWAggregateQueuedOrder(
    data.input.waitingListWorkstations,
    articleId,
    articleBatchCache
  );
  const waitingListStockSum: number = getWLSAggregatedQueuedOrder(
    data.input.waitingListStock,
    articleId,
    articleBatchCache
  );

  return workstationSum + waitingListStockSum;
}

/**
 * This function iterates over every waiting list in waitingListWorkstations and calculates
 * the sum of queued order amounts for an article.
 *
 * @param waitingListWs Waiting list workstations
 * @param articleId Current article id
 * @param articleBatchCache Batch cache
 * @returns Sum of queued orders for an article
 */
function getWLWAggregateQueuedOrder(
  waitingListWs: WaitingListWorkstation[],
  articleId: number,
  articleBatchCache: Map<number, { first: number; last: number }[]>
): number {
  return waitingListWs
    .map((workstation) =>
      workstation.waitingList
        ?.filter(
          (value) =>
            value.item === articleId &&
            !isArticleBatchCacheHit(value, articleBatchCache, articleId)
        )
        .map((value) => {
          const currentBatches = articleBatchCache.get(articleId);
          if (!currentBatches) {
            articleBatchCache.set(articleId, [
              { first: value.firstBatch, last: value.lastBatch },
            ]);
          } else {
            currentBatches.push({
              first: value.firstBatch,
              last: value.lastBatch,
            });
          }

          return value.amount ?? 0;
        })
        .reduce((sum, amount) => sum + amount, 0)
    )
    .map((value) => value ?? 0)
    .reduce((sum, amount) => sum + amount, 0);
}

/**
 * This function iterates over every waiting list in waitingListStock and calculates
 * the sum of queued order amounts for an article.
 *
 * @param missingParts Waiting list stock
 * @param articleId Current article id
 * @param articleBatchCache Batch cache
 * @returns Sum of queued orders for an article
 */
function getWLSAggregatedQueuedOrder(
  missingParts: MissingPart[],
  articleId: number,
  articleBatchCache: Map<number, { first: number; last: number }[]>
): number {
  return missingParts
    .map((missingPart) =>
      missingPart.workplace
        .map((entry) =>
          entry.waitingList
            .filter(
              (value) =>
                value.item === articleId &&
                !isArticleBatchCacheHit(value, articleBatchCache, articleId)
            )
            .map((value) => {
              const currentBatches = articleBatchCache.get(articleId);
              if (!currentBatches) {
                articleBatchCache.set(articleId, [
                  { first: value.firstBatch, last: value.lastBatch },
                ]);
              } else {
                currentBatches.push({
                  first: value.firstBatch,
                  last: value.lastBatch,
                });
              }

              return value.amount;
            })
            .reduce((sum, amount) => sum + amount, 0)
        )
        .reduce((sum, amount) => sum + amount, 0)
    )
    .reduce((sum, amount) => sum + amount, 0);
}

/**
 * Checks if first and last batches are present for a given articleId.
 *
 * @param value Next waiting list entry
 * @param batchMapArr Batch cache
 * @param articleId Current article id
 * @returns TRUE if first and last batches are already cached for an article, else FALSE
 */
function isArticleBatchCacheHit(
  value: {
    period: number;
    order: number;
    firstBatch: number;
    lastBatch: number;
    item: number;
    amount: number;
    timeNeed: number;
  },
  batchMapArr: Map<number, { first: number; last: number }[]>,
  articleId: number
): boolean {
  const batches = batchMapArr.get(articleId);
  const inBatch = { first: value.firstBatch, last: value.lastBatch };

  if (batches) {
    const batch = batches.find(
      (bat) => bat.first === value.firstBatch && bat.last === value.lastBatch
    );
    if (batch) {
      return true;
    }
    batches.push(inBatch);
    return false;
  }

  batchMapArr.set(articleId, [inBatch]);
  return false;
}

function getActiveOrderAmount(data: DataStructure, articleId: number): number {
  return data.input.ordersInWork
    .filter((value) => value.item === articleId)
    .map((value) => value.amount ?? 0)
    .reduce((sum, amount) => sum + amount, 0);
}

function getSafetyStock(
  struct: DataStructure,
  articleId: number,
  endProductId: number
): number {
  const dispositionKey: keyof Disposition = getDispositionKey(
    endProductId + 1
  )!;
  const oldDispositionItem: DispoItem | undefined = struct.disposition[
    dispositionKey
  ].find((item) => item.articleId === articleId.toString());
  return oldDispositionItem ? oldDispositionItem.safetyStock : 0;
}

function getRowById(
  rows: DispositionTableRow[],
  id: number
): DispositionTableRow {
  return rows.find((row) => row[DispositionTableRowName.ARTICLE_ID] == id)!;
}

function calculateProdOrderForRow(row: DispositionTableRow): number {
  const salesRequest: number = row[DispositionTableRowName.SALES_REQUEST];
  const stockSafety: number = row[DispositionTableRowName.STOCK_SAFETY] ?? 0;
  const stockOld: number = row[DispositionTableRowName.STOCK_OLD];
  const ordersQueued: number = row[DispositionTableRowName.ORDERS_QUEUED];
  const ordersActive: number = row[DispositionTableRowName.ORDERS_ACTIVE];
  const helperCol: number = row[DispositionTableRowName.HELPER_COL] ?? 0;

  const prodOrder =
    salesRequest +
    helperCol +
    stockSafety -
    stockOld -
    ordersQueued -
    ordersActive;

  return prodOrder < 0 ? 0 : prodOrder;
}
