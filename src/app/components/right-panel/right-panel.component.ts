import { Component } from '@angular/core';
import { TopArtistsComponent } from '../top-artists/top-artists.component';

@Component({
  selector: 'app-right-panel',
  standalone: true,
  imports: [
    TopArtistsComponent,
  ],
  templateUrl: './right-panel.component.html',
  styleUrl: './right-panel.component.css'
})
export class RightPanelComponent {

}
