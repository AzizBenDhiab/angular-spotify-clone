import {
  Component,
  ViewChild,
} from '@angular/core';
import { Song } from '../../models/song';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-player-card',
  standalone: true,
  imports: [],
  templateUrl: './player-card.component.html',
  styleUrl: './player-card.component.css',
})
export class PlayerCardComponent {
  @ViewChild('audioPlayer') audioPlayer: any;

  constructor(public playerService: PlayerService) {}

  updateAudioSource(song: Song) {
    if (this.audioPlayer) {
      this.audioPlayer.nativeElement.src = song.previewUrl;
      this.audioPlayer.nativeElement.load();
      this.audioPlayer.nativeElement.play();
    }
    return song.previewUrl;
  }
}
