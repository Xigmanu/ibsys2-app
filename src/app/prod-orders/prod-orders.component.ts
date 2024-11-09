import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ClarityModule } from '@clr/angular'
import { ProdOrdersDatagridComponent } from "./prod-orders-datagrid/prod-orders-datagrid.component";
import { ProdOrdersGridRow } from "./prod-orders-datagrid/prod-orders";

@Component({
    selector: 'app-prod-orders',
    templateUrl: './prod-orders.component.html',
    standalone: true,
    imports: [
        ClarityModule,
        RouterModule,
        ProdOrdersDatagridComponent
    ]
})
export class ProdOrdersComponent {
    rows_p1: ProdOrdersGridRow[] = []
    rows_p2: ProdOrdersGridRow[] = [];
    rows_p3: ProdOrdersGridRow[] = [];
}