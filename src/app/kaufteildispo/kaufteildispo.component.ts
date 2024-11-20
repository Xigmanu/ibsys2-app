import {Component, OnInit, Input, Inject} from '@angular/core';
import {FormGroup, FormControl, ReactiveFormsModule, FormBuilder, Validators, FormArray} from '@angular/forms';
import {CommonModule, NgIf} from '@angular/common';
import {
  dispoControlFormDefinition,
  KaufteilDispoControlFormDefinition,
  kaufteilDispoFormDef,
  KauftelidispoArt,
  mapJsonToFormControls
} from './kaufteildispo.util';
import {ClarityModule} from '@clr/angular';
import * as data from '../../assets/SortedData.json';

@Component({
  selector: 'app-kaufteildispo',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, ClarityModule, CommonModule],
  templateUrl: './kaufteildispo.component.html',
  styleUrl: './kaufteildispo.component.scss',
})
export class KaufteildispoComponent implements OnInit {
  private jsonData = data;
  ngOnInit(): void {
    const mappedData = mapJsonToFormControls(this.jsonData);
    const formArray = this.dispoForm.get('tableRows') as FormArray;
    for (const key in mappedData) {
      if (mappedData.hasOwnProperty(key)) {
        const formGroup = this.createFormGrp();
        formGroup.patchValue(mappedData[key]);
        formArray.push(formGroup);
      }
    }
  }
   public dispoForm:FormGroup;
   constructor(private fb: FormBuilder) {
     this.dispoForm = this.fb.group({
     tableRows: this.fb.array([],[Validators.required]),
     });
   }
   createFormGrp() :FormGroup{
   return this.fb.group({
       kaufteil: [''],
       frist: [''],
       abweichung: [''],
       diskontmenge: [''],
       verbrauch: [''],
       bestandAktuell: [''],
       lieferung: [''],
       lieferzeit: [''],
       benoetigteMenge: [''],
       bestellmenge: [''],
       bestelltyp: ['']
     });
   }
   get getFormControls(){
     const control = this.dispoForm.get('tableRows') as FormArray;
     return control;
   }
   addRow(){
     const control = this.dispoForm.get('tableRows') as FormArray;
     control.push(this.createFormGrp());
   }
}



