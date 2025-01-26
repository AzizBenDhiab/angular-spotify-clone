import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Artist } from '../../models/artist';
import { Audiobook } from '../../models/audiobook';
import { Episode } from '../../models/episode';
import { Playlist } from '../../models/playlist';
import { Show } from '../../models/show';
import { Album } from '../../models/album';
import { User } from '../../models/user';
import { PlayerService } from '../../services/player.service';
import { CommonModule, Location } from '@angular/common';
import { SpotifyCardComponent } from '../spotify-card/spotify-card.component';
import { Song } from '../../models/song';

@Component({
  selector: 'app-list-item',
  standalone: true,
  imports: [SpotifyCardComponent, CommonModule],
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.css'],
})
export class ListItemComponent {
  @Input() items!:
    | User[]
    | Playlist[]
    | Artist[]
    | Audiobook[]
    | Show[]
    | Episode[]
    | Album[]
    | null;
  @Input() shouldApplyRoundedClass: boolean = false;
  @Input() title: string = '';

  private router = inject(Router);
  private location = inject(Location);
  private playerService = inject(PlayerService);
  showAll() {
    if (this.items) {
      this.playerService.setShowAll(this.items);
      const currentUrl = this.location.path();
      console.log(currentUrl);
      const newUrl = `${currentUrl}/showMore`;
      this.router.navigate([newUrl]);
    }
  }
}
