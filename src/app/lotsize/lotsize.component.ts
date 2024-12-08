import { Component, OnInit } from '@angular/core';
import { DataService, DataStructure } from '../data.service';
import { GlobalStateService } from '@cds/core/internal';
import {CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lotsize',
  standalone: true,
  imports: [
    CdkDropList, CdkDrag,
    CommonModule
  ],
  templateUrl: './lotsize.component.html',
  styleUrl: './lotsize.component.scss'
})
export class LotsizeComponent {
  productionList: { article: number; quantity: number }[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    // Fetch production list from the DataService
    this.productionList = this.dataService.getData().output.productionList.productions;
  }

  drop(event: CdkDragDrop<{ article: number; quantity: number }[]>) {
    moveItemInArray(this.productionList, event.previousIndex, event.currentIndex);
  }
}
