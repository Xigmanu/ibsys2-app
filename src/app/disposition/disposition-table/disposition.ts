import { FormBuilder, FormGroup } from "@angular/forms"

export interface DispositionTableRow {
    article_ref_id: string,
    sales_req: number,
    stock_safety?: number,
    stock_prev: number,
    orders_queued: number,
    orders_in_process: number,
    orders_prod: number,
}

export function createFormGroupFromRow(fb: FormBuilder, row: DispositionTableRow): FormGroup {
    return fb.group({
        ['article_ref_id']: [row.article_ref_id],
        ['sales_req']: [row.sales_req],
        ['stock_safety']: [!row.stock_safety ? 0 : row.stock_safety],
        ['stock_prev']: [row.stock_prev],
        ['orders_queued']: [row.orders_queued],
        ['orders_in_progress']: [row.orders_in_process],
        ['orders_prod']: [row.orders_prod]
    })
}
