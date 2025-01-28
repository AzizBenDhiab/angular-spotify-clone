import { Component, OnInit, signal } from '@angular/core';
import { Artist } from '../../models/artist';
import { User } from '../../models/user';
import { Playlist } from '../../models/playlist';
import { SpotifyService } from '../../services/spotify-service.service';
import { PlaylistHeaderComponent } from '../playlist-header/playlist-header.component';
import { ListItemComponent } from '../list-item/list-item.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [PlaylistHeaderComponent, ListItemComponent, CommonModule],
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css'],
})
export class ProfilePageComponent implements OnInit {
  profile = signal<User | null>(null);
  artists = signal<Artist[]>([]);
  playlists = signal<Playlist[]>([]);
  userId = signal<string | undefined>(undefined);

  constructor(private spotifyService: SpotifyService) {}

  ngOnInit(): void {
    console.log('init');

    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.userId.set(user?.id);
      } catch (error) {
        console.error('Error parsing user data from localStorage', error);
      }
    }

    console.log(this.userId());

    if (this.userId()) {
      this.spotifyService.getUserProfile(this.userId()).subscribe({
        next: (userProfile) => {
          this.profile.set(userProfile);
        },
        error: (err) => console.error('Error fetching profile:', err),
      });

      this.spotifyService.getFollowedArtists().subscribe({
        next: (followedArtists) => {
          this.artists.set(followedArtists);
        },
        error: (err) => console.error('Error fetching artists:', err),
      });

      this.spotifyService.getUserPlaylists(this.userId()).subscribe({
        next: (userPlaylists) => {
          this.playlists.set(userPlaylists);
        },
        error: (err) => console.error('Error fetching playlists:', err),
      });
    }
  }
}
