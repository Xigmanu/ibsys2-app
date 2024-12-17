import { TestBed } from '@angular/core/testing';
import { DispositionTableCache } from './disposition-table-cache';
import { Production } from '../../../data.service';

describe(DispositionTableCache.name, () => {
  let cache: DispositionTableCache;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    cache = TestBed.inject(DispositionTableCache);
  });

  it('should be initialized', () => expect(cache).toBeTruthy());

  const endProdId1: number = 1;
  const endProdId2: number = 2;
  const endProdId3: number = 3;

  const articleId1: number = 5;
  const articleId2: number = 6;

  const prodOrder11: Production = { article: articleId1, quantity: 100 };
  const prodOrder12: Production = { article: articleId1, quantity: 250 };
  const prodOrder13: Production = { article: articleId1, quantity: 100 };

  const prodOrder21: Production = { article: articleId2, quantity: 50 };
  const prodOrder22: Production = { article: articleId2, quantity: 10 };

  it('should cache orders with the same article id for multiple end products and return the aggregated order quantity', () => {
    // arrange
    const expected1: number =
      prodOrder11.quantity + prodOrder12.quantity + prodOrder13.quantity;
    const expected2: number = prodOrder21.quantity + prodOrder22.quantity;

    // act
    cache.storeOrUpdateProdOrder(endProdId1, prodOrder11);
    cache.storeOrUpdateProdOrder(endProdId2, prodOrder12);
    cache.storeOrUpdateProdOrder(endProdId3, prodOrder13);
    cache.storeOrUpdateProdOrder(endProdId1, prodOrder21);
    cache.storeOrUpdateProdOrder(endProdId1, prodOrder22);
    const aggregatedOrder1: number = cache.getAggregatedProdOrder(articleId1);
    const aggregatedOrder2: number = cache.getAggregatedProdOrder(articleId2);

    // assert
    expect(aggregatedOrder1).toEqual(expected1);
    expect(aggregatedOrder2).toEqual(expected2);
  });

  it('should override existing cached entries with the same article and end product ids', () => {
    // arrange
    const newProdOrder11: Production = { article: articleId1, quantity: 200 };
    const expected: number =
      newProdOrder11.quantity + prodOrder12.quantity + prodOrder13.quantity;

    // act
    cache.storeOrUpdateProdOrder(endProdId1, newProdOrder11);
    cache.storeOrUpdateProdOrder(endProdId2, prodOrder12);
    cache.storeOrUpdateProdOrder(endProdId3, prodOrder13);
    const aggregatedOrder: number = cache.getAggregatedProdOrder(articleId1);

    // assert
    expect(aggregatedOrder).toEqual(expected);
  });
});
