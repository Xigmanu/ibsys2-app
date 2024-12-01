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
  updateTableRows,
} from './disposition-table-row';

@Component({
  selector: 'dispo-table',
  templateUrl: './disposition-table.module.html',
  standalone: true,
  imports: [
    CommonModule,
    ClrInputModule,
    ClrFormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
})
export class ProdOrdersTableModule implements OnInit {
  @Input() dataRef: DispositionTableRow[] = [];
  form: FormGroup;
  rowNameEnum: typeof DispositionTableRowName = DispositionTableRowName;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      rows: this.fb.array([]),
    });
  }

  get rows() {
    return this.form.get('rows') as FormArray;
  }

  ngOnInit(): void {
    if (!this.dataRef || this.dataRef.length == 0) {
      return;
    }
    this.dataRef
      .map((row) => createFormGroupFromRow(this.fb, row))
      .forEach((group) => this.rows.push(group));
  }

  onChange(idx: number) {
    const rowControl: AbstractControl<any, any> = this.rows.at(idx);
    this.dataRef[idx][DispositionTableRowName.STOCK_SAFETY] = rowControl.get(
      DispositionTableRowName.STOCK_SAFETY
    )?.value;
    updateTableRows(this.dataRef);
    this.dataRef.forEach((ref, i) => this.rows.at(i).setValue(ref));
  }
}
