import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ClarityModule } from '@clr/angular';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DataService, DataStructure, ForecastInput, ProductionValues, SellWishItem } from '../data.service';
import { ForecastArt } from '../kaufteildispo/kaufteildispo.util';
import { ProduktionsplanComponent } from '../produktionsplan/produktionsplan.component';

@Component({
  selector: 'app-direktverkauf',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ClarityModule, TranslateModule, ProduktionsplanComponent],
  templateUrl: './direktverkauf.component.html',
  styleUrl: './direktverkauf.component.css'
})
export class DirektverkaufComponent implements OnInit {
  tableForm: FormGroup;
  public forecastForm: FormGroup;
  data: DataStructure | null = null;

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef, private dataService: DataService) {
    const sellWishItems = this.dataService.getData()?.output?.sellWish?.items || [];
    this.tableForm = this.fb.group({
      rows: this.fb.array([]),
      vertriebswunschP1: [/*sellWishItems[0]?.quantity ?? '0', Validators.required*/],
      vertriebswunschP2: [sellWishItems[1]?.quantity ?? '0', Validators.required],
      vertriebswunschP3: [sellWishItems[2]?.quantity ?? '0', Validators.required],
    });
    this.forecastForm = this.fb.group({
      forecastRows: this.fb.array([], [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.data = this.dataService.getData();
    this.initializeTable();
    this.initializeForecastTable();
    console.log('Lade initiale Daten:', this.data);
  }

  ngOnDestroy(): void {
    this.saveData();
  }
  initializeTable() {
    const products = [1, 2, 3];
    products.forEach((product) => {
      this.addRow(product);
    });
    this.cdr.detectChanges();
  }

  addRow(product: number) {
    const sellDirectItems = this.dataService.getData()?.output?.sellDirect?.items || [];
    const row = this.fb.group({
      product: [product],
      menge: [sellDirectItems[product - 1]?.quantity ?? '0', Validators.required],
      preisProEinheit: [sellDirectItems[product - 1]?.price ?? '0', Validators.required],
      konventionalStrafe: [sellDirectItems[product - 1]?.penalty ?? '0', Validators.required],
    });
    this.rows.push(row);
  }

  get rows(): FormArray {
    return this.tableForm.get('rows') as FormArray;
  }

  isFormValid(): boolean {
    return this.tableForm.valid;
  }

  saveData() {
    const sellWishItems = [
      { article: 1, quantity: +this.forecastForm.get('forecastRows')?.value[0][ForecastArt.PERIODE_0]},
      { article: 2, quantity: +this.forecastForm.get('forecastRows')?.value[1][ForecastArt.PERIODE_0]},
      { article: 3, quantity: +this.forecastForm.get('forecastRows')?.value[2][ForecastArt.PERIODE_0]}
    ];

    const sellDirectItems = this.rows.controls.map(row => ({
      article: row.get('product')!.value,
      quantity: +row.get('menge')?.value,
      price: +row.get('preisProEinheit')?.value,
      penalty: +row.get('konventionalStrafe')?.value
    }));

    const forecastValues = this.extractForecastValues();
    this.dataService.setData({
      ...this.dataService.getData(),
      output: {
        ...this.dataService.getData().output,
        sellWish: { items: sellWishItems },
        sellDirect: { items: sellDirectItems }
      },
      decisions: {
        ...this.dataService.getData().decisions,
        forecast: forecastValues,
      },
    });
  }

  initializeForecastTable() {
    this.forecastRows.clear();
    const products = [1, 2, 3];
    products.forEach((product) => {
      this.addForeCastRow(product, );
    });
  }

  addForeCastRow(product: number, ) {
    const sellwishItem = this.getSellwishItem().find(item => item.article === product);
    const row = this.fb.group({
      [ForecastArt.PRODUKT]: [product],
      [ForecastArt.PERIODE_0]: [sellwishItem?.quantity ?? '0', Validators.required],
      [ForecastArt.PERIODE_1]: [this.data?.decisions?.forecast?.period2[`p${product}` as keyof ProductionValues] ?? '0'],
      [ForecastArt.PERIODE_2]: [this.data?.decisions?.forecast?.period3[`p${product}` as keyof ProductionValues] ?? '0'],
      [ForecastArt.PERIODE_3]: [this.data?.decisions?.forecast?.period4[`p${product}` as keyof ProductionValues] ?? '0'],
    });
    this.forecastRows.push(row);
  }

  get forecastRows(): FormArray {
    return this.forecastForm.get('forecastRows') as FormArray;
  }

  get getForecastControls() {
    const control = this.forecastForm.get('forecastRows') as FormArray;
    return control;
  }

  extractForecastValues(): ForecastInput {
    const forecastRows = this.forecastForm.get('forecastRows') as FormArray;

    const forecastValues: ForecastInput = {
      period2: { p1: 0, p2: 0, p3: 0 },
      period3: { p1: 0, p2: 0, p3: 0 },
      period4: { p1: 0, p2: 0, p3: 0 },
    };

    forecastRows.controls.forEach((control: AbstractControl) => {
      const row = control as FormGroup;

      const product = row.get(ForecastArt.PRODUKT)?.value;
      const period0 = +row.get(ForecastArt.PERIODE_1)?.value || 0;
      const period1 = +row.get(ForecastArt.PERIODE_2)?.value || 0;
      const period2 = +row.get(ForecastArt.PERIODE_3)?.value || 0;

      if (product === 1 || product === 2 || product === 3) {
        forecastValues.period2[`p${product}` as keyof ProductionValues] += period0;
        forecastValues.period3[`p${product}` as keyof ProductionValues] += period1;
        forecastValues.period4[`p${product}` as keyof ProductionValues] += period2;
      }
    });

    return forecastValues;
  }

  getSellwishItem(): SellWishItem[] {
    return this.dataService.getData()?.output?.sellWish?.items || [];
  }

  protected readonly ForecastArt = ForecastArt;
}
