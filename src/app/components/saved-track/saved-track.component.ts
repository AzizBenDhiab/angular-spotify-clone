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
  providers: [SpotifyService],  // Ensure the service is provided here
  imports: [PlaylistHeaderComponent,MusicListComponent, CommonModule],
  templateUrl: './saved-track.component.html',
  styleUrl: './saved-track.component.css'
})
export class SavedTrackComponent {
  constructor(
    public spotifyService: SpotifyService,
  ) {}

  ngOnInit() {
    console.log('ngOnInit triggered in SavedTrackComponent');
    this.spotifyService.getSavedTracks().subscribe({
      next: (songs) => {
        console.log('Songs loaded 11:', songs);
        this.spotifyService.updatePlaylistSongs(songs);
        console.log('Songs loaded 22:', songs);

      },
      error: (err) => {
        console.error('Error loading saved tracks:', err);
      }
    });
    this.spotifyService.playlistSongs$.subscribe((songs) => {
      console.log('Updated songs in observable:', songs);
    });
  }

}
