import { DataStructure, Disposition } from '../../../data.service';
import {
  getSellWish,
  getQueuedOrderAmount,
  getActiveOrderAmount,
  getSafetyStock,
  getOldStock,
} from './disposition-table-data-helper';

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
  const sellWish = getSellWish(data, articleId, primaryArticleIds);
  const oldStock = getOldStock(data, articleId);
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
