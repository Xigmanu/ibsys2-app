import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {KaufteildispoComponent} from './kaufteildispo/kaufteildispo.component';

const routes: Routes = [
  { path: 'dispo', component: KaufteildispoComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
