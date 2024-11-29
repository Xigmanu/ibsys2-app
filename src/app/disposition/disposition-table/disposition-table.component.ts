import { Component, Input, OnInit } from "@angular/core";
import { ClrFormsModule, ClrInputModule } from "@clr/angular";
import { CommonModule } from "@angular/common";
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { createFormGroupFromRow, DispositionTableRow, DispositionTableRowName } from "./disposition-util";
import { TranslateModule } from "@ngx-translate/core";
import { updateTable } from "./disposition-data-updater";

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
        this.dataRef.map(row => createFormGroupFromRow(this.fb, row)).forEach(group => this.rows.push(group))
    }

    onChange(idx: number) {
        const rowControl: AbstractControl<any, any> = this.rows.at(idx)
        this.dataRef[idx][DispositionTableRowName.STOCK_SAFETY] = rowControl.get(DispositionTableRowName.STOCK_SAFETY)?.value;
        updateTable(this.dataRef)
        this.dataRef.forEach((ref, i) => this.rows.at(i).setValue(ref))
    }
}