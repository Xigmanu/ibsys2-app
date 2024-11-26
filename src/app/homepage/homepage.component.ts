import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    RouterModule,
    RouterOutlet,
    TranslateModule
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent { }
