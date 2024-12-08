import { Component, OnInit } from '@angular/core';
import {
  DataService,
  Forecast,
  MetaData,
} from '../data.service';
import {
  CdkDropList,
  CdkDrag,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [
    CdkDropList,
    CdkDrag,
    CommonModule,
    TranslateModule,
    RouterModule,
    RouterOutlet,
    ClarityModule,
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent implements OnInit {
  constructor(private dataService: DataService) {}

  forecast: Forecast = {
    p1: 0,
    p2: 0,
    p3: 0,
  };

  metadata: MetaData = {
    game: '',
    group: '',
    period: '',
    forecast: this.forecast,
  };

  ngOnInit(): void {
    const data = this.dataService.getData();
    if (data) {
      this.metadata = data.input.metaData;
    } else {
      console.error('Data is null or not available.');
    }
  }
}
