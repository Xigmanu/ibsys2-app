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
        // TODO
    }

    onDataSafe() {
        // TODO
    }
}