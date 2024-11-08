import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { ClarityModule } from '@clr/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-prognose-direktverkauf',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ClarityModule],
  templateUrl: './prognose-direktverkauf.component.html',
  styleUrl: './prognose-direktverkauf.component.css'
})
export class PrognoseDirektverkaufComponent implements OnInit{
  tableForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.tableForm = this.fb.group({
      rows: this.fb.array([]),
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
  }

  addRow(product: string) {
    const row = this.fb.group({
      product: [product],
      periods: this.fb.array([this.fb.control(''), this.fb.control(''), this.fb.control(''), this.fb.control('')]),
    });
    this.rows.push(row);
  }

  get rows(): FormArray {
    return this.tableForm.get('rows') as FormArray;
  }

  getPeriods(rowIndex: number): FormArray {
    return this.rows.at(rowIndex).get('periods') as FormArray;
  }
}