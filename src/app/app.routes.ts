import { Routes } from '@angular/router';
import { SetupComponent } from './setup/setup.component';
import { HomepageComponent } from './homepage/homepage.component';
import {KaufteildispoComponent} from './kaufteildispo/kaufteildispo.component';
import { DirektverkaufComponent } from './direktverkauf/direktverkauf.component';

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
    {
        path: 'vertriebswunsch',
        component: DirektverkaufComponent
    }
];
