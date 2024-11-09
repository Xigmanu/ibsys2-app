export interface ProdOrdersGridRow {
    [key: string]: any

    article_ref_id: string,
    sales_req: number,
    stock_safety: number,
    stock_prev: number,
    orders_queued: number,
    orders_in_process: number,
    orders_prod: number,
}