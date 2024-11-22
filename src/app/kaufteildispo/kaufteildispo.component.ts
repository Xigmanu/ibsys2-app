import {Component, OnInit, Input, Inject} from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormArray,
  AbstractControl
} from '@angular/forms';
import {CommonModule, NgIf} from '@angular/common';
import {mapJsonToFormControls, mapServiceDataToFormControls, KauftelidispoArt} from './kaufteildispo.util';
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

  constructor(private fb: FormBuilder,
              private dataService: DataService) {
    this.dispoForm = this.fb.group({
      tableRows: this.fb.array([], [Validators.required]),
    });
  }

  ngOnInit(): void {
    const mappedData = mapJsonToFormControls(this.jsonData);
    const mappedServiceData = mapServiceDataToFormControls(this.dataService);
    const formArray = this.dispoForm.get('tableRows') as FormArray;
    for (const key in mappedData) {
      if (mappedData.hasOwnProperty(key)) {
        const formGroup = this.createFormGrp();
        formGroup.patchValue(mappedData[key]);
        formArray.push(formGroup);
      }
    }
  }

  public dispoForm: FormGroup;

  createFormGrp(): FormGroup {
    return this.fb.group({
      [KauftelidispoArt.KAUFTEIL]: [''],
      [KauftelidispoArt.FRIST]: [''],
      [KauftelidispoArt.ABWEICHUNG]: [''],
      [KauftelidispoArt.DISKONTMENGE]: [''],
      [KauftelidispoArt.VERBRAUCH]: [''],
      [KauftelidispoArt.BESTAND_AKTUELL]: [''],
      [KauftelidispoArt.EINGEHENDELIEFERUNG]: [''],
      [KauftelidispoArt.ANKUNFTSZEIT]: [''],
      [KauftelidispoArt.BENOETIGTE_MENGE]: [''],
      [KauftelidispoArt.BESTELLMENGE]: [''],
      [KauftelidispoArt.BESTELLTYP]: ['']
    });
  }

  get getFormControls() {
    const control = this.dispoForm.get('tableRows') as FormArray;
    return control;
  }

  addRow() {
    const control = this.dispoForm.get('tableRows') as FormArray;
    control.push(this.createFormGrp());
  }

  protected readonly data = data;
  protected readonly KauftelidispoArt = KauftelidispoArt;
}



