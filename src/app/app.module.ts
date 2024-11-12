import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import routes from './app.routes';
import {CommonModule} from '@angular/common';
import {KaufteildispoComponent} from './kaufteildispo/kaufteildispo.component';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes, {useHash: true}),
    BrowserAnimationsModule,
    AppComponent,
    KaufteildispoComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
