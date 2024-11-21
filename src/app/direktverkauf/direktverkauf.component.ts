import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { ClarityModule } from '@clr/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-direktverkauf',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ClarityModule],
  templateUrl: './direktverkauf.component.html',
  styleUrl: './direktverkauf.component.css'
})
export class DirektverkaufComponent implements OnInit {
  tableForm: FormGroup;
  
  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef,) {
    this.tableForm = this.fb.group({
      rows: this.fb.array([]),
      vertriebswunschP1: [''],
      vertriebswunschP2: [''],
      vertriebswunschP3: ['']
    });
  }

  ngOnInit(): void {
    this.initializeTable();
  }

  initializeTable() {
    const products = ['P1', 'P2', 'P3'];
    products.forEach((product) => {
      this.addRow(product);
    });
    this.cdr.detectChanges();
  }

  addRow(product: string) {
    const row = this.fb.group({
      product: [product],
      menge: [''],
      preisProEinheit: [''],
      konventionalStrafe: ['']
    });
    this.rows.push(row);
  }

  get rows(): FormArray {
    return this.tableForm.get('rows') as FormArray;
  }

  saveData() {
    const sellWishItems = [
      { article: 1, quantity: +this.tableForm.value.vertriebswunschP1 },
      { article: 2, quantity: +this.tableForm.value.vertriebswunschP2 },
      { article: 3, quantity: +this.tableForm.value.vertriebswunschP3 }
    ];

    const sellDirectItems = this.rows.controls.map(row => ({
      article: row.get('product')?.value,
      quantity: +row.get('menge')?.value,
      price: +row.get('preisProEinheit')?.value,
      penalty: +row.get('konventionalStrafe')?.value
    }));

    console.log('Daten gespeichert:', sellWishItems, sellDirectItems);
  }
}