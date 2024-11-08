import { FormArray, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

export interface TableRow {
  kaufteilnummer: number;
  lieferfrist: number;
  abweichung: number;
  diskontm: number;
  perioden: number[];
  gesamtverbrauch: number;
  aktuellerBestand: number;
  lieferung: number;
  zeitpunkt: string;
  benötigteMenge: number;
  bestellung: number;
  typ: string;
}

@Component({
  selector: 'app-kaufteildispo',
  templateUrl: './kaufteildispo.html',
})
export class KaufteildispoComponent implements OnInit {
  tableForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.tableForm = this.fb.group({
      rows: this.fb.array(this.initializeRows().map(row => this.createRowForm(row)))
    });
  }

  ngOnInit(): void {
    this.rows.controls.forEach((row, index) => {
      (row.get('perioden') as FormArray).valueChanges.subscribe(() => {
        this.onPeriodChange(index);
      });
    });
  }

  initializeRows(): TableRow[] {
    return [
      {
        kaufteilnummer: 21,
        lieferfrist: 1.8,
        abweichung: 0.4,
        diskontm: 300,
        perioden: [200, 200, 250, 250, 200],
        gesamtverbrauch: 900,
        aktuellerBestand: 1080,
        lieferung: 300,
        zeitpunkt: '5-2-0-0',
        benötigteMenge: -180,
        bestellung: 300,
        typ: 'N'
      }
    ];
  }

  createRowForm(row: TableRow): FormGroup {
    return this.fb.group({
      kaufteilnummer: [row.kaufteilnummer],
      lieferfrist: [row.lieferfrist],
      abweichung: [row.abweichung],
      diskontm: [row.diskontm],
      perioden: this.fb.array(row.perioden.map(period => new FormControl(period))),
      gesamtverbrauch: [row.gesamtverbrauch],
      aktuellerBestand: [row.aktuellerBestand],
      lieferung: [row.lieferung],
      zeitpunkt: [row.zeitpunkt],
      benötigteMenge: [row.benötigteMenge],
      bestellung: [row.bestellung],
      typ: [row.typ]
    });
  }

  get rows(): FormArray {
    return this.tableForm.get('rows') as FormArray;
  }

  onPeriodChange(rowIndex: number) {
    const row = this.rows.at(rowIndex) as FormGroup;
    const perioden = row.get('perioden')?.value as number[];
    const gesamtverbrauch = perioden.reduce((acc, value) => acc + value, 0);
    row.patchValue({ gesamtverbrauch });
  }
}
