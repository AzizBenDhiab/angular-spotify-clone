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
  // Define a signal for hover state
  isHovered = signal<boolean>(false); // Reactive signal

  // Define a computed signal for derived hover class
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

  // Navigating based on card type
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

  // Toggle hover state
  toggleHover(isHovered: boolean): void {
    this.isHovered.set(isHovered); // Update the signal value
  }

  // Check if the card data is an album
  isAlbum(cardData: Album | User | Playlist | Artist): cardData is Album {
    return (cardData as Album)?.release_date !== undefined;
  }

  // Check if the card is either an album or episode
  isAlbumOrEpisode(
    cardData: User | Playlist | Artist | Show | Album | Audiobook | Episode
  ): cardData is Album | Episode {
    return (cardData as Album | Episode)?.release_date !== undefined;
  }
}
