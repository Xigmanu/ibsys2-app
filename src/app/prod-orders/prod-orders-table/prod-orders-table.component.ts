import { Component, Input, OnInit } from "@angular/core";
import { ClrFormsModule, ClrInputModule } from "@clr/angular";
import { CommonModule } from "@angular/common";
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { createFormGroupFromRow, ProdOrdersTableRow } from "./prod-orders";

@Component({
    selector: 'po-table',
    templateUrl: './prod-orders-table.component.html',
    standalone: true,
    imports: [CommonModule, ClrInputModule, ClrFormsModule, ReactiveFormsModule]
})
export class ProdOrdersTableComponent implements OnInit {
    @Input() dataRef: ProdOrdersTableRow[] = []
    form: FormGroup

    constructor(
        private fb: FormBuilder
    ) {
        this.form = this.fb.group({
            rows: this.fb.array([])
        })
    }

    get rows() {
        return this.form.get('rows') as FormArray;
    }

    ngOnInit(): void {
        const formArr = this.form.get('rows') as FormArray
        const formGroup = createFormGroupFromRow(this.fb, this.dataRef[0])
        formArr.push(formGroup)
    }

    onChange(idx: number) {
        this.dataRef[idx].stock_safety = this.rows.at(idx).get('stock_safety')?.value
    }
}