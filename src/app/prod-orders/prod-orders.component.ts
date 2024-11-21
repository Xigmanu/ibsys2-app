import { Component, OnDestroy, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ClarityModule } from '@clr/angular'
import { ProdOrdersDatagridComponent } from "./prod-orders-datagrid/prod-orders-datagrid.component";
import { ProdOrdersGridRow, SafetyStock } from "./prod-orders-datagrid/prod-orders";
import { DataService } from "../data.service";
import { Subscription } from "rxjs";
import { ProdOrdersDataService } from "./prod-orders.data.service";

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
export class ProdOrdersComponent implements OnInit, OnDestroy {
    rows_p1: ProdOrdersGridRow[] = [];
    rows_p2: ProdOrdersGridRow[] = [];
    rows_p3: ProdOrdersGridRow[] = [];
    st_p1: SafetyStock[] = [];
    sub: Subscription

    constructor(private globalDS: DataService, private outDataService: ProdOrdersDataService) {
    }

    ngOnInit(): void {
        this.sub = this.outDataService.getSafetyStock().subscribe(stock => this.)
    }

    ngOnDestroy(): void {
        
    }
}