import { Routes } from '@angular/router';
import { SetupComponent } from './setup/setup.component';
import { HomepageComponent } from './homepage/homepage.component';
import { DirektverkaufComponent } from './direktverkauf/direktverkauf.component';

export const routes: Routes = [
    {
        path: 'setup',
        component: SetupComponent
    },
    {
        path: '',
        component: HomepageComponent
    },
    {
        path: 'vertriebswunsch',
        component: DirektverkaufComponent
    }
];
