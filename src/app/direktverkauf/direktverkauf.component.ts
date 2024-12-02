import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ClarityModule } from '@clr/angular';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DataService, DataStructure } from '../data.service'; 

@Component({
  selector: 'app-direktverkauf',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ClarityModule, TranslateModule],
  templateUrl: './direktverkauf.component.html',
  styleUrl: './direktverkauf.component.css'
})
export class DirektverkaufComponent implements OnInit {
  tableForm: FormGroup;
  data: DataStructure | null = null;
  
  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef, private dataService: DataService) {
    const sellWishItems = this.dataService.getData()?.output?.sellWish?.items || [];
    this.tableForm = this.fb.group({
      rows: this.fb.array([]),
      vertriebswunschP1: [sellWishItems[0]?.quantity ?? '0', Validators.required],
      vertriebswunschP2: [sellWishItems[1]?.quantity ?? '0', Validators.required],
      vertriebswunschP3: [sellWishItems[2]?.quantity ?? '0', Validators.required],
    });
  }

  ngOnInit(): void {
    this.initializeTable();
    this.data = this.dataService.getData();
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
      menge: [sellDirectItems[product-1]?.quantity ?? '0', Validators.required], 
      preisProEinheit: [sellDirectItems[product-1]?.price ?? '0', Validators.required], 
      konventionalStrafe: [sellDirectItems[product-1]?.penalty ?? '0', Validators.required],
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
      { article: 1, quantity: +this.tableForm.value.vertriebswunschP1 },
      { article: 2, quantity: +this.tableForm.value.vertriebswunschP2 },
      { article: 3, quantity: +this.tableForm.value.vertriebswunschP3 }
    ];

    const sellDirectItems = this.rows.controls.map(row => ({
      article: row.get('product')!.value,
      quantity: +row.get('menge')?.value,
      price: +row.get('preisProEinheit')?.value,
      penalty: +row.get('konventionalStrafe')?.value
    }));

    this.dataService.setData({
      ...this.dataService.getData(),
      output: {
        ...this.dataService.getData().output,
        sellWish: { items: sellWishItems },
        sellDirect: { items: sellDirectItems }
      }
    });
  }
}