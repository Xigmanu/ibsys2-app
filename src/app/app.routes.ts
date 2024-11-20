import { Routes } from '@angular/router';
import { SetupComponent } from './setup/setup.component';
import { HomepageComponent } from './homepage/homepage.component';
import {KaufteildispoComponent} from './kaufteildispo/kaufteildispo.component';

export const routes: Routes = [
    {
        path: 'setup',
        component: SetupComponent
    },
    {
        path: '',
        component: HomepageComponent
    },{
    path: 'dispo',
    component: KaufteildispoComponent
  },
];
