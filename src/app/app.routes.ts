import { Routes } from '@angular/router';
import { SetupComponent } from './setup/setup.component';
import { HomepageComponent } from './homepage/homepage.component';
import { ExportComponent } from './export/export.component';
import { DirektverkaufComponent } from './direktverkauf/direktverkauf.component';
import {KaufteildispoComponent} from './kaufteildispo/kaufteildispo.component';

export const routes: Routes = [
  {
    path: 'setup',
    component: SetupComponent,
  },
  {
    path: 'sellwish',
    component: DirektverkaufComponent,
  },
  {
    path: 'export',
    component: ExportComponent,
  },
  {path: 'dispo',
  component: KaufteildispoComponent
  },
  {
    path: '',
    component: HomepageComponent,
  },
];
