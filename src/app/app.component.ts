import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FileUploadComponent } from './file-upload/file-upload.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FileUploadComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'importer';
}
