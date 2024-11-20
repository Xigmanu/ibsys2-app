import { Component } from '@angular/core';
import { ClarityModule } from '@clr/angular';
import { ClarityIcons, downloadIcon } from '@cds/core/icon';


@Component({
  selector: 'app-export',
  standalone: true,
  imports: [
    ClarityModule
  ],
  templateUrl: './export.component.html',
  styleUrl: './export.component.scss'
})
export class ExportComponent {

}

ClarityIcons.addIcons(downloadIcon);
