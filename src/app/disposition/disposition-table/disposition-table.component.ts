import { Component, Input, OnInit } from "@angular/core";
import { ClrFormsModule, ClrInputModule } from "@clr/angular";
import { CommonModule } from "@angular/common";
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { createFormGroupFromRow, DispositionTableRow, DispositionTableRowName } from "./disposition";
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
        this.dataRef[idx].stock_safety = this.rows.at(idx).get(DispositionTableRowName.STOCK_SAFETY)?.value;
    }
}