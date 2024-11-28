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
        ['article_ref_id']: [row[DispositionTableRowName.ARTICLE_ID]],
        ['sales_req']: [row[DispositionTableRowName.SALES_REQUEST]],
        ['stock_safety']: [!row[DispositionTableRowName.STOCK_SAFETY] ? 0 : row[DispositionTableRowName.STOCK_SAFETY]],
        ['stock_prev']: [row[DispositionTableRowName.STOCK_OLD]],
        ['orders_queued']: [row[DispositionTableRowName.ORDERS_QUEUED]],
        ['orders_in_progress']: [row[DispositionTableRowName.ORDERS_ACTIVE]],
        ['orders_prod']: [row[DispositionTableRowName.ORDERS_PROD]]
    });
};
