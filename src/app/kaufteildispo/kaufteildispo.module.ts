import {NgModule} from '@angular/core';
import {KaufteildispoComponent} from './kaufteildispo.component';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {AppComponent} from '../app.component';
import {BrowserModule} from '@angular/platform-browser';

let DataService;

@NgModule({
  declarations: [
    KaufteildispoComponent

  ],
  imports: [
    CommonModule,
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppComponent
  ],
  providers: [

  ],
  exports: [
    KaufteildispoComponent
  ]
})
export class TableModule { }
