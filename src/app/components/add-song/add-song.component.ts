import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { Song } from '../../models/song';
import { PlayerService } from '../../services/player.service';
import { PlaylistService } from '../../services/playlist/playlist.service';
import { SpotifyService } from '../../services/spotify-service.service';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-add-song',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    // Add this
  ],
  templateUrl: './add-song.component.html',
  styleUrl: './add-song.component.css',
})
export class AddSongComponent implements OnInit, OnChanges {
  searchIcon = faSearch;
  searchResults$: Observable<{ tracks: Song[] }> | undefined;
  searchControl = new FormControl();
  @Input() playlistId!: string;
  constructor(
    public route: ActivatedRoute,
    public spotifyService: SpotifyService,
    public playerService: PlayerService,
    public playlistService: PlaylistService,
    public http: HttpClient,
    private toast: ToastrService
  ) {}
  ngOnInit() {
    this.searchResults$ = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((searchTerm) => {
        console.log(searchTerm);
        if (searchTerm.trim() === '') {
          return of({ tracks: [] });
        }
        return this.spotifyService.searchForItems(searchTerm, ['track']);
      })
    );
  }

  ngOnChanges() {
    this.refreshData();
  }

  getArtists(song: Song) {
    return song.artists.map((artist) => artist.name).join(', ');
  }

  AddItem(song: Song) {
    const requestBody = {
      uris: [song.uri],
      position: 0,
    };

    console.log(this.playlistId);

    this.playlistService
      .AddItem(requestBody, this.playlistId)
      .pipe(
        switchMap(() => {
          return this.spotifyService.getPlaylistDetails(this.playlistId);
        }),
        tap((updatedDetails) => {
          this.playlistService.updatePlaylistDetails(updatedDetails);
          this.toast.success('Added to the playlist');
        }),
        catchError((error) => {
          this.toast.error('Error adding item to the playlist');
          throw error; // Rethrow the error for further handling, if needed
        })
      )
      .subscribe();
  }
  PlaySong(song: Song) {
    this.playerService.playMusic(song);
  }
  private refreshData() {
    this.searchControl.setValue('');
  }
}
