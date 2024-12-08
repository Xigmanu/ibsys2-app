import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormsModule,
} from '@angular/forms';
import { DataService, DataStructure, Production } from '../data.service';
import { ClarityModule } from '@clr/angular';
import { CommonModule } from '@angular/common';
import capacityDataJson from '../../assets/CapacityData.json';
import { TranslateModule } from '@ngx-translate/core';

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
  imports: [ClarityModule, CommonModule, FormsModule, TranslateModule],
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
    'capacityPlan.bezeichnung1',
    '',
    '',
    'capacityPlan.bezeichnung2',
    '',
    '',
    'capacityPlan.bezeichnung3',
    '',
    '',
    'capacityPlan.bezeichnung4',
    '',
    '',
    'capacityPlan.bezeichnung5',
    'capacityPlan.bezeichnung6',
    'capacityPlan.bezeichnung7',
    '',
    '',
    'capacityPlan.bezeichnung8',
    'capacityPlan.bezeichnung9',
    '',
    '',
    'capacityPlan.bezeichnung10',
    '',
    '',
    'capacityPlan.bezeichnung11',
    '',
    '',
    'capacityPlan.bezeichnung12',
    '',
    '',
  ];
  werte = [
    'K',
    'D',
    'H',
    'K',
    'D',
    'H',
    'K',
    'D',
    'H',
    'K',
    'D',
    'H',
    'KDH',
    'KDH',
    'K',
    'D',
    'H',
    'KDH',
    'K',
    'D',
    'H',
    'K',
    'D',
    'H',
    'K',
    'D',
    'H',
    'K',
    'D',
    'H',
  ];
  kapazitaetsbedarfNeu: any[] = [];
  ruestzeitNeu: any[] = [];
  kapazitaetsbedarfAlt: any[] = [];
  ruestzeitAlt: any[] = [];
  gesamtKapazitaet: any[] = [];
  puffer: number[] = [];
  gesamtKapazitaetPuffer: any[] = [];
  schichten: any[] = [];
  ueberstunden: any[] = [];

  productionArray: string[][] = [];
  productionArray2: any[][] = [];
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
      let row: any[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

      productions.forEach((production) => {
        if (production.article === articleNumber) {
          row = this.updateRow(row, production);
        }
      });

      row.unshift(this.items[i]);
      row.unshift(this.werte[i]);
      row.unshift(this.bezeichnungen[i]);

      this.productionArray.push(row);
    }
    this.calculateKapazitaetsbedarfNeu();
    this.calculateRuestzeitNeu(data);
    this.calculateKapazitaetsbedarfAlt(data);
    this.calculateRuestzeitAlt(data);
    this.calculateGesamtKapazitaet();
    this.updatePuffer();
  }

  updateRow(row: any[], production: Production): any[] {
    row[0] += production.quantity;
    for (let i: number = 1; i < 15; i++) {
      if (i < 5) {
        row[i] += this.calculateWorkingStations(production, i);
      } else {
        row[i] += this.calculateWorkingStations(production, i + 1);
      }
    }

    return row;
  }

  calculateWorkingStations(production: Production, station: number): number {
    const articleData = this.capacityData[production.article];
    if (articleData && articleData.Arbeitsplatz[station]) {
      const arbeitsplatz = articleData.Arbeitsplatz[station];
      const bearbeitungszeit = arbeitsplatz.Bearbeitungszeit ?? 0;
      const rüstzeit = arbeitsplatz.Rüstzeit ?? 0;

      if (station < 5) {
        this.ruestzeitNeu[station + 3] += rüstzeit;
      } else {
        this.ruestzeitNeu[station + 2] += rüstzeit;
      }
      return bearbeitungszeit * production.quantity;
    }
    return 0;
  }

  calculateKapazitaetsbedarfNeu() {
    for (let i = 0; i < this.items.length; i++) {
      for (let j = 4; j < 18; j++) {
        this.kapazitaetsbedarfNeu[j] += this.productionArray[i][j];
      }
    }
    this.productionArray.push(this.kapazitaetsbedarfNeu);
  }

  calculateRuestzeitNeu(data: DataStructure) {
    this.productionArray.push(this.ruestzeitNeu);
  }

  calculateKapazitaetsbedarfAlt(data: DataStructure) {
    for (let i = 4; i < this.kapazitaetsbedarfAlt.length; i++) {
      if (data.input.waitingListWorkstations[i - 4] != undefined) {
        this.kapazitaetsbedarfAlt[i] =
          data.input.waitingListWorkstations[i - 4].timeNeed;
      } else {
        this.kapazitaetsbedarfAlt[i] = 0;
      }
    }
    this.productionArray.push(this.kapazitaetsbedarfAlt);
  }

  calculateRuestzeitAlt(data: DataStructure) {
    for (let i = 4; i < this.ruestzeitAlt.length; i++) {
      const waitinglist = data.input.waitingListWorkstations[i - 4].waitingList;
      const station = data.input.waitingListWorkstations[i - 4].id;

      if (waitinglist != undefined) {
        waitinglist.forEach((waitingListitem) => {
          const articleData = this.capacityData[waitingListitem.item];
          this.ruestzeitAlt[i] += articleData.Arbeitsplatz[station].Rüstzeit;
        });
      } else {
        this.ruestzeitAlt[i] = 0;
      }
    }
    this.productionArray.push(this.ruestzeitAlt);
  }

  calculateGesamtKapazitaet() {
    for (let i = 4; i < this.gesamtKapazitaet.length; i++) {
      this.gesamtKapazitaet[i] =
        this.ruestzeitAlt[i] +
        this.ruestzeitNeu[i] +
        this.kapazitaetsbedarfAlt[i] +
        this.kapazitaetsbedarfNeu[i];
    }
    this.productionArray.push(this.gesamtKapazitaet);
  }

  updatePuffer() {
    let workingTimes = [];

    for (let i = 4; i < this.gesamtKapazitaetPuffer.length; i++) {
      this.gesamtKapazitaetPuffer[i] =
        this.gesamtKapazitaet[i] + this.puffer[i - 4];

      let schichten = 0;
      let ueberstunden = 0;
      let totalCapacity = this.gesamtKapazitaetPuffer[i];

      if (totalCapacity <= 3600) {
        schichten = 1;
        ueberstunden = (totalCapacity - 2400) / 5;
      } else if (totalCapacity <= 6000) {
        schichten = 2;
        ueberstunden = (totalCapacity - 4800) / 5;
      } else {
        schichten = 3;
        ueberstunden = (totalCapacity - 7200) / 5;
      }
      this.schichten[i] = schichten;
      this.ueberstunden[i] = ueberstunden;

      this.productionArray2[0][i] = this.gesamtKapazitaetPuffer[i];
      this.productionArray2[1][i] = this.schichten[i];
      this.productionArray2[2][i] = this.ueberstunden[i];

      if (i < 9) {
        workingTimes.push({
          station: i - 3,
          shift: this.schichten[i],
          overtime: this.formatOvertime(this.ueberstunden[i]),
        });
      } else {
        workingTimes.push({
          station: i - 2,
          shift: this.schichten[i],
          overtime: this.formatOvertime(this.ueberstunden[i]),
        });
      }
    }
    this.dataService.setData({
      ...this.dataService.getData(),
      output: {
        ...this.dataService.getData().output,
        workingTimeList: { workingTimes: workingTimes },
      },
    });
  }

  formatOvertime(value: number): number {
    if (value > 0) {
      return Math.ceil(value);
    }
    return 0;
  }

  resetTable() {
    this.productionArray = [];
    this.productionArray2 = [];

    this.kapazitaetsbedarfNeu = Array(18).fill(0);
    this.ruestzeitNeu = Array(18).fill(0);
    this.kapazitaetsbedarfAlt = Array(18).fill(0);
    this.ruestzeitAlt = Array(18).fill(0);
    this.gesamtKapazitaet = Array(18).fill(0);
    this.schichten = Array(18).fill(0);
    this.ueberstunden = Array(18).fill(0);
    this.puffer = Array(14).fill(0);

    this.kapazitaetsbedarfNeu = [
      'capacityPlan.kapazitaetsbedarfNeu',
      ,
      ,
      ,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ];
    this.ruestzeitNeu = [
      'capacityPlan.ruestzeitNeu',
      ,
      ,
      ,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ];
    this.kapazitaetsbedarfAlt = [
      'capacityPlan.kapazitaetsbedarfAlt',
      ,
      ,
      ,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ]; //Rückstand Vorperiode
    this.ruestzeitAlt = [
      'capacityPlan.ruestzeitAlt',
      ,
      ,
      ,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ]; //Rückstand Vorperiode
    this.gesamtKapazitaet = [
      'capacityPlan.gesamtKapazitaet',
      ,
      ,
      ,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ];
    this.schichten = [
      'capacityPlan.schichten',
      ,
      ,
      ,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ];
    this.ueberstunden = [
      'capacityPlan.ueberstunden',
      ,
      ,
      ,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ];
    this.puffer = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.gesamtKapazitaetPuffer = [
      'capacityPlan.gesamtKapazitaetPuffer',
      ,
      ,
      ,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ];
    this.productionArray2 = [
      [...this.gesamtKapazitaetPuffer],
      [...this.schichten],
      [...this.ueberstunden],
    ];
  }

  printProductionArray() {
    console.log(this.productionArray2);
  }
}
