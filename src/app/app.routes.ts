import {Routes} from '@angular/router';
import {SetupComponent} from './setup/setup.component';
import {HomepageComponent} from './homepage/homepage.component';
import {ExportComponent} from './export/export.component';
import { ProdOrdersComponent } from './prod-orders/prod-orders.component';

export const routes: Routes = [
    {
        path: 'setup',
        component: SetupComponent,
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
        path: 'prodorders',
        component: ProdOrdersComponent
    }
];
