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

  onSave() {
    const p1DispoItems: DispoItem[] = this.convertRowsToDispoItemArray(
      this.rowsP1
    );
    const p2DispoItems: DispoItem[] = this.convertRowsToDispoItemArray(
      this.rowsP2
    );
    const p3DispoItems: DispoItem[] = this.convertRowsToDispoItemArray(
      this.rowsP3
    );

    const rowsAll: DispositionTableRow[] = this.rowsP1.concat(
      this.rowsP2.concat(this.rowsP3)
    );

    const prodArr: Production[] = this.convertRowsToProductionArray(rowsAll);

    this.dataStruct.disposition.p1.push(...p1DispoItems);
    this.dataStruct.disposition.p2.push(...p2DispoItems);
    this.dataStruct.disposition.p3.push(...p3DispoItems);

    this.dataStruct.output.productionList.productions.push(...prodArr);

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
}
