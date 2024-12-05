import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClarityModule, ClrLoadingState } from '@clr/angular';
import { ProdOrdersTableModule } from './disposition-table/disposition-table.module';
import {
  DataService,
  DataStructure,
  DispoItem,
  Production,
} from '../data.service';
import { TranslateModule } from '@ngx-translate/core';
import {
  createTableRows,
  DispositionTableRow,
  DispositionTableRowName,
} from './disposition-table/disposition-table-row';

@Component({
  selector: 'app-prod-orders',
  templateUrl: './disposition.component.html',
  styleUrl: './disposition.component.scss',
  standalone: true,
  imports: [
    ClarityModule,
    RouterModule,
    ProdOrdersTableModule,
    TranslateModule,
  ],
})
export class DispositionComponent implements OnInit {
  private dataStruct: DataStructure;

  rowsP1: DispositionTableRow[] = [];
  rowsP2: DispositionTableRow[] = [];
  rowsP3: DispositionTableRow[] = [];

  saveBtnState: ClrLoadingState = ClrLoadingState.DEFAULT;

  constructor(private globalDS: DataService) {
    this.dataStruct = this.globalDS.getData();
  }

  ngOnInit(): void {
    this.rowsP1 = createTableRows(this.dataStruct, 0);
    this.rowsP2 = createTableRows(this.dataStruct, 1);
    this.rowsP3 = createTableRows(this.dataStruct, 2);
  }

  onSave(): void {
    const p1DispoItems: DispoItem[] = this.convertRowsToDispoItemArray(
      this.rowsP1
    );
    const p2DispoItems: DispoItem[] = this.convertRowsToDispoItemArray(
      this.rowsP2
    );
    const p3DispoItems: DispoItem[] = this.convertRowsToDispoItemArray(
      this.rowsP3
    );

    const rowsAll: DispositionTableRow[] = [
      ...this.rowsP1,
      ...this.rowsP2,
      ...this.rowsP3,
    ];

    p1DispoItems.forEach((newItem) =>
      this.updateDispoItemArr(this.dataStruct.disposition.p1, newItem)
    );
    p2DispoItems.forEach((newItem) =>
      this.updateDispoItemArr(this.dataStruct.disposition.p2, newItem)
    );
    p3DispoItems.forEach((newItem) =>
      this.updateDispoItemArr(this.dataStruct.disposition.p3, newItem)
    );

    this.convertRowsToProductionArray(rowsAll).forEach((newItem) => {
      const oldItem: Production | undefined =
        this.dataStruct.output.productionList.productions.find(
          (old) => newItem.article === old.article
        );
      if (!oldItem) {
        this.dataStruct.output.productionList.productions.push(newItem);
      } else {
        oldItem.quantity = newItem.quantity;
      }
    });

    this.saveBtnState = ClrLoadingState.SUCCESS;
  }

  private convertRowsToDispoItemArray(
    rows: DispositionTableRow[]
  ): DispoItem[] {
    return rows.map((row) => {
      return {
        articleId: row[DispositionTableRowName.ARTICLE_ID].toString(),
        safetyStock: !row[DispositionTableRowName.STOCK_SAFETY]
          ? 0
          : row[DispositionTableRowName.STOCK_SAFETY],
      };
    });
  }

  private convertRowsToProductionArray(
    rows: DispositionTableRow[]
  ): Production[] {
    return rows.map((row) => {
      return {
        article: row[DispositionTableRowName.ARTICLE_ID],
        quantity: row[DispositionTableRowName.ORDERS_PROD],
      };
    });
  }

  private updateDispoItemArr(items: DispoItem[], newItem: DispoItem): void {
    const oldItem: DispoItem | undefined = items.find(
      (oldItem) => oldItem.articleId === newItem.articleId
    );
    if (oldItem) {
      oldItem.safetyStock = newItem.safetyStock;
    } else {
      items.push(newItem);
    }
  }
}
