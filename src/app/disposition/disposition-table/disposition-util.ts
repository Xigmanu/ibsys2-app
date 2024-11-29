import { AbstractControl, FormBuilder, FormGroup } from "@angular/forms"

export enum DispositionTableRowName {
    ARTICLE_ID = 'article_id',
    SALES_REQUEST = 'sales_request',
    STOCK_SAFETY = 'stock_safety',
    STOCK_OLD = 'stock_old',
    ORDERS_QUEUED = 'orders_queued',
    ORDERS_ACTIVE = 'orders_active',
    ORDERS_PROD = 'orders_prod'
};

export interface DispositionTableRow {
    [DispositionTableRowName.ARTICLE_ID]: number,
    [DispositionTableRowName.SALES_REQUEST]: number,
    [DispositionTableRowName.STOCK_SAFETY]?: number,
    [DispositionTableRowName.STOCK_OLD]: number,
    [DispositionTableRowName.ORDERS_QUEUED]: number,
    [DispositionTableRowName.ORDERS_ACTIVE]: number,
    [DispositionTableRowName.ORDERS_PROD]: number,
};

export function createFormGroupFromRow(fb: FormBuilder, row: DispositionTableRow): FormGroup {
    return fb.group({
        [DispositionTableRowName.ARTICLE_ID]: [row[DispositionTableRowName.ARTICLE_ID]],
        [DispositionTableRowName.SALES_REQUEST]: [row[DispositionTableRowName.SALES_REQUEST]],
        [DispositionTableRowName.STOCK_SAFETY]: [!row[DispositionTableRowName.STOCK_SAFETY] ? 0 : row[DispositionTableRowName.STOCK_SAFETY]],
        [DispositionTableRowName.STOCK_OLD]: [row[DispositionTableRowName.STOCK_OLD]],
        [DispositionTableRowName.ORDERS_QUEUED]: [row[DispositionTableRowName.ORDERS_QUEUED]],
        [DispositionTableRowName.ORDERS_ACTIVE]: [row[DispositionTableRowName.ORDERS_ACTIVE]],
        [DispositionTableRowName.ORDERS_PROD]: [row[DispositionTableRowName.ORDERS_PROD]]
    });
};
