import { Injectable } from "@angular/core"
import { BehaviorSubject, Observable } from "rxjs"
import { SafetyStock } from "./prod-orders-datagrid/prod-orders";


@Injectable({
    providedIn: "root"
})
export class ProdOrdersDataService {
    private stock_subject = new BehaviorSubject<SafetyStock[]>([]);

    constructor() {}

    setSafetyStock(stock: SafetyStock[]) {
        this.stock_subject.next(stock);
    }

    getSafetyStock(): Observable<SafetyStock[]> {
        return this.stock_subject.asObservable();
    }
}