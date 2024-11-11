import {NgModule} from '@angular/core';
import {KaufteildispoComponent} from './kaufteildispo.component';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
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
  ],
  providers: [

  ],
  exports: [
    KaufteildispoComponent
  ],
  bootstrap: [KaufteildispoComponent]

})
export class KaufteildispoModule { }
