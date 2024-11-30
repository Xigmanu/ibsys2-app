import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { DataService, DataStructure, Production } from '../data.service';
import { ClarityModule } from '@clr/angular';
import { CommonModule } from '@angular/common';
import capacityDataJson from '../../assets/CapacityData.json';

interface Arbeitsplatz {
  Bearbeitungszeit: number | null;
  Rüstzeit: number | null;
}

interface CapacityEntry {
  Typ: string;
  Nr: string;
  Bezeichnung: string;
  Verwendung: string | null;
  Startmenge: number;
  Startpreis: string;
  Lieferkosten: string | null;
  Lieferzeit: string | null;
  Lieferzeitabweichung: string | null;
  Arbeitsplatz: Record<string, Arbeitsplatz>;
}

@Component({
  selector: 'capacity-plan',
  templateUrl: './capacity-plan.component.html',
  styleUrls: ['./capacity-plan.component.scss'],
  standalone: true,
  imports: [ClarityModule, CommonModule],
})
export class CapacityPlanComponent implements OnInit {
  constructor(private fb: FormBuilder, private dataService: DataService) {}

  items = [
    'E4',
    'E5',
    'E6',
    'E7',
    'E8',
    'E9',
    'E10',
    'E11',
    'E12',
    'E13',
    'E14',
    'E15',
    'E16',
    'E17',
    'E18',
    'E19',
    'E20',
    'E26',
    'E49',
    'E54',
    'E29',
    'E50',
    'E55',
    'E30',
    'E51',
    'E56',
    'E31',
    'P1',
    'P2',
    'P3',
  ];
  bezeichnungen = [
    "Hinterrad", "", "",
    "Vorderrad", "", "",
    "Schutzblech hinten", "", "",
    "Schutzblech vorne", "", "",
    "Lenker",
    "Sattel",
    "Rahmen", "", "",
    "Pedale",
    "Vorderrad komplett (cpl)", "", "",
    "Rahmen und Räder", "", "",
    "Fahrrad ohne Pedale", "", "",
    "Fahrrad komplett (cpl)", "", "",
  ];
  werte = [
    "K", "D", "H",
    "K", "D", "H",
    "K", "D", "H",
    "K", "D", "H",
    "KDH",
    "KDH",
    "K", "D", "H",
    "KDH",
    "K", "D", "H",
    "K", "D", "H",
    "K", "D", "H",
    "K", "D", "H",
  ];
  kapazitaetsbedarfNeu: any[]  = []
  ruestzeitNeu: any[]  = []
  kapazitaetsbedarfAlt: any[] = []
  ruestzeitAlt: any[] = []
  gesamtKapazitaet: any[] = []


  productionArray: string[][] = [];
  productionForm: FormGroup = new FormGroup({});
  capacityData: Record<string, CapacityEntry> = capacityDataJson;

  ngOnInit() {

    this.productionForm = this.fb.group({
      productionlist: new FormControl(''),
      rustzeit: new FormControl(''),
      warteschlange: new FormControl(''),
      summeKapazitaet: new FormControl(''),
    });
    this.updateProductionArray();
  }

  updateProductionArray() {
    this.resetTable();
    const data = this.dataService.getData();
    const productions = data.output.productionList.productions;
    for (let i = 0; i < this.items.length; i++) {
      const articleNumber = parseInt(this.items[i].substring(1));
      let row: any[] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
      
      productions.forEach((production) => { 
      
        if (production.article === articleNumber) {
          row = this.updateRow(row, production);
        }
      })
     
      
      row.unshift(this.items[i]);
      row.unshift(this.werte[i]);
      row.unshift(this.bezeichnungen[i]);

      this.productionArray.push(row);
    }
    this.calculateKapazitaetsbedarfNeu();
    this.calculateRuestzeitNeu();
    this.calculateKapazitaetsbedarfAlt();
    this.calculateRuestzeitAlt();
    this.calculateGesamtKapazitaet();

    console.log(productions)
  }

  updateRow(row: any[], production: Production): any[] {
      row[0] += (production.quantity) ;
      for (let i: number = 1; i < 15; i++) {
        row[i] += this.calculateWorkingStations(production, i);
      }
      
    return row;
  }

  calculateWorkingStations(production: Production, station: number): number {
    const articleData = this.capacityData[production.article];
    if (articleData && articleData.Arbeitsplatz[station]) {
      const arbeitsplatz = articleData.Arbeitsplatz[station];
      const bearbeitungszeit = arbeitsplatz.Bearbeitungszeit ?? 0;
      const rüstzeit = arbeitsplatz.Rüstzeit ?? 0;


      return bearbeitungszeit * production.quantity + rüstzeit;
    }
    return 0;
  }

  calculateKapazitaetsbedarfNeu() {
    for (let i = 0; i < this.productionArray.length; i++) {
      for (let j = 5; j < 18; j++) {
        this.kapazitaetsbedarfNeu[j] += this.productionArray[i][j];
      }
    }
    this.productionArray.push(this.kapazitaetsbedarfNeu);
  }

  calculateRuestzeitNeu() {
    for (let i = 0; i < this.productionArray.length; i++) {
      for (let j = 4; j < 18; j++) {
        this.ruestzeitNeu[j] += this.productionArray[i][j];
      }
    }
    this.productionArray.push(this.ruestzeitNeu);
  }

  calculateKapazitaetsbedarfAlt() {
    for (let i = 0; i < this.productionArray.length; i++) {
      for (let j = 4; j < 18; j++) {
        this.kapazitaetsbedarfAlt[j] += this.productionArray[i][j];
      }
    }
    this.productionArray.push(this.kapazitaetsbedarfAlt);
  }

  calculateRuestzeitAlt() {
    for (let i = 0; i < this.productionArray.length; i++) {
      for (let j = 4; j < 18; j++) {
        this.ruestzeitAlt[j] += this.productionArray[i][j];
      }
    }
    this.productionArray.push(this.ruestzeitAlt);
  }

  calculateGesamtKapazitaet() {
    for (let i = 5; i < this.gesamtKapazitaet.length; i++) {
        this.gesamtKapazitaet[i] = this.ruestzeitAlt[i] + this.ruestzeitNeu[i] + this.kapazitaetsbedarfAlt[i] + this.kapazitaetsbedarfNeu[i];
    }
    this.productionArray.push(this.gesamtKapazitaet);
  }

  resetTable() {
    this.productionArray = [];
    this.kapazitaetsbedarfNeu = ["Kapatitätsbedarf Neu",,,,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; 
    this.ruestzeitNeu= ["Rüstzeit Neu",,,,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; 
    this.kapazitaetsbedarfAlt = ["Kap. Warteschl.",,,,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; //Rückstand Vorperiode
    this.ruestzeitAlt = ["Rüs. Warteschl.",,,,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; //Rückstand Vorperiode
    this.gesamtKapazitaet = ["Gesamtkapazität",,,,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  }

  printProductionArray() {
    this.updateProductionArray();
    console.log(this.productionArray);

  }
}
