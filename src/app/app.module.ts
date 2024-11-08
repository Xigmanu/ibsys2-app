import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { KaufteildispoComponent } from './kaufteildispo/kaufteildispo.component';

@NgModule({
  declarations: [

  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppComponent,
    // Muss importiert sein, um formGroup zu verwenden
  ],
  providers: [],
})
export class AppModule { }
