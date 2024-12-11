import { Component, Input, OnInit } from '@angular/core';
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
  getPrimaryArticleId,
  updateTableRows,
} from './disposition-table-row';
import { DataService, DispoItem, Disposition } from '../../data.service';
import { createFormGroupFromRow } from './disposition-table-form';

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
export class DispositionTableComponent implements OnInit {
  @Input() rows: DispositionTableRow[] = [];
  form: FormGroup;
  rowNameEnum: typeof DispositionTableRowName = DispositionTableRowName;

  constructor(private fb: FormBuilder, private dataSvc: DataService) {
    this.form = this.fb.group({
      rows: this.fb.array([]),
    });
  }

  get formArray(): FormArray<any> {
    return this.form.get('rows') as FormArray;
  }

  ngOnInit(): void {
    console.log(this.dataSvc.getData());
    if (!this.rows || this.rows.length == 0) {
      return;
    }
    this.rows
      .map((row) => createFormGroupFromRow(this.fb, row))
      .forEach((group) => this.formArray.push(group));
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
      this.rows[idx][DispositionTableRowName.STOCK_SAFETY] = +value;
      updateTableRows(this.rows);
      this.rows.forEach((ref, i) => this.formArray.at(i).setValue(ref));
      console.log(this.rows[idx]);
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
        this.dataSvc.setProductionListArticle(articleId, production);
      }
    });
  }

  private updateGlobalDispoItemArr(
    articleId: string,
    safetyStock: number
  ): void {
    console.log(safetyStock + ' + ' + articleId);
    const dispoKey: keyof Disposition = getDispositionKey(
      getPrimaryArticleId(this.rows)
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
