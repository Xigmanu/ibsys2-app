import { Routes } from '@angular/router';
import { SetupComponent } from './setup/setup.component';
import { HomepageComponent } from './homepage/homepage.component';
import { ExportComponent } from './export/export.component';
import { DirektverkaufComponent } from './direktverkauf/direktverkauf.component';
import { CapacityPlanComponent } from './capacity-plan/capacity-plan.component';
import { DispositionComponent } from './disposition/disposition.component';
import { KaufteildispoComponent } from './kaufteildispo/kaufteildispo.component';
import { InputComponent } from './input/input.component';
import { LotsizeComponent } from './lotsize/lotsize.component';

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
    path: 'capacity-plan',
    component: CapacityPlanComponent,
  },
  {
    path: 'export',
    component: ExportComponent,
  },
  {
    path: '',
    component: HomepageComponent,
  },
  {
    path: 'disposition',
    component: DispositionComponent
  },
  {
    path: 'kaufteilDispo',
    component: KaufteildispoComponent
  },
  {
    path: 'input',
    component: InputComponent,
  },
  {
    path: 'lotsize',
    component: LotsizeComponent,
  }
];
