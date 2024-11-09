import { Injectable } from "@angular/core";
import { ProdOrdersGridRow } from "./prod-orders";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class GridRowProvider {
    private _rowSubject = new BehaviorSubject<ProdOrdersGridRow[]>([]);
    rows$ = this._rowSubject.asObservable();

    get rows(): ProdOrdersGridRow[] {
        return this._rowSubject.getValue()
    }

    set rows(value: ProdOrdersGridRow[]) {
        this._rowSubject.next(value)
    }
}