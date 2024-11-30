import { Routes } from '@angular/router';
import { SetupComponent } from './setup/setup.component';
import { HomepageComponent } from './homepage/homepage.component';
import { ExportComponent } from './export/export.component';
import { DirektverkaufComponent } from './direktverkauf/direktverkauf.component';
import { DispositionComponent } from './disposition/disposition.component';

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
    {
        path: '',
        component: HomepageComponent,
    },
    {
        path: 'disposition',
        component: DispositionComponent
    }
];
