import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ClrFormsModule, ClrInputModule } from '@clr/angular';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  DispositionTableRow,
  DispositionTableRowName,
  getDispositionKey,
  getEndProductId,
  isCommonArticle,
  updateDispositionTableRows,
} from './util/disposition-table-row';
import { DataService, DispoItem, Disposition } from '../../data.service';
import { createFormGroupFromRow } from './util/disposition-table-form';
import { DispositionTableCache } from './util/disposition-table-cache';

@Component({
  selector: 'dispo-table',
  templateUrl: './disposition-table.component.html',
  styleUrl: './disposition-table.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ClrInputModule,
    ClrFormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
})
export class DispositionTableComponent implements OnInit, OnDestroy {
  @Input() rows: DispositionTableRow[] = [];
  form: FormGroup;
  rowNameEnum: typeof DispositionTableRowName = DispositionTableRowName;

  constructor(
    private fb: FormBuilder,
    private dataSvc: DataService,
    private cache: DispositionTableCache
  ) {
    this.form = this.fb.group({
      rows: this.fb.array([]),
    });
  }

  get formArray(): FormArray<any> {
    return this.form.get('rows') as FormArray;
  }

  ngOnInit(): void {
    if (!this.rows || this.rows.length == 0) {
      return;
    }
    this.rows
      .map((row) => createFormGroupFromRow(this.fb, row))
      .forEach((group) => this.formArray.push(group));
  }

  ngOnDestroy(): void {
    updateDispositionTableRows(this.rows);
    this.rows.forEach((ref, i) => this.formArray.at(i).setValue(ref));
    this.updateGlobalState();
  }

  getArrElemIdx(
    slice: AbstractControl<any, any>[][],
    i: number,
    j: number
  ): number {
    return slice.slice(0, i).reduce((sum, row) => sum + row.length, 0) + j;
  }

  onChange(idx: number) {
    const rowControl: AbstractControl<any, any> = this.formArray.at(idx);
    const value = rowControl.get(DispositionTableRowName.STOCK_SAFETY)?.value;
    if (value && value >= 0) {
      const currentRow: DispositionTableRow = this.rows[idx];

      currentRow[DispositionTableRowName.STOCK_SAFETY] = +value;
      updateDispositionTableRows(this.rows);
      this.rows.forEach((ref, i) => this.formArray.at(i).setValue(ref));
      this.tryCacheCommonArticleProdOrder(currentRow);
      this.updateGlobalState();
    }
  }

  sliceFormArray(): AbstractControl<any, any>[][] {
    return [
      this.formArray.controls.slice(0, 1),
      this.formArray.controls.slice(1, 3),
      this.formArray.controls.slice(3, 6),
      this.formArray.controls.slice(6, 9),
      this.formArray.controls.slice(9, 12),
    ];
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  private tryCacheCommonArticleProdOrder(row: DispositionTableRow): void {
    const articleId: number = row[DispositionTableRowName.ARTICLE_ID];
    if (isCommonArticle(articleId)) {
      this.cache.storeOrUpdateProdOrder(getEndProductId(this.rows), {
        article: articleId,
        quantity: row[DispositionTableRowName.ORDERS_PROD],
      });
    }
  }

  private updateGlobalState(): void {
    this.rows.forEach((row) => {
      const articleId: number = row[DispositionTableRowName.ARTICLE_ID];
      const production: number = row[DispositionTableRowName.ORDERS_PROD];
      const safetyStock: number =
        row[DispositionTableRowName.STOCK_SAFETY] ?? 0;

      if (safetyStock >= 0) {
        this.updateGlobalDispoItemArr(articleId.toString(), safetyStock);
      }

      if (production > 0) {
        if (isCommonArticle(row[DispositionTableRowName.ARTICLE_ID])) {
          const cached = this.cache.getAggregatedProdOrder(articleId);
          if (cached) {
            this.dataSvc.setProductionListArticle(articleId, cached);
          }
        } else {
          this.dataSvc.setProductionListArticle(articleId, production);
        }
      } else {
        const productions =
          this.dataSvc.getData().output.productionList.productions;
        const idx = productions.findIndex((prod) => prod.article === articleId);
        if (idx > -1) {
          productions.splice(idx, 1);
        }
      }
    });
  }

  private updateGlobalDispoItemArr(
    articleId: string,
    safetyStock: number
  ): void {
    const dispoKey: keyof Disposition = getDispositionKey(
      getEndProductId(this.rows)
    )!;
    const dispoArr: DispoItem[] = this.dataSvc.getDispoAllStock(dispoKey);
    const oldItem: DispoItem | undefined = dispoArr.find(
      (oldItem) => oldItem.articleId === articleId
    );

    if (oldItem) {
      oldItem.safetyStock = safetyStock;
    } else {
      dispoArr.push({ articleId, safetyStock });
    }
  }
}
