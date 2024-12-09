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
import { RouterModule } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { TranslateService } from '@ngx-translate/core';
import annotationPlugin from 'chartjs-plugin-annotation';

Chart.register(...registerables);
Chart.register(annotationPlugin);

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
  imports: [
    ClarityModule,
    CommonModule,
    FormsModule,
    TranslateModule,
    RouterModule,
  ],
})
export class CapacityPlanComponent implements OnInit {
  chart?: Chart;
  constructor(private dataService: DataService, private translateService: TranslateService) {}
  private hasCapacityWarning = false;
  

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
  capacityData: Record<string, CapacityEntry> = capacityDataJson;

  ngOnInit() {
    this.updateProductionArray();
    this.translateService.onLangChange.subscribe(() => {
      if (this.chart) {
        this.chart.destroy();
      }
      this.createCapacityChart();
    });
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

  // Add this function to your component to track items by their index
  trackByIndex(index: number, item: any): number {
    return index;
  }

  // Debounce or optimize updatePuffer
  private pufferTimeout: any;

  updatePuffer() {
    if (this.pufferTimeout) {
      clearTimeout(this.pufferTimeout);
    }
    this.pufferTimeout = setTimeout(() => {
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
      console.log('Puffer updated:', this.puffer);
      if (this.chart) {
        this.chart.destroy();
      }
      this.createCapacityChart();
    }, 300); // Debounce for 300ms
    // Create new chart
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

  createCapacityChart() {
    const ctx = document.getElementById('capacityChart') as HTMLCanvasElement;
    const chartContainer = ctx.parentElement;

    const existingWarning = chartContainer?.querySelector('.capacity-warning');
    if (existingWarning) {
        existingWarning.remove();
    }

    const stationLabels = [1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(
      (num) => this.translateService.instant('capacityPlan.station', { num })
    );

    const adjustStationData = (data: any[]) => {
      return data.slice(4, 18);
    };

    const getBarColor = (value: number) => {
      if (value > 7200) return 'rgba(220, 53, 69, 0.8)'; // Error - exceeds max capacity
      if (value <= 2400) return 'rgba(54, 162, 235, 0.6)'; // 1 shift
      if (value <= 3600) return 'rgba(54, 162, 235, 0.8)'; // 1 shift + overtime
      if (value <= 4800) return 'rgba(255, 206, 86, 0.6)'; // 2 shifts
      if (value <= 6000) return 'rgba(255, 206, 86, 0.8)'; // 2 shifts + overtime
      return 'rgba(255, 159, 64, 0.6)'; // 3 shifts
    };

    const data = adjustStationData(this.gesamtKapazitaetPuffer);

    this.hasCapacityWarning = data.some((value) => value > 7200);

    if (this.hasCapacityWarning) {
      const warningStations = data
        .map((value, index) => ({ value, station: index + 1 }))
        .filter((item) => item.value > 7200)
        .map(item => this.translateService.instant('capacityPlan.station', { num: item.station }));

      // Add warning banner
      const chartContainer = ctx.parentElement;
      if (chartContainer) {
        const warningDiv = document.createElement('div');
        warningDiv.className = 'capacity-warning';
        warningDiv.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    <span class="alert-icon-wrapper">
                        <clr-icon shape="exclamation-circle"></clr-icon>
                    </span>
                    <span class="alert-text">
                    ${this.translateService.instant('capacityPlan.warning.maxCapacity', { stations: warningStations.join(', ') })}
                    </span>
                </div>
            `;
        chartContainer.insertBefore(warningDiv, ctx);
      }
    }

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: stationLabels,
        datasets: [
          {
            label: this.translateService.instant('capacityPlan.chart.totalCapacity'),
            data: data,
            backgroundColor: data.map((value) => getBarColor(value)),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
                plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.parsed.y;
                const minutes = this.translateService.instant('capacityPlan.chart.minutes', { value });
                
                if (value > 7200) {
                  return `${minutes} (${this.translateService.instant('capacityPlan.chart.error')})`;
                }
                if (value <= 2400) {
                  return `${minutes} (${this.translateService.instant('capacityPlan.chart.oneShift')})`;
                }
                if (value <= 3600) {
                  return `${minutes} (${this.translateService.instant('capacityPlan.chart.oneShiftOvertime')})`;
                }
                if (value <= 4800) {
                  return `${minutes} (${this.translateService.instant('capacityPlan.chart.twoShifts')})`;
                }
                if (value <= 6000) {
                  return `${minutes} (${this.translateService.instant('capacityPlan.chart.twoShiftsOvertime')})`;
                }
                return `${minutes} (${this.translateService.instant('capacityPlan.chart.threeShifts')})`;
              },
            },
          },
          annotation: {
            annotations: {
              line1: {
                type: 'line',
                yMin: 2400,
                yMax: 2400,
                borderColor: 'rgb(54, 162, 235)',
                borderWidth: 2,
                label: {
                  content: this.translateService.instant('capacityPlan.chart.oneShiftLabel', { value: 2400 }),
                  display: true,
                },
              },
              line1overtime: {
                type: 'line',
                yMin: 3600,
                yMax: 3600,
                borderColor: 'rgb(54, 162, 235)',
                borderWidth: 2,
                borderDash: [6, 6],
                label: {
                  content: this.translateService.instant('capacityPlan.chart.oneShiftOvertimeLabel', { value: 3600 }),
                  display: true,
                },
              },
              line2: {
                type: 'line',
                yMin: 4800,
                yMax: 4800,
                borderColor: 'rgb(255, 206, 86)',
                borderWidth: 2,
                label: {
                  content: this.translateService.instant('capacityPlan.chart.twoShiftsLabel', { value: 4800 }),
                  display: true,
                },
              },
              line2overtime: {
                type: 'line',
                yMin: 6000,
                yMax: 6000,
                borderColor: 'rgb(255, 206, 86)',
                borderWidth: 2,
                borderDash: [6, 6],
                label: {
                  content: this.translateService.instant('capacityPlan.chart.twoShiftsOvertimeLabel', { value: 6000 }),
                  display: true,
                },
              },
              line3: {
                type: 'line',
                yMin: 7200,
                yMax: 7200,
                borderColor: 'rgb(255, 159, 64)',
                borderWidth: 2,
                label: {
                  content: this.translateService.instant('capacityPlan.chart.threeShiftsLabel', { value: 7200 }),
                  display: true,
                },
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: (context) => {
                if (context.tick.value === 2400)
                  return 'rgba(54, 162, 235, 0.2)';
                if (context.tick.value === 4800)
                  return 'rgba(255, 206, 86, 0.2)';
                if (context.tick.value === 7200)
                  return 'rgba(255, 159, 64, 0.2)';
                return 'rgba(0, 0, 0, 0.1)';
              },
            },
          },
        },
      },
    });
  }
}
