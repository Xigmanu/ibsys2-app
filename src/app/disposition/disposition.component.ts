import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClarityModule, ClrLoadingState } from '@clr/angular';
import { DispositionTableComponent } from './disposition-table/disposition-table.component';
import { DataService, DataStructure } from '../data.service';
import { TranslateModule } from '@ngx-translate/core';
import {
  createDispositionTableRows,
  DispositionTableRow,
} from './disposition-table/util/disposition-table-row';
import { ProduktionsplanComponent } from '../produktionsplan/produktionsplan.component';

@Component({
  selector: 'app-prod-orders',
  templateUrl: './disposition.component.html',
  styleUrl: './disposition.component.scss',
  standalone: true,
  imports: [
    ClarityModule,
    RouterModule,
    DispositionTableComponent,
    TranslateModule,
    ProduktionsplanComponent,
  ],
})
export class DispositionComponent implements OnInit {
  private dataStruct: DataStructure;

  rowsP1: DispositionTableRow[] = [];
  rowsP2: DispositionTableRow[] = [];
  rowsP3: DispositionTableRow[] = [];

  constructor(private globalDS: DataService) {
    this.dataStruct = this.globalDS.getData();
  }

  ngOnInit(): void {
    this.rowsP1 = createDispositionTableRows(this.dataStruct, 1);
    this.rowsP2 = createDispositionTableRows(this.dataStruct, 2);
    this.rowsP3 = createDispositionTableRows(this.dataStruct, 3);
  }
}
