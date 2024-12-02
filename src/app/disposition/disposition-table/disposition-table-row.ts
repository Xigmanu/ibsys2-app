import { DataStructure } from '../../data.service';
import { FormBuilder, FormGroup } from '@angular/forms';

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
  [DispositionTableRowName.STOCK_OLD]: number;
  [DispositionTableRowName.ORDERS_QUEUED]: number;
  [DispositionTableRowName.ORDERS_ACTIVE]: number;
  [DispositionTableRowName.ORDERS_PROD]: number;
}

export function createFormGroupFromRow(
  fb: FormBuilder,
  row: DispositionTableRow
): FormGroup {
  return fb.group({
    [DispositionTableRowName.ARTICLE_ID]: [
      row[DispositionTableRowName.ARTICLE_ID],
    ],
    [DispositionTableRowName.SALES_REQUEST]: [
      row[DispositionTableRowName.SALES_REQUEST],
    ],
    [DispositionTableRowName.STOCK_SAFETY]: [
      !row[DispositionTableRowName.STOCK_SAFETY]
        ? 0
        : row[DispositionTableRowName.STOCK_SAFETY],
    ],
    [DispositionTableRowName.STOCK_OLD]: [
      row[DispositionTableRowName.STOCK_OLD],
    ],
    [DispositionTableRowName.ORDERS_QUEUED]: [
      row[DispositionTableRowName.ORDERS_QUEUED],
    ],
    [DispositionTableRowName.ORDERS_ACTIVE]: [
      row[DispositionTableRowName.ORDERS_ACTIVE],
    ],
    [DispositionTableRowName.ORDERS_PROD]: [
      row[DispositionTableRowName.ORDERS_PROD],
    ],
  });
}

export function createTableRows(
  dataStruct: DataStructure,
  articleIdx: number
): DispositionTableRow[] {
  const map: number[][] = articleComponentMap[articleIdx];
  if (!map) {
    return [];
  }
  const initialRows: DispositionTableRow[] = map
    .reduce((merged, arr) => merged.concat(arr))
    .map((id) => createRowForArticle(dataStruct, id));
  updateRowsData(initialRows, map);
  return initialRows;
}

export function updateTableRows(rows: DispositionTableRow[]): void {
  const map: number[][] = articleComponentMap[getPrimaryArticleId(rows) - 1];
  if (map) {
    updateRowsData(rows, map);
  }
}

function updateRowsData(rows: DispositionTableRow[], map: number[][]): void {
  let offset: number = 0;
  for (let i = 0; i < map.length; i++) {
    if (i == 0) {
      calculateProdOrderForRow(rows[i]);
      offset += map[i].length;
      continue;
    }
    const lastProdOrder = getRowById(rows, map[i - 1].at(-1));
    for (let j = 0; j < map[i].length; j++) {
      const currentRow = rows[j + offset];
      currentRow[DispositionTableRowName.SALES_REQUEST] =
        lastProdOrder[DispositionTableRowName.ORDERS_PROD];
      calculateProdOrderForRow(
        currentRow,
        lastProdOrder[DispositionTableRowName.ORDERS_QUEUED]
      );
    }
    offset += map[i].length;
  }
}

function getPrimaryArticleId(rows: DispositionTableRow[]): number {
  return rows
    .map((row) => row[DispositionTableRowName.ARTICLE_ID])
    .find((articleId) => primaryArticleIds.includes(articleId))!;
}

/**
 * Reads values from the passed struct for item/order id and constructs an initial table row.
 */
function createRowForArticle(
  struct: DataStructure,
  id: number
): DispositionTableRow {
  const sellWish = getSellWish(struct, id);
  const oldStock =
    struct.input.warehouseStock.find((stock) => stock.id == id)?.amount ?? 0;
  const queuedOrder = getQueuedOrderAmount(struct, id);
  const activeOrder = getActiveOrderAmount(struct, id);

  const isCommonId = commonComponentIds.find((next) => next === id);
  return {
    [DispositionTableRowName.ARTICLE_ID]: id,
    [DispositionTableRowName.SALES_REQUEST]: sellWish,
    [DispositionTableRowName.STOCK_SAFETY]: 0,
    [DispositionTableRowName.STOCK_OLD]: isCommonId
      ? Math.trunc(oldStock / 3)
      : oldStock,
    [DispositionTableRowName.ORDERS_QUEUED]: isCommonId
      ? Math.trunc(queuedOrder / 3)
      : queuedOrder,
    [DispositionTableRowName.ORDERS_ACTIVE]: isCommonId
      ? Math.trunc(activeOrder / 3)
      : activeOrder,
    [DispositionTableRowName.ORDERS_PROD]: 0,
  };
}

function getSellWish(struct: DataStructure, id: number): number {
  if (primaryArticleIds.find((next) => next === id)) {
    return (
      struct.output.sellWish.items.find((item) => item.article === id)
        ?.quantity ?? 0
    );
  }
  return 0;
}

function getQueuedOrderAmount(struct: DataStructure, id: number): number {
  return struct.input.waitingListWorkstations
    .map((workstation) =>
      workstation.waitingList
        ?.filter((value) => value.order === id)
        .map((value) => value.amount ?? 0)
        .reduce((sum, amount) => sum + amount, 0)
    )
    .map((value) => value ?? 0)
    .reduce((sum, amount) => sum + amount, 0);
}

function getActiveOrderAmount(struct: DataStructure, id: number): number {
  return struct.input.ordersInWork
    .filter((value) => value.id === id)
    .map((value) => value.amount ?? 0)
    .reduce((sum, amount) => sum + amount, 0);
}

function getRowById(
  rows: DispositionTableRow[],
  id: number
): DispositionTableRow {
  return rows.find((row) => row[DispositionTableRowName.ARTICLE_ID] == id)!;
}

function calculateProdOrderForRow(
  row: DispositionTableRow,
  prevWaitingListAmount: number | undefined = undefined
): void {
  const salesRequest = row[DispositionTableRowName.SALES_REQUEST];
  const stockSafety = row[DispositionTableRowName.STOCK_SAFETY] ?? 0;
  const stockOld = row[DispositionTableRowName.STOCK_OLD];
  const ordersQueued = row[DispositionTableRowName.ORDERS_QUEUED];
  const ordersActive = row[DispositionTableRowName.ORDERS_ACTIVE];

  const prodOrder =
    salesRequest +
    stockSafety -
    stockOld -
    ordersQueued -
    ordersActive +
    (prevWaitingListAmount ?? 0);
  row[DispositionTableRowName.ORDERS_PROD] = prodOrder < 0 ? 0 : prodOrder;
}
