import { Component } from '@angular/core';
import { parseString } from 'xml2js';
import { JsonPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-setup',
  standalone: true,
  imports: [JsonPipe, CommonModule],
  templateUrl: './setup.component.html',
  styleUrl: './setup.component.css'
})
export class SetupComponent {
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const xmlData = reader.result as string;
        this.convertXmlToJson(xmlData);
      };
      reader.readAsText(file);
    }
  }

  public jsonData: any; 

  convertXmlToJson(xml: string): void {
    parseString(xml, { explicitArray: false }, (err, result) => {
      if (err) {
        console.error('Fehler beim Parsen des XML:', err);
      } else {
        this.jsonData = result; 
        console.log('JSON-Daten:', this.jsonData);
      }
    });
  }
}
