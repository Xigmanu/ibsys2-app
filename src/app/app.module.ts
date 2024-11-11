import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import {KaufteildispoModule} from './kaufteildispo/kaufteildispo.module';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppComponent,
    KaufteildispoModule
  ],
  providers: [],
})
export class AppModule { }
