import { AbstractControl, FormArray } from "@angular/forms";
import { DispositionTableRow, DispositionTableRowName } from "./disposition-util";
import { DataStructure } from "../../data.service";

const articleComponentArr: number[][] = [
    [1, 26, 51, 16, 17, 50, 4, 10, 49, 7, 13, 18],
    [2, 26, 56, 16, 17, 55, 5, 11, 54, 8, 14, 19],
    [3, 26, 31, 16, 17, 30, 6, 12, 29, 9, 15, 20],
];
const primaryArticleIds: number[] = [1, 2, 3];
const commonComponentIds: number[] = [26, 16, 17];

export function createTableRows(dataStruct: DataStructure, articleIdx: number): DispositionTableRow[] {
    const articleIds: number[] = articleComponentArr.at(articleIdx);
    if (!articleIds) {
        return [];
    }


}

export function updateTableFormArray(row: DispositionTableRow[]) {
    const articleIds: number[] = articleComponentArr.at(getArticleId(row));
    if (!articleIds) {
        return [];
    }
}

function getArticleId(rows: DispositionTableRow[]): string | undefined {
    return rows.find(row => row[DispositionTableRowName.ARTICLE_ID] in primaryArticleIds)?.[
      DispositionTableRowName.ARTICLE_ID
    ];
}

function calculateProdOrderForRow(rowControl: AbstractControl<any, any>): number {
    const sellReq = rowControl.get(DispositionTableRowName.SALES_REQUEST)?.value;
    const stockSafety = rowControl.get(DispositionTableRowName.STOCK_SAFETY)?.value;
    const stockOld = rowControl.get(DispositionTableRowName.STOCK_OLD)?.value;
    const orderQueued = rowControl.get(DispositionTableRowName.ORDERS_QUEUED)?.value;
    const orderActive = rowControl.get(DispositionTableRowName.ORDERS_ACTIVE)?.value;

    return sellReq + stockSafety - stockOld - orderQueued - orderActive;
}
