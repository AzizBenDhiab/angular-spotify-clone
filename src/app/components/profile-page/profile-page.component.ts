import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Artist } from '../../models/artist';
import { User } from '../../models/user';
import { SpotifyService } from '../../services/spotify-service.service';
import { PlaylistHeaderComponent } from '../playlist-header/playlist-header.component';
import { ListItemComponent } from '../list-item/list-item.component';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    PlaylistHeaderComponent,
    ListItemComponent,
    AsyncPipe,
    CommonModule,
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css',
})
export class ProfilePageComponent implements OnInit {
  profile$?: Observable<User>;
  artist$?: Observable<Artist[]>;
  userId: string | undefined;

  constructor(private spotifyService: SpotifyService) {}

  ngOnInit(): void {
    console.log('init');

    // Get user data from local storage and parse it
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.userId = user?.id;
      } catch (error) {
        console.error('Error parsing user data from localStorage', error);
      }
    }
    console.log(this.userId);

    if (this.userId) {
      this.profile$ = this.spotifyService.getUserProfile(this.userId);
      console.log(this.profile$);

      this.artist$ = this.spotifyService.getFollowedArtists();
      console.log(this.artist$);
    }
  }
}
