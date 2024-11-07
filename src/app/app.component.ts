import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    ClarityModule, 
    FormsModule,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ibsys2';
}
