import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { ClarityModule, ClrVerticalNavModule } from '@clr/angular';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import '@cds/core/icon/register.js';
import { ClarityIcons, factoryIcon, languageIcon, installIcon } from '@cds/core/icon';
import { DataService } from './data.service';
import { DataStructure } from './data.service';
import { sample } from 'rxjs';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ClarityModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    ClrVerticalNavModule,
    RouterModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ibsys2';

  protected readonly form = new FormGroup({
    files: new FormControl<FileList | null>(null),
  });

  //This won't be pretty...

  retrievedData: DataStructure | null = null;
  constructor(private dataService: DataService) {}
  onGetDebugData(): void {
    this.retrievedData = this.dataService.getData();
    console.log(this.retrievedData);
  }

  onSetSampleData(): void {
    this.dataService.generateSampleData();
  }
}

ClarityIcons.addIcons(factoryIcon, languageIcon, installIcon);
