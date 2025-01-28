import { Component, OnInit, signal } from '@angular/core';
import { Artist } from '../../models/artist';
import { User } from '../../models/user';
import { Playlist } from '../../models/playlist'; // Assuming you have a Playlist model
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
  profile = signal<User | null>(null); // Signal for user profile
  artists = signal<Artist[]>([]); // Signal for followed artists
  playlists = signal<Playlist[]>([]); // Signal for user playlists
  userId = signal<string | undefined>(undefined); // Signal for user ID

  constructor(private spotifyService: SpotifyService) {}

  ngOnInit(): void {
    console.log('init');

    // Get user data from local storage and parse it
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.userId.set(user?.id); // Set user ID signal
      } catch (error) {
        console.error('Error parsing user data from localStorage', error);
      }
    }

    console.log(this.userId());

    // Fetch data if userId is available
    if (this.userId()) {
      // Fetch user profile
      this.spotifyService.getUserProfile(this.userId()).subscribe({
        next: (userProfile) => {
          this.profile.set(userProfile); // Update profile signal
        },
        error: (err) => console.error('Error fetching profile:', err),
      });

      // Fetch followed artists
      this.spotifyService.getFollowedArtists().subscribe({
        next: (followedArtists) => {
          this.artists.set(followedArtists); // Update artists signal
        },
        error: (err) => console.error('Error fetching artists:', err),
      });

      // Fetch user playlists
      this.spotifyService.getUserPlaylists(this.userId()).subscribe({
        next: (userPlaylists) => {
          this.playlists.set(userPlaylists); // Update playlists signal
        },
        error: (err) => console.error('Error fetching playlists:', err),
      });
    }
  }
}
