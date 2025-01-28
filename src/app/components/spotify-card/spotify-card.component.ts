import { Component, Input, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Artist } from '../../models/artist';
import { Audiobook } from '../../models/audiobook';
import { Episode } from '../../models/episode';
import { Playlist } from '../../models/playlist';
import { Show } from '../../models/show';
import { Album } from '../../models/album';
import { User } from '../../models/user';
import { ErrorImagePipe } from '../../pipe/error-image.pipe';

@Component({
  selector: 'app-spotify-card',
  standalone: true,
  imports: [ErrorImagePipe],
  templateUrl: './spotify-card.component.html',
  styleUrl: './spotify-card.component.css',
})
export class SpotifyCardComponent {
  isHovered = signal<boolean>(false);
  hoveredClass = computed(() => (this.isHovered() ? 'hovered' : ''));

  @Input() cardData!:
    | User
    | Playlist
    | Artist
    | Show
    | Album
    | Audiobook
    | Episode;
  @Input() shouldApplyRoundedClass: boolean = false;

  constructor(private router: Router) {}

  navigate() {
    if ('followers' in this.cardData) {
      this.router.navigate(['/home/artist', this.cardData.id]);
    }
    if ('songs' in this.cardData) {
      this.router.navigate(['/home/playlist', this.cardData.id]);
    }
    if ('total_tracks' in this.cardData) {
      this.router.navigate([
        '/home/album',
        this.cardData.id,
        this.cardData.artists[0].id,
      ]);
    }
  }

  toggleHover(isHovered: boolean): void {
    this.isHovered.set(isHovered);
  }

  isAlbum(cardData: Album | User | Playlist | Artist): cardData is Album {
    return (cardData as Album)?.release_date !== undefined;
  }

  isAlbumOrEpisode(
    cardData: User | Playlist | Artist | Show | Album | Audiobook | Episode
  ): cardData is Album | Episode {
    return (cardData as Album | Episode)?.release_date !== undefined;
  }
}
