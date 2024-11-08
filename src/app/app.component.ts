import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { ClarityModule, ClrVerticalNavModule } from '@clr/angular';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import '@cds/core/icon/register.js';
import { ClarityIcons, factoryIcon, languageIcon, installIcon } from '@cds/core/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    ClarityModule, 
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    ClrVerticalNavModule,
    RouterModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ibsys2';

  protected readonly form = new FormGroup({
    files: new FormControl<FileList | null>(null),
  });
}

ClarityIcons.addIcons(factoryIcon, languageIcon, installIcon);
