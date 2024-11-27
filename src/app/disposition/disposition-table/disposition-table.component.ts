import { Component, Input, OnInit } from "@angular/core";
import { ClrFormsModule, ClrInputModule } from "@clr/angular";
import { CommonModule } from "@angular/common";
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { calculateProdOrderForRow, createFormGroupFromRow, DispositionTableRow, DispositionTableRowName } from "./disposition-util";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    selector: 'po-table',
    templateUrl: './disposition-table.component.html',
    standalone: true,
    imports: [
        CommonModule, 
        ClrInputModule, 
        ClrFormsModule, 
        ReactiveFormsModule,
        TranslateModule
    ]
})
export class ProdOrdersTableComponent implements OnInit {
    @Input() dataRef: DispositionTableRow[] = [];
    form: FormGroup;
    rowNameEnum: typeof DispositionTableRowName = DispositionTableRowName;

    constructor(
        private fb: FormBuilder
    ) {
        this.form = this.fb.group({
            rows: this.fb.array([])
        });
    }

    get rows() {
        return this.form.get('rows') as FormArray;
    }

    ngOnInit(): void {
        if (!this.dataRef || this.dataRef.length == 0) {
            return;
        }
        const formArr = this.form.get('rows') as FormArray;
        const formGroup: FormGroup[] = this.dataRef.map(row => createFormGroupFromRow(this.fb, row));
        formArr.push(formGroup);
    }

    onChange(idx: number) {
        const rowControl: AbstractControl<any, any> = this.rows.at(idx)
        this.dataRef[idx][DispositionTableRowName.STOCK_SAFETY] = rowControl.get(DispositionTableRowName.STOCK_SAFETY)?.value;
        this.dataRef[idx][DispositionTableRowName.ORDERS_PROD] = calculateProdOrderForRow(rowControl)
    }
}