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
  createFormGroupFromRow,
  DispositionTableRow,
  DispositionTableRowName,
  getDispositionKey,
  getPrimaryArticleId,
  updateTableRows,
} from './disposition-table-row';
import { DataService, DispoItem, Disposition } from '../../data.service';

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

  get formArr(): FormArray<any> {
    return this.form.get('rows') as FormArray;
  }

  ngOnInit(): void {
    console.log(this.dataSvc.getData());
    if (!this.rows || this.rows.length == 0) {
      return;
    }
    this.rows
      .map((row) => createFormGroupFromRow(this.fb, row))
      .forEach((group) => this.formArr.push(group));
  }

  onChange(idx: number) {
    const rowControl: AbstractControl<any, any> = this.formArr.at(idx);
    this.rows[idx][DispositionTableRowName.STOCK_SAFETY] = rowControl.get(
      DispositionTableRowName.STOCK_SAFETY
    )?.value;
    updateTableRows(this.rows);
    this.rows.forEach((ref, i) => this.formArr.at(i).setValue(ref));

    this.updateGlobalState();
    console.log(this.dataSvc.getData());
  }

  private updateGlobalState(): void {
    this.rows.forEach((row) => {
      const articleId: number = row[DispositionTableRowName.ARTICLE_ID];
      const production: number = row[DispositionTableRowName.ORDERS_PROD];
      const safetyStock: number | undefined =
        row[DispositionTableRowName.STOCK_SAFETY];
      if (safetyStock) {
        this.updateGlobalDispoItemArr(articleId.toString(), safetyStock);
      }
      this.dataSvc.setProductionListArticle(articleId, production);
    });
  }

  private updateGlobalDispoItemArr(
    articleId: string,
    safetyStock: number
  ): void {
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
