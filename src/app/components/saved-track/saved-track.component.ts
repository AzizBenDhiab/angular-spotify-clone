import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../services/spotify-service.service';
import { MusicListComponent } from '../music-list/music-list.component';
import { CommonModule } from '@angular/common';
import { PlaylistHeaderComponent } from '../playlist-header/playlist-header.component';
import { switchMap, map } from 'rxjs';

@Component({
  selector: 'app-saved-track',
  standalone: true,
  providers: [SpotifyService],
  imports: [MusicListComponent, PlaylistHeaderComponent, CommonModule],
  templateUrl: './saved-track.component.html',
  styleUrls: ['./saved-track.component.css']
})
export class SavedTrackComponent implements OnInit {
  totalDuration: string = '';
  ownerDisplayName: string = '';  // Display the owner's name

  constructor(public spotifyService: SpotifyService) {}

  ngOnInit() {
    // Fetch the current user's profile
    this.spotifyService.getUserProfile('me').pipe(
      switchMap((userProfile) => {
        // Set the user's display name (or fallback to "Unknown" if not found)
        this.ownerDisplayName = userProfile.name || 'Unknown'; 
        
        // Fetch saved tracks after user info
        return this.spotifyService.getSavedTracks();
      })
    ).subscribe({
      next: (songs) => {
        console.log('Songs loaded:', songs);
        this.spotifyService.updatePlaylistSongs(songs);
        this.totalDuration = this.getTotalDuration(songs);
      },
      error: (err) => {
        console.error('Error loading saved tracks:', err);
      }
    });

    // Optionally subscribe to updated playlist songs
    this.spotifyService.playlistSongs$.subscribe((songs) => {
      console.log('Updated songs in observable:', songs);
      this.totalDuration = this.getTotalDuration(songs);
    });
  }

  getTotalDuration(songs: any[] | null): string {
    if (!songs || songs.length === 0) return '0 mins';

    let totalSeconds = 0;
    songs.forEach((song) => {
      if (song?.time) {
        const [minutes, seconds] = song.time.split(':').map(Number);
        if (!isNaN(minutes) && !isNaN(seconds)) {
          totalSeconds += minutes * 60 + seconds;
        }
      }
    });

    if (totalSeconds === 0) return '0 mins'; // Prevent "NaN mins" bug

    const minutes = Math.floor(totalSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return hours > 0 ? `${hours} hrs ${remainingMinutes} mins` : `${minutes} mins`;
  }
}
