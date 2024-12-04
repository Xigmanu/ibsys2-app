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
  KauftelidispoArt,
  mapDataToFormControls
} from './kaufteildispo.util';
import {ClarityModule} from '@clr/angular';
import * as data from '../../assets/SortedData.json';
import {DataService} from '../data.service';

@Component({
  selector: 'app-kaufteildispo',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, ClarityModule, CommonModule,],
  templateUrl: './kaufteildispo.component.html',
  styleUrl: './kaufteildispo.component.scss',
})
export class KaufteildispoComponent implements OnInit {
  private jsonData = data;
  public dispoForm: FormGroup;
  private mappedData: any;
  public metaData: any;

  constructor(private fb: FormBuilder,
              private dataService: DataService) {
    this.dispoForm = this.fb.group({
      tableRows: this.fb.array([], [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.metaData = this.dataService.getData();
    this.mappedData = mapDataToFormControls(this.jsonData, this.dataService, this.dispoForm, this.metaData.input.metaData,this.metaData.output);
    const formArray = this.dispoForm.get('tableRows') as FormArray;
    for (const key in this.mappedData) {
      if (this.mappedData.hasOwnProperty(key)) {
        const formGroup = this.createFormGrp();
        formGroup.patchValue(this.mappedData[key]);
        formArray.push(formGroup);
      }
    }
    this.subscribeToFormChanges();
  }

  createFormGrp(): FormGroup {
    return this.fb.group({
      [KauftelidispoArt.KAUFTEIL]: [''],
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

  addRow() {
    const control = this.dispoForm.get('tableRows') as FormArray;
    control.push(this.createFormGrp());
  }

  setFormGroup(formGroup: FormGroup): void {
    this.dispoForm = formGroup;
  }

  getFormGroup(): FormGroup {
    return this.dispoForm;
  }

  protected readonly data = data;
  protected readonly KauftelidispoArt = KauftelidispoArt;

  private subscribeToFormChanges(): void {
    const formArray = this.dispoForm.get('tableRows') as FormArray;
    formArray.controls.forEach((control: AbstractControl) => {
      const group = control as FormGroup;
      group.get(KauftelidispoArt.BESTELLTYP)?.valueChanges.subscribe(() => {
        console.log('Bestelltyp changed' + group.get(KauftelidispoArt.BESTELLTYP)?.value);
        const bestelltyp = group.get(KauftelidispoArt.BESTELLTYP)?.value;
        console.log('Bestelltyp changed' + bestelltyp);
        const frist = group.get(KauftelidispoArt.FRIST)?.value;
        const kaufteil = group.get(KauftelidispoArt.KAUFTEIL)?.value;
        group.get(KauftelidispoArt.BESTELLUNG_LIEFERTERMIN)?.setValue(
          getBestellLiefertermin(this.metaData, frist, bestelltyp),
          {emitEvent: false});
        this.saveData();
      });
    });
  }

  get rows(): FormArray {
    return this.dispoForm.get('rows') as FormArray;
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

}

export function bestellmengeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const group = control as FormGroup;
    const modus = group.get(KauftelidispoArt.BESTELLTYP)?.value;
    const bestellmenge = group.get(KauftelidispoArt.BESTELLMENGE)?.value;
    return modus && !bestellmenge ? {bestellmengeRequired: true} : null;
  };

}
