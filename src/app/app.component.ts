import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { ClarityModule, ClrVerticalNavModule } from '@clr/angular';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import '@cds/core/icon/register.js';
import {
  ClarityIcons,
  factoryIcon,
  languageIcon,
  installIcon, dollarBillIcon,
  exportIcon,
  detailsIcon,
  treeViewIcon,
  formIcon,
  listIcon,
  inboxIcon,
} from '@cds/core/icon';
import { DataService, MetaData } from './data.service';
import { DataStructure } from './data.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { GlobalStateService } from './shared/global-state.service';

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
    TranslateModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ibsys2';

  retrievedData: DataStructure | null = null;

  languages = [
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' }, // Add more languages as needed
  ];
  currentLang = 'en'; // Default language

  protected readonly form = new FormGroup({
    files: new FormControl<FileList | null>(null),
  });

  constructor(
    private dataService: DataService,
    private translate: TranslateService,
    public globalState: GlobalStateService
  ) {
    // Check localStorage for the last selected language
    const savedLang = localStorage.getItem('language');
    this.currentLang = savedLang ? savedLang : 'en';

    // Set the default language
    this.translate.setDefaultLang(this.currentLang);
    this.translate.use(this.currentLang);
  }

  onLanguageChange(lang: string): void {
    this.currentLang = lang;
    this.translate.use(lang);

    // Persist the selected language
    localStorage.setItem('language', lang);
  }

  onGetDebugData(): void {
    this.retrievedData = this.dataService.getData();
    console.log(this.retrievedData);
  }

  onSetInputSampleData(): void {
    this.dataService.generateInputSampleData();
    this.globalState.dataInitialized = true;
  }

  onSetOutputSampleData(): void {
    this.dataService.generateOutputSampleData();
    this.globalState.dataInitialized = true;
  }

  getMetadata(): string {
    return "- Gruppe " + this.dataService.getData().input.metaData.group + " - Periode " + this.dataService.getData().input.metaData.period;
  }
}

ClarityIcons.addIcons(factoryIcon, languageIcon, installIcon, exportIcon, dollarBillIcon, detailsIcon, treeViewIcon, formIcon, factoryIcon, listIcon, inboxIcon);
