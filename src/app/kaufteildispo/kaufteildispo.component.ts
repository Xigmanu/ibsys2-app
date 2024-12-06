import {Component, OnInit, Input, Inject} from '@angular/core';
import {
  FormGroup,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormArray,
  AbstractControl, ValidationErrors, ValidatorFn
} from '@angular/forms';
import {CommonModule, NgIf} from '@angular/common';
import {
  getSellwishItem,
  ForecastArt,
  getBestellLiefertermin,
  KauftelidispoArt,
  mapDataToFormControls
} from './kaufteildispo.util';
import {ClarityModule} from '@clr/angular';
import * as data from '../../assets/SortedData.json';
import {DataService, Output, SellWishItem} from '../data.service';
import {ProduktionsplanComponent} from '../produktionsplan/produktionsplan.component';

@Component({
  selector: 'app-kaufteildispo',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, ClarityModule, CommonModule, ProduktionsplanComponent,],
  templateUrl: './kaufteildispo.component.html',
  styleUrl: './kaufteildispo.component.scss',
})
export class KaufteildispoComponent implements OnInit {
  private jsonData = data;
  public dispoForm: FormGroup;
  public forecastForm: FormGroup;
  public dataServiceData: any;
  private mappedData: any;
  protected readonly data = data;
  protected readonly KauftelidispoArt = KauftelidispoArt;

  constructor(private fb: FormBuilder,
              private dataService: DataService) {
    this.dispoForm = this.fb.group({
      tableRows: this.fb.array([], [Validators.required]),
    });
    this.forecastForm = this.fb.group({
      forecastRows: this.fb.array([], [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.dataServiceData = this.dataService.getData();
    this.initializeTable();
    this.mappedData = mapDataToFormControls(this.jsonData, this.dataService, this.dispoForm, this.forecastForm, this.dataServiceData.input.metaData, this.dataServiceData.output);
    const formArray = this.dispoForm.get('tableRows') as FormArray;
    const forecastArray = this.forecastForm.get('forecastRows') as FormArray;
    this.populateFormArrays(this.mappedData, this.dispoForm, this.forecastForm);
    this.subscribeToFormChanges();
  }
  initializeTable() {
    const products = [1, 2, 3];
    products.forEach((product) => {
      this.addForeCastRow(product);
    });
  }
  addForeCastRow(product: number) {
    const row = this.fb.group({
      [ForecastArt.PRODUKT]: [product],
      [ForecastArt.PERIODE_0]: [getSellwishItem(product,this.dataServiceData?.output)?.quantity ?? '0', Validators.required],
      [ForecastArt.PERIODE_1]: ['0'],
      [ForecastArt.PERIODE_2]: ['0'],
      [ForecastArt.PERIODE_3]: ['0'],
    });
    this.forecastRows.push(row);
  }

  createDispoFormGrp(): FormGroup {
    return this.fb.group({
      [KauftelidispoArt.KAUFTEIL]: [],
      [KauftelidispoArt.FRIST]: [''],
      [KauftelidispoArt.ABWEICHUNG]: [''],
      [KauftelidispoArt.DISKONTMENGE]: [''],
      [KauftelidispoArt.VERBRAUCH_AKTUELL]: [''],
      [KauftelidispoArt.BESTAND_AKTUELL]: [''],
      [KauftelidispoArt.EINGEHENDELIEFERUNG]: [''],
      [KauftelidispoArt.ANKUNFTSZEIT_EINGEHEND]: [''],
      [KauftelidispoArt.BENOETIGTE_MENGE]: [''],
      [KauftelidispoArt.BESTELLUNG_LIEFERTERMIN]: [''],
      [KauftelidispoArt.BESTELLMENGE]: [''],
      [KauftelidispoArt.BESTELLTYP]: ['', [Validators.pattern('^[0-9]+$')]],
    }, {validators: bestellmengeValidator()});
  }

  get getFormControls() {
    const control = this.dispoForm.get('tableRows') as FormArray;
    return control;
  }
  get getForecastControls() {
    const control = this.forecastForm.get('forecastRows') as FormArray;
    return control;
  }

  addRow() {
    const control = this.dispoForm.get('tableRows') as FormArray;
    control.push(this.createDispoFormGrp());
  }

  setFormGroup(formGroup: FormGroup): void {
    this.dispoForm = formGroup;
  }

  getFormGroup(): FormGroup {
    return this.dispoForm;
  }
  get rows(): FormArray {
    return this.dispoForm.get('tableRows') as FormArray;
  }
  get forecastRows(): FormArray {
    return this.forecastForm.get('forecastRows') as FormArray;
  }

  private subscribeToFormChanges(): void {
    const formArray = this.dispoForm.get('tableRows') as FormArray;
    const forecastArray = this.forecastForm.get('forecastRows') as FormArray;
    formArray.controls.forEach((control: AbstractControl) => {
      const group = control as FormGroup;
      group.get(KauftelidispoArt.BESTELLTYP)?.valueChanges.subscribe(() => {
        console.log('Bestelltyp changed' + group.get(KauftelidispoArt.BESTELLTYP)?.value);
        const bestelltyp = group.get(KauftelidispoArt.BESTELLTYP)?.value;
        console.log('Bestelltyp changed' + bestelltyp);
        const frist = group.get(KauftelidispoArt.FRIST)?.value;
        const kaufteil = group.get(KauftelidispoArt.KAUFTEIL)?.value;
        group.get(KauftelidispoArt.BESTELLUNG_LIEFERTERMIN)?.setValue(
          getBestellLiefertermin(this.dataServiceData.input.metaData, frist, bestelltyp),
          {emitEvent: false});
        this.saveData();
        this.populateFormArrays(this.mappedData, this.dispoForm, this.forecastForm);
      });
    });
    forecastArray.controls.forEach((control: AbstractControl) => {
      const group = control as FormGroup;
      group.get(ForecastArt.PERIODE_1)?.valueChanges.subscribe(() => {
        this.mappedData = mapDataToFormControls(this.jsonData, this.dataService, this.dispoForm, this.forecastForm, this.dataServiceData.input.metaData, this.dataServiceData.output)
        console.log('Forecast changed' + group.get(ForecastArt.PERIODE_0)?.value);
        this.saveData();
      });
    });
  }
  private populateFormArrays(mappedData: any, dispoForm: FormGroup, forecastForm: FormGroup): void {
    const formArray = dispoForm.get('tableRows') as FormArray;
    const forecastArray = forecastForm.get('forecastRows') as FormArray;
    for (const key in mappedData) {
      if (mappedData.hasOwnProperty(key)) {
        const formGroup = this.createDispoFormGrp();
        formGroup.patchValue(mappedData[key]);
        formArray.push(formGroup);
      }
    }
  }
  saveData() {
    const formArray = this.dispoForm.get('tableRows') as FormArray;
    const dataToSave = formArray.controls.map((control: AbstractControl) => {
      const group = control as FormGroup;
      return {
        article: group.get(KauftelidispoArt.KAUFTEIL)?.value,
        quantity: group.get(KauftelidispoArt.BESTELLMENGE)?.value,
        modus: group.get(KauftelidispoArt.BESTELLTYP)?.value,
      };
    });

    this.dataService.setData({
      ...this.dataService.getData(),
      output: {
        ...this.dataService.getData().output,
        orderList: {orders: dataToSave}
      }
    });

    console.log('Data saved to DataService:', this.dataService.getData());
  }

  protected readonly ForecastArt = ForecastArt;
}

export function bestellmengeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const group = control as FormGroup;
    const modus = group.get(KauftelidispoArt.BESTELLTYP)?.value;
    const bestellmenge = group.get(KauftelidispoArt.BESTELLMENGE)?.value;
    return modus && !bestellmenge ? {bestellmengeRequired: true} : null;
  };
}
