import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { dispoControlForms, KaufteilDispoControlFormDefinition, KauftelidispoArt, mapJsonToFormControls } from './kaufteildispo.util';
import { ClarityModule } from '@clr/angular';
import * as data from '../../assets/SortedData.json';

@Component({
  selector: 'app-kaufteildispo',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, ClarityModule, CommonModule],
  templateUrl: './kaufteildispo.component.html',
  styleUrl: './kaufteildispo.component.scss',
})
export class KaufteildispoComponent implements OnInit {
  @Input() dispoDaten: { formGroup: FormGroup } = { formGroup: new FormGroup({}) };
  protected controlForms: KaufteilDispoControlFormDefinition[] | undefined;
  protected initialerZustand: any;
  private jsonData = data;

  ngOnInit(): void {
    const mappedData = mapJsonToFormControls(this.jsonData);
      if (this.dispoDaten?.formGroup) {
      this.controlForms = dispoControlForms(this.dispoDaten.formGroup,mappedData);
      this.initialerZustand = this.dispoDaten.formGroup.value;
    }

  }
    /*   const mappedData = mapJsonToFormControls(this.jsonData);

    // Initialize form controls
    const formGroupConfig: any = {};
    for (const key in mappedData) {
      if (mappedData.hasOwnProperty(key)) {
        Object.keys(KauftelidispoArt).forEach((art) => {
          const formControlName = `${key}_${KauftelidispoArt[art as keyof typeof KauftelidispoArt]}`;
          formGroupConfig[formControlName] = new FormControl();
        });
      }
    }

    this.dispoDaten.formGroup = new FormGroup(formGroupConfig);

    // Set values for form controls
    for (const key in mappedData) {
      if (mappedData.hasOwnProperty(key)) {
        Object.keys(KauftelidispoArt).forEach((art) => {
          const formControlName = `${key}_${KauftelidispoArt[art as keyof typeof KauftelidispoArt]}`;
          this.dispoDaten.formGroup.get(formControlName)?.setValue(mappedData[key][KauftelidispoArt[art as keyof typeof KauftelidispoArt]]);
        });
      }
    }

    this.controlForms = dispoControlForms(this.dispoDaten.formGroup);
    this.initialerZustand = this.dispoDaten.formGroup.value;
  }
  wiederherstellen() {
    if (this.initialerZustand) {
      this.dispoDaten?.formGroup.reset(this.initialerZustand);
    } else {
      console.error('Initial state is not defined');
    }
  }*/
  protected readonly KauftelidispoArt = KauftelidispoArt;
}
