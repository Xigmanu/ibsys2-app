import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';
import {
  DispositionTableRow,
  DispositionTableRowName,
} from './disposition-table-row';

export function createFormGroupFromRow(
  fb: FormBuilder,
  row: DispositionTableRow
): FormGroup {
  return fb.group({
    [DispositionTableRowName.ARTICLE_ID]: [
      row[DispositionTableRowName.ARTICLE_ID],
    ],
    [DispositionTableRowName.SALES_REQUEST]: [
      row[DispositionTableRowName.SALES_REQUEST],
    ],
    [DispositionTableRowName.HELPER_COL]: [
      row[DispositionTableRowName.HELPER_COL],
    ],
    [DispositionTableRowName.STOCK_SAFETY]: [
      !row[DispositionTableRowName.STOCK_SAFETY]
        ? 0
        : row[DispositionTableRowName.STOCK_SAFETY],
      [nonNumericValidator, negativeNumberValidator],
    ],
    [DispositionTableRowName.STOCK_OLD]: [
      row[DispositionTableRowName.STOCK_OLD],
    ],
    [DispositionTableRowName.ORDERS_QUEUED]: [
      row[DispositionTableRowName.ORDERS_QUEUED],
    ],
    [DispositionTableRowName.ORDERS_ACTIVE]: [
      row[DispositionTableRowName.ORDERS_ACTIVE],
    ],
    [DispositionTableRowName.ORDERS_PROD]: [
      row[DispositionTableRowName.ORDERS_PROD],
    ],
  });
}

const negativeNumberValidator = (
  control: AbstractControl
): ValidationErrors | null => {
  const value = control.value;
  return !isNaN(value) && value < 0 ? { negativeNumber: true } : null;
};

const nonNumericValidator = (
  control: AbstractControl
): ValidationErrors | null => {
  const value = +control.value;
  return isNaN(+control.value) ? { nonNumeric: true } : null;
};
