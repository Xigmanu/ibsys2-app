import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ClarityModule } from "@clr/angular";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ClarityModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ibsys2';
}
