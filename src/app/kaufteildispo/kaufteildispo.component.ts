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
  getBestellLiefertermin,
  KaufteildispoArt,
  mapDataToFormControls,
  calculateBenoetigteMenge, findExceedingPeriod,
} from './kaufteildispo.util';
import {ClarityModule} from '@clr/angular';
import * as data from '../../assets/SortedData.json';
import {DataService, Output, SellWishItem} from '../data.service';
import {ProduktionsplanComponent} from '../produktionsplan/produktionsplan.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-kaufteildispo',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, ClarityModule, CommonModule, ProduktionsplanComponent, RouterModule, TranslateModule,],
  templateUrl: './kaufteildispo.component.html',
  styleUrl: './kaufteildispo.component.scss',
})
export class KaufteildispoComponent implements OnInit {
  private jsonData = data;
  public dispoForm: FormGroup;
  public dataServiceData: any;
  private mappedData: any;
  protected readonly data = data;
  protected readonly KauftelidispoArt = KaufteildispoArt;
  constructor(private fb: FormBuilder,
              private dataService: DataService) {
    this.dispoForm = this.fb.group({
      tableRows: this.fb.array([], [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.dataServiceData = this.dataService.getData();
    this.mappedData = mapDataToFormControls(this.jsonData, this.dataService, this.dispoForm, this.dataServiceData.input.metaData, this.dataServiceData.output);
    const formArray = this.dispoForm.get('tableRows') as FormArray;
    this.populateFormArrays(this.mappedData, this.dispoForm, this.dataService);
    this.subscribeToFormChanges();
    console.log("!!!!!",this.mappedData);
    console.log("!!!!!",this.dispoForm);
  }
  ngOnDestroy(): void {
    this.saveData();
  }
  createDispoFormGrp(mappedItem:any, modus: string, bestellmenge: number): FormGroup {
    const benoetigteMenge = calculateBenoetigteMenge(
      mappedItem[KaufteildispoArt.VERBRAUCH_PROGNOSE_GES],
      mappedItem[KaufteildispoArt.BESTAND_AKTUELL],
      mappedItem[KaufteildispoArt.EINGEHENDELIEFERUNG]
    );

    const exceedingPeriod = findExceedingPeriod(
      {
        period2: mappedItem[KaufteildispoArt.VERBRAUCH_PROGNOSE_1],
        period3: mappedItem[KaufteildispoArt.VERBRAUCH_PROGNOSE_2],
        period4: mappedItem[KaufteildispoArt.VERBRAUCH_PROGNOSE_3]
      },
      mappedItem[KaufteildispoArt.BESTAND_AKTUELL],
      mappedItem[KaufteildispoArt.EINGEHENDELIEFERUNG],
      mappedItem[KaufteildispoArt.ANKUNFTSZEIT_EINGEHEND]
    );
    console.log(`Exceeding period for item ${mappedItem[KaufteildispoArt.KAUFTEIL]}: ${exceedingPeriod}`);

    return this.fb.group({
      [KaufteildispoArt.KAUFTEIL]: [],
      [KaufteildispoArt.FRIST]: [''],
      [KaufteildispoArt.ABWEICHUNG]: [''],
      [KaufteildispoArt.DISKONTMENGE]: [''],
      [KaufteildispoArt.VERBRAUCH_AKTUELL]: [''],
      [KaufteildispoArt.VERBRAUCH_PROGNOSE_1]: [''],
      [KaufteildispoArt.VERBRAUCH_PROGNOSE_2]: [''],
      [KaufteildispoArt.VERBRAUCH_PROGNOSE_3]: [''],
      [KaufteildispoArt.VERBRAUCH_PROGNOSE_GES]: [''],
      [KaufteildispoArt.BESTAND_AKTUELL]: [''],
      [KaufteildispoArt.EINGEHENDELIEFERUNG]: [''],
      [KaufteildispoArt.ANKUNFTSZEIT_EINGEHEND]: [''],
      [KaufteildispoArt.BENOETIGTE_MENGE]: [benoetigteMenge],
      [KaufteildispoArt.BESTELLUNG_LIEFERTERMIN]: [''],
      [KaufteildispoArt.BESTELLMENGE]: [bestellmenge,[Validators.pattern('^[0-9]+$')]],
      [KaufteildispoArt.BESTELLTYP]: [modus, [Validators.pattern('^[A-Z]+$')]],
    }, {validators: bestellmengeValidator()});
  }

  get getFormControls() {
    const control = this.dispoForm.get('tableRows') as FormArray;
    return control;
  }

  private subscribeToFormChanges(): void {
    const formArray = this.dispoForm.get('tableRows') as FormArray;
    formArray.controls.forEach((control: AbstractControl) => {
      const group = control as FormGroup;
      group.get(KaufteildispoArt.BESTELLTYP)?.valueChanges.subscribe(() => {
        const bestelltyp = group.get(KaufteildispoArt.BESTELLTYP)?.value;
        const frist = group.get(KaufteildispoArt.FRIST)?.value;
        group.get(KaufteildispoArt.BESTELLUNG_LIEFERTERMIN)?.setValue(
          getBestellLiefertermin(this.dataServiceData.input.metaData, frist, bestelltyp),
          {emitEvent: false}
        );
        this.saveData();
      });
    });
  }
private populateFormArrays(mappedData: any, dispoForm: FormGroup, dataService: DataService): void {
    const formArray = dispoForm.get('tableRows') as FormArray;
    formArray.clear();
    for (const key in mappedData) {
      if (mappedData.hasOwnProperty(key)) {
        const order = dataService.getData().output.orderList.orders.find((order: any) => order.article === key);
        let modus = '';
        if (order?.modus === 5) {
          modus = 'N';
        } else if (order?.modus === 1) {
          modus = 'E';
        }
        const formGroup = this.createDispoFormGrp(
          mappedData[key], modus, order?.quantity||0);
        formGroup.patchValue(mappedData[key]);
        formArray.push(formGroup);
      }
    }
  }
  saveData() {
    const formArray = this.dispoForm.get('tableRows') as FormArray;
    const outputDataToSave = formArray.controls.map((control: AbstractControl) => {
      const group = control as FormGroup;
      const modus = group.get(KaufteildispoArt.BESTELLTYP)?.value;
      let modusValue = modus;

      if (modus === 'N') {
        modusValue = 5;
      } else if (modus === 'E') {
        modusValue = 1;
      }
      return {
        article: group.get(KaufteildispoArt.KAUFTEIL)?.value,
        quantity: group.get(KaufteildispoArt.BESTELLMENGE)?.value,
        modus: modusValue,
      };
    });

    this.dataService.setData({
      ...this.dataService.getData(),
      output: {
        ...this.dataService.getData().output,
        orderList: {orders: outputDataToSave}
      }
    });

    console.log('Data saved to DataService:', this.dataService.getData());
  }

}

export function bestellmengeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const group = control as FormGroup;
    const modus = group.get(KaufteildispoArt.BESTELLTYP)?.value;
    const bestellmenge = group.get(KaufteildispoArt.BESTELLMENGE)?.value;
    return modus && !bestellmenge ? {bestellmengeRequired: true} : null;
  };
}
