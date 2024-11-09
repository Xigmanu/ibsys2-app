import { Component, Inject, Input } from "@angular/core";
import { ProdOrdersGridRow } from "./prod-orders";
import { ClrDatagridModule, ClrIconModule } from "@clr/angular";
import { CommonModule } from "@angular/common";
import { GridRowProvider } from "./grid-row-provider";
import { Observable } from "rxjs";

@Component({
    selector: 'po-datagrid',
    templateUrl: './prod-orders-datagrid.component.html',
    standalone: true,
    imports: [CommonModule, ClrDatagridModule, ClrIconModule],
    providers: [GridRowProvider]
})
export class ProdOrdersDatagridComponent {
    @Input() rows: ProdOrdersGridRow[] = [];
    rows$: Observable<ProdOrdersGridRow[]>;

    constructor(private rowProvider: GridRowProvider) {
        this.rows$ = this.rowProvider.rows$;
    }
}