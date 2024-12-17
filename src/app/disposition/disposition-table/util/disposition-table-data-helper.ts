import {
  DataStructure,
  Disposition,
  DispoItem,
  MissingPart,
  WaitingListWorkstation,
} from '../../../data.service';
import { getDispositionKey } from './disposition-table-row';

export function getSellWish(
  data: DataStructure,
  articleId: number,
  primaryArticleIds: number[]
): number {
  if (primaryArticleIds.find((next) => next === articleId)) {
    return (
      data.output.sellWish.items.find((item) => item.article === articleId)
        ?.quantity ?? 0
    );
  }
  return 0;
}

export function getSafetyStock(
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

export function getOldStock(data: DataStructure, articleId: number): number {
  return (
    data.input.warehouseStock.find((stock) => stock.id == articleId)?.amount ??
    0
  );
}

export function getQueuedOrderAmount(
  data: DataStructure,
  articleId: number
): number {
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

export function getActiveOrderAmount(
  data: DataStructure,
  articleId: number
): number {
  return data.input.ordersInWork
    .filter((value) => value.item === articleId)
    .map((value) => value.amount ?? 0)
    .reduce((sum, amount) => sum + amount, 0);
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
  let totalQueuedOrderAmount: number = 0;

  for (const workstation of waitingListWs) {
    const { waitingList } = workstation;
    if (!waitingList) {
      continue;
    }

    for (const waitingListItem of waitingList) {
      if (waitingListItem.item !== articleId) {
        continue;
      }

      const cached = getCachedBatches(
        waitingListItem,
        articleBatchCache,
        articleId
      );
      switch (cached[0].status) {
        case 0:
          continue;
        case 1:
          articleBatchCache.set(articleId, [
            {
              first: waitingListItem.firstBatch,
              last: waitingListItem.lastBatch,
            },
          ]);
          totalQueuedOrderAmount += waitingListItem.amount;
          break;
        case 2:
          cached[1]?.push({
            first: waitingListItem.firstBatch,
            last: waitingListItem.lastBatch,
          });
          totalQueuedOrderAmount += waitingListItem.amount;
          break;
      }
    }
  }

  return totalQueuedOrderAmount;
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
  let totalQueuedOrderAmount: number = 0;

  for (const part of missingParts) {
    for (const workplace of part.workplace) {
      for (const waitingListItem of workplace.waitingList) {
        if (waitingListItem.item !== articleId) {
          continue;
        }
        const cached = getCachedBatches(
          waitingListItem,
          articleBatchCache,
          articleId
        );
        switch (cached[0].status) {
          case 0:
            continue;
          case 1:
            articleBatchCache.set(articleId, [
              {
                first: waitingListItem.firstBatch,
                last: waitingListItem.lastBatch,
              },
            ]);
            totalQueuedOrderAmount += waitingListItem.amount;
            break;
          case 2:
            cached[1]?.push({
              first: waitingListItem.firstBatch,
              last: waitingListItem.lastBatch,
            });
            totalQueuedOrderAmount += waitingListItem.amount;
            break;
        }
      }
    }
  }

  return totalQueuedOrderAmount;
}

/**
 * Checks if first and last batches are present for a given articleId.
 *
 * @param waitingList Next waiting list entry
 * @param articleBatchCache Batch cache
 * @param articleId Current article id
 * @returns '0' if cached entry was found and first, last batches are cached.
 * '1' if no cached entries for a given article id were found.
 * '2' if cached entry was found but no matching first, last batches were cached.
 */
function getCachedBatches(
  waitingList: {
    period: number;
    order: number;
    firstBatch: number;
    lastBatch: number;
    item: number;
    amount: number;
    timeNeed: number;
  },
  articleBatchCache: Map<number, { first: number; last: number }[]>,
  articleId: number
): [{ status: 0 | 1 | 2 }, { first: number; last: number }[] | undefined] {
  const cachedBatches = articleBatchCache.get(articleId);
  if (!cachedBatches) {
    return [{ status: 1 }, undefined];
  }

  const isCacheHit = cachedBatches.some(
    (batch) =>
      batch.first === waitingList.firstBatch &&
      batch.last === waitingList.lastBatch
  );
  if (isCacheHit) {
    return [{ status: 0 }, cachedBatches];
  }

  return [{ status: 2 }, cachedBatches];
}
