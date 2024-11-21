import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ProdOrdersGridRow, SafetyStock } from "./prod-orders";
import { ClrDatagridModule, ClrIconModule, ClrInputModule } from "@clr/angular";
import { CommonModule } from "@angular/common";
import { GridRowProvider } from "./grid-row-provider";
import { Observable } from "rxjs";
import { FormsModule } from "@angular/forms";

@Component({
    selector: 'po-datagrid',
    templateUrl: './prod-orders-datagrid.component.html',
    standalone: true,
    imports: [CommonModule, ClrDatagridModule, ClrIconModule, ClrInputModule, FormsModule],
    providers: [GridRowProvider]
})
export class ProdOrdersDatagridComponent {
    @Input() rows: ProdOrdersGridRow[] = [];
    @Output() safety_stock = new EventEmitter<SafetyStock[]>();
    rows$: Observable<ProdOrdersGridRow[]>;

    constructor(private rowProvider: GridRowProvider) {
        this.rows$ = this.rowProvider.rows$;
    }

    safe() {
        const safetyStockArr: SafetyStock[] = this.rows.map(row => ({
            article_id: row.article_ref_id,
            stock: row.stock_safety || 0,
        }));
        this.safety_stock.emit(safetyStockArr);
    }
}