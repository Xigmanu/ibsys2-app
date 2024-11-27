import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ClarityModule } from '@clr/angular'
import { ProdOrdersTableComponent } from "./disposition-table/disposition-table.component";
import { DispositionTableRow, DispositionTableRowName } from "./disposition-table/disposition";
import { DataService, DataStructure, DispoItem } from "../data.service";
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
    private dataStruct: DataStructure;
    rows_p1: DispositionTableRow[] = [];
    rows_p2: DispositionTableRow[] = [];
    rows_p3: DispositionTableRow[] = [];

    constructor(private globalDS: DataService) {
        this.dataStruct = this.globalDS.getData();
    }

    ngOnInit(): void {
        
    }

    onDataSafe() {
        const p1DispoItems: DispoItem[] = this.convertRowsToDispoItemArray(this.rows_p1);
        const p2DispoItems: DispoItem[] = this.convertRowsToDispoItemArray(this.rows_p2);
        const p3DispoItems: DispoItem[] = this.convertRowsToDispoItemArray(this.rows_p3);
        
        this.dataStruct.disposition.p1.push(...p1DispoItems);
        this.dataStruct.disposition.p2.push(...p2DispoItems);
        this.dataStruct.disposition.p3.push(...p3DispoItems);
    }

    convertRowsToDispoItemArray(rows: DispositionTableRow[]): DispoItem[] {
        return rows.map(row => {
            return {
                articleId: row[DispositionTableRowName.ARTICLE_ID],
                safetyStock: !row[DispositionTableRowName.STOCK_SAFETY] 
                    ? 0 
                    : row[DispositionTableRowName.STOCK_SAFETY]
            };
        });
    }
}