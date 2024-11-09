import { Routes } from '@angular/router';
import { SetupComponent } from './setup/setup.component';
import { HomepageComponent } from './homepage/homepage.component';
import { ProdOrdersComponent } from './prod-orders/prod-orders.component';

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
        path: 'prodorders',
        component: ProdOrdersComponent
    }
];
