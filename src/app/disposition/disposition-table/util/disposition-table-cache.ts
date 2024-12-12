import { Injectable } from '@angular/core';
import { Production } from '../../../data.service';

interface ProdOrderCache {
  [articleId: number]: Map<number, number>;
}

@Injectable({
  providedIn: 'root',
})
export class DispositionTableCache {
  private articleProdOrders: ProdOrderCache = {};

  storeOrUpdateProdOrder(endProdId: number, prodOrder: Production): void {
    const articleId: number = prodOrder.article;
    const prodOrderQuantity: number = prodOrder.quantity;

    const cached: Map<number, number> | undefined =
      this.articleProdOrders[articleId];
    if (cached) {
      cached.set(endProdId, prodOrderQuantity);
      return;
    }

    const endProductMap: Map<number, number> = new Map<number, number>();
    endProductMap.set(endProdId, prodOrderQuantity);
    this.articleProdOrders[articleId] = endProductMap;
  }

  getAggregatedProdOrder(articleId: number): number {
    const cached: Map<number, number> | undefined =
      this.articleProdOrders[articleId];
    if (!cached) {
      return 0;
    }

    return Array.from(cached.values()).reduce((sum, value) => sum + value, 0);
  }
}
