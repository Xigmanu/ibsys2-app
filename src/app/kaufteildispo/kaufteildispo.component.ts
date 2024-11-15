import {Component, OnInit, Input} from '@angular/core';
import {
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import {CommonModule, NgIf} from '@angular/common';
import {dispoControlForms, KaufteilDispoControlFormDefinition, KauftelidispoArt} from './kaufteildispo.util';
import {ClarityModule} from '@clr/angular';

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

  constructor() {
  }

  ngOnInit(): void {
    if (this.dispoDaten?.formGroup) {
      this.controlForms = dispoControlForms(this.dispoDaten.formGroup);
      this.initialerZustand = this.dispoDaten.formGroup.value;
    }
  }


  wiederherstellen() {
    if (this.initialerZustand) {
      this.dispoDaten?.formGroup.reset(this.initialerZustand);
    } else {
      console.error('Initial state is not defined');
    }
  }

  protected readonly KaufteildispoFormControl = KauftelidispoArt;
  /*
    myForm!: FormGroup;
    control: FormArray;
    mode: boolean;
    touchedRows: any;

    constructor(private fb: FormBuilder) {
    }

    ngOnInit() {
      this.touchedRows = [];
      this.myForm = this.fb.group({
        tableRows: this.fb.array([])
      });
      this.fb.group({
        kaufteil: [''],
        frist: [''],
        abweichung: [''],
        diskontmenge: [''],
        verbrauch: [''],
        bestandAktuell: [''],
        lieferung: [''],
        lieferzeit: [''],
        benötigteMenge: [''],
        bestellMenge: [''],
        bestellTyp: ['']
      })
    }

    onSubmit(form: FormGroup) {
      console.log('Valid?', form.valid); // true or false
      console.log('Name', form.value.name);
      console.log('Email', form.value.email);
      console.log('Message', form.value.message);
    }
  */

  protected readonly FormGroup = FormGroup;
  protected readonly KauftelidispoArt = KauftelidispoArt;
}
