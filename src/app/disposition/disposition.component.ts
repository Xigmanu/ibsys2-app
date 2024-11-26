import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ClarityModule } from '@clr/angular'
import { ProdOrdersTableComponent } from "./disposition-table/disposition-table.component";
import { DispositionTableRow } from "./disposition-table/disposition";
import { DataService, DataStructure } from "../data.service";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    selector: 'app-prod-orders',
    templateUrl: './disposition.component.html',
    standalone: true,
    imports: [
        ClarityModule,
        RouterModule,
        ProdOrdersTableComponent,
        TranslateModule
    ]
})
export class DispositionComponent implements OnInit {
    private dataStruct: DataStructure
    rows_p1: DispositionTableRow[] = [];
    rows_p2: DispositionTableRow[] = [];
    rows_p3: DispositionTableRow[] = [];

    constructor(private globalDS: DataService) {
        this.dataStruct = this.globalDS.getData()
        console.log(this.dataStruct)
    }

    ngOnInit(): void {
        const foo: DispositionTableRow = {
            article_ref_id: "22",
            orders_in_process: this.dataStruct.input.ordersInWork[0].amount,
            orders_prod: this.dataStruct.input.ordersInWork[0].batch,
            orders_queued: this.dataStruct.input.waitingListStock[0].id,
            stock_prev: this.dataStruct.input.warehouseStock[0].amount,
            sales_req: this.dataStruct.input.futureInwardStockMovement[0].amount
        }
        console.log("of")
        this.rows_p1.push(foo)
        this.rows_p2.push(foo)
        this.rows_p3.push(foo)
    }
}