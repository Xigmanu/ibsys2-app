import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import {
  DataService,
  DataStructure,
  ForecastInput,
  ProductionInput,
  ProductionValues,
} from '../data.service';

@Component({
  selector: 'app-produktionsplan',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ClarityModule, TranslateModule],
  templateUrl: './produktionsplan.component.html',
  styleUrl: './produktionsplan.component.scss',
})
export class ProduktionsplanComponent implements OnInit, OnDestroy {
  tableForm: FormGroup;
  data: DataStructure | null = null;

  constructor(private fb: FormBuilder, private dataService: DataService) {
    const forecastProductionValue =
      this.dataService.getData()?.decisions?.production || [];
    const productionValues =
      this.dataService.getData()?.output?.productionList.productions || [];
    this.tableForm = this.fb.group({
      rows: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.data = this.dataService.getData();
    this.initializeTable();
  }
  ngOnDestroy(): void {
    this.saveData();
  }
  initializeTable() {
    const products = [1, 2, 3];
    products.forEach((product) => {
      this.addRow(product);
    });
  }
  addRow(product: number) {
    const productionList = this.getProductList().find(
      (item) => item.article === product
    );
    const row = this.fb.group({
      [ProduktionsArt.PRODUKT]: [product],
      [ProduktionsArt.PERIODE_0]: [
        this.data?.output?.productionList?.productions[product - 1]?.quantity ??
          '0',
      ],
      [ProduktionsArt.PERIODE_1]: [
        this.data?.decisions?.production?.period2[
          `p${product}` as keyof ProductionValues
        ] ?? '0',
      ],
      [ProduktionsArt.PERIODE_2]: [
        this.data?.decisions?.production?.period3[
          `p${product}` as keyof ProductionValues
        ] ?? '0',
      ],
      [ProduktionsArt.PERIODE_3]: [
        this.data?.decisions?.production?.period4[
          `p${product}` as keyof ProductionValues
        ] ?? '0',
      ],
    });
    this.Rows.push(row);
  }
  get Rows() {
    return this.tableForm.get('rows') as FormArray;
  }
  saveData() {
    this.dataService.setProductionListArticle(
      1,
      this.tableForm.get('rows')?.value[0][ProduktionsArt.PERIODE_0]
    );
    this.dataService.setProductionListArticle(
      2,
      this.tableForm.get('rows')?.value[1][ProduktionsArt.PERIODE_0]
    );
    this.dataService.setProductionListArticle(
      3,
      this.tableForm.get('rows')?.value[2][ProduktionsArt.PERIODE_0]
    );
    const forecastProduction = this.extractProductionValues();
    this.dataService.setData({
      ...this.dataService.getData(),
      decisions: {
        ...this.dataService.getData()?.decisions,
        production: forecastProduction,
      },
      /*productionList.forEach(item => {
      if (item.article !== undefined) {
        this.dataService.setProductionListArticle(item.article, item.quantity);
      }
    });*/
    });
  }
  extractProductionValues(): ProductionInput {
    const rows = this.tableForm.get('rows') as FormArray;

    const planningValues: ProductionInput = {
      period2: { p1: 0, p2: 0, p3: 0 },
      period3: { p1: 0, p2: 0, p3: 0 },
      period4: { p1: 0, p2: 0, p3: 0 },
    };

    rows.controls.forEach((control: AbstractControl) => {
      const row = control as FormGroup;

      const product = row.get(ProduktionsArt.PRODUKT)?.value;
      const period0 = +row.get(ProduktionsArt.PERIODE_1)?.value || 0;
      const period1 = +row.get(ProduktionsArt.PERIODE_2)?.value || 0;
      const period2 = +row.get(ProduktionsArt.PERIODE_3)?.value || 0;

      if (product === 1 || product === 2 || product === 3) {
        planningValues.period2[`p${product}` as keyof ProductionValues] +=
          period0;
        planningValues.period3[`p${product}` as keyof ProductionValues] +=
          period1;
        planningValues.period4[`p${product}` as keyof ProductionValues] +=
          period2;
      }
    });

    return planningValues;
  }
  getProductList() {
    return (
      this.dataService.getData()?.output?.productionList?.productions || []
    );
  }
  protected readonly ProduktionsArt = ProduktionsArt;
}
export enum ProduktionsArt {
  PRODUKT = 'Produkt',
  PERIODE_0 = 'Diese Periode',
  PERIODE_1 = 'Periode 1',
  PERIODE_2 = 'Periode 2',
  PERIODE_3 = 'Periode 3',
}
