import { Component } from '@angular/core';
import { TopArtistsComponent } from '../top-artists/top-artists.component';
import { PlayerCardComponent } from '../player-card/player-card.component';

@Component({
  selector: 'app-right-panel',
  standalone: true,
  imports: [
    TopArtistsComponent,
    PlayerCardComponent,
  ],
  templateUrl: './right-panel.component.html',
  styleUrl: './right-panel.component.css'
})
export class RightPanelComponent {

}
