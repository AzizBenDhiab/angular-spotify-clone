import { Component } from '@angular/core';
import { Song } from '../../models/song';
import { SpotifyService } from '../../services/spotify-service.service';
import {Observable, switchMap,} from 'rxjs';
import {ActivatedRoute} from "@angular/router";
import { map } from 'rxjs/operators';
import {PlaylistService} from "../../services/playlist/playlist.service";
import { PlaylistHeaderComponent } from '../playlist-header/playlist-header.component';
import { MusicListComponent } from '../music-list/music-list.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-saved-track',
  standalone: true,
  providers: [SpotifyService],  
  imports: [PlaylistHeaderComponent,MusicListComponent, CommonModule],
  templateUrl: './saved-track.component.html',
  styleUrl: './saved-track.component.css'
})
export class SavedTrackComponent {
  constructor(
    public spotifyService: SpotifyService,
  ) {}
  totalDuration: string = '';  
  ngOnInit() {
    this.spotifyService.getSavedTracks().subscribe({
      next: (songs) => {
        console.log('Songs loaded:', songs);
        this.spotifyService.updatePlaylistSongs(songs);
        this.totalDuration = this.getTotalDuration(songs);
      },
      error: (err) => console.error('Error loading saved tracks:', err)
    });

    this.spotifyService.playlistSongs$.subscribe((songs) => {
      console.log('Updated songs in observable:', songs);
      this.totalDuration = this.getTotalDuration(songs);
    });
  }

  getTotalDuration(songs: any[] | null): string {
    if (!songs || songs.length === 0) return '';
    
    let totalSeconds = 0;
    songs.forEach((song) => {
      if (song?.time) {
        const [minutes, seconds] = song.time.split(':').map(Number);
        if (!isNaN(minutes) && !isNaN(seconds)) {
          totalSeconds += minutes * 60 + seconds;
        }
      }
    });

    if (totalSeconds === 0) return '';

    const minutes = Math.floor(totalSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return hours > 0 ? `${hours} hrs ${remainingMinutes} mins` : `${minutes} mins`;
  }

}
