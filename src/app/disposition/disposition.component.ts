import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClarityModule, ClrLoadingState } from '@clr/angular';
import { DispositionTableComponent } from './disposition-table/disposition-table.component';
import { DataService, DataStructure } from '../data.service';
import { TranslateModule } from '@ngx-translate/core';
import {
  createTableRows,
  DispositionTableRow,
} from './disposition-table/disposition-table-row';
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
    ProduktionsplanComponent
  ],
})
export class DispositionComponent implements OnInit {
  private dataStruct: DataStructure;

  rowsP1: DispositionTableRow[] = [];
  rowsP2: DispositionTableRow[] = [];
  rowsP3: DispositionTableRow[] = [];

  saveBtnState: ClrLoadingState = ClrLoadingState.DEFAULT;

  constructor(private globalDS: DataService) {
    this.dataStruct = this.globalDS.getData();
  }

  ngOnInit(): void {
    this.rowsP1 = createTableRows(this.dataStruct, 0);
    this.rowsP2 = createTableRows(this.dataStruct, 1);
    this.rowsP3 = createTableRows(this.dataStruct, 2);
  }
}
