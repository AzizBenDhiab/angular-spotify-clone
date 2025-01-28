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
  styleUrls: ['./saved-track.component.css'],
})
export class SavedTrackComponent implements OnInit {
  totalDuration: string = '';
  ownerDisplayName: string = '';

  constructor(public spotifyService: SpotifyService) {}

  ngOnInit() {
    this.spotifyService
      .getUserProfile('me')
      .pipe(
        switchMap((userProfile) => {
          this.ownerDisplayName = userProfile.name || 'Unknown';
          return this.spotifyService.getSavedTracks();
        })
      )
      .subscribe({
        next: (songs) => {
          console.log('Songs loaded:', songs);
          this.spotifyService.updatePlaylistSongs(songs);
          this.totalDuration = this.getTotalDuration(songs);
        },
        error: (err) => {
          console.error('Error loading saved tracks:', err);
        },
      });

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

    if (totalSeconds === 0) return '0 mins';

    const minutes = Math.floor(totalSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return hours > 0
      ? `${hours} hrs ${remainingMinutes} mins`
      : `${minutes} mins`;
  }
}
