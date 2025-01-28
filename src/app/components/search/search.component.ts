import { Component, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  catchError,
  of,
  switchMap,
  shareReplay,
  tap,
  map,
  Observable,
  filter,
} from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAngleLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { SpotifyService } from '../../services/spotify-service.service';
import { ListItemComponent } from '../list-item/list-item.component';
import { Artist } from '../../models/artist';
import { Audiobook } from '../../models/audiobook';
import { Episode } from '../../models/episode';
import { Playlist } from '../../models/playlist';
import { Show } from '../../models/show';
import { Song } from '../../models/song';
import { Album } from '../../models/album';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FontAwesomeModule,
    CommonModule,
    ListItemComponent,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  private spotifyService = inject(SpotifyService);
  private location = inject(Location);
  private route = inject(ActivatedRoute);

  angle = faAngleLeft;
  searchIcon = faSearch;

  searchForm = new FormGroup({
    search: new FormControl<string>(''),
  });

  toggleStates = signal<boolean[]>([true, true, true, true, true, true]);
  items$:
    | Observable<{
        artists: Artist[];
        tracks: Song[];
        playlists: Playlist[];
        episodes: Episode[];
        shows: Show[];
        audiobooks: Audiobook[];
        albums: Album[];
      }>
    | undefined;
  artists$: Observable<Artist[]> | undefined;
  albums$: Observable<Album[]> | undefined;
  episodes$: Observable<Episode[]> | undefined;
  shows$: Observable<Show[]> | undefined;
  playlists$: Observable<Playlist[]> | undefined;
  audiobooks$: Observable<Audiobook[]> | undefined;
  tracks$: Observable<Song[]> | undefined;
  ngOnInit(): void {
    this.searchForm.statusChanges.subscribe((status) => {
      console.log('Form Status:', status);
    });

    this.searchForm.valueChanges.subscribe((value) => {
      console.log('Form Value:', value);
    });

    this.items$ = this.searchForm.get('search')?.valueChanges?.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter((term): term is string => term !== null),
      switchMap((term: string) => {
        return this.spotifyService
          .searchForItems(term, [
            'artist',
            'track',
            'playlist',
            'episode',
            'show',
            'audiobook',
            'album',
          ])
          .pipe(
            tap((response) => {
              console.log(
                'Response object:',
                JSON.stringify(response, null, 2)
              );
              console.log('Response keys:', Object.keys(response));
            }),
            map((response) => {
              return {
                artists: (response.artists || []).filter(
                  (item) => item && item.id
                ),
                tracks: (response.tracks || []).filter(
                  (item) => item && item.id
                ),
                playlists: (response.playlists || []).filter(
                  (item) => item && item.id
                ),
                episodes: (response.episodes || []).filter(
                  (item) => item && item.id
                ),
                shows: (response.shows || []).filter((item) => item && item.id),
                audiobooks: (response.audiobooks || []).filter(
                  (item) => item && item.id
                ),
                albums: (response.albums || []).filter(
                  (item) => item && item.id
                ),
              };
            }),
            catchError((error) => {
              console.error('Search error:', error);
              return of({
                artists: [],
                tracks: [],
                playlists: [],
                episodes: [],
                shows: [],
                audiobooks: [],
                albums: [],
              });
            })
          );
      }),
      shareReplay()
    ) as Observable<{
      artists: Artist[];
      tracks: Song[];
      playlists: Playlist[];
      episodes: Episode[];
      shows: Show[];
      audiobooks: Audiobook[];
      albums: Album[];
    }>;

    this.artists$ = this.items$.pipe(map((data) => data.artists));
    this.tracks$ = this.items$.pipe(map((data) => data.tracks));
    this.playlists$ = this.items$.pipe(map((data) => data.playlists));
    this.episodes$ = this.items$.pipe(map((data) => data.episodes));
    this.shows$ = this.items$.pipe(map((data) => data.shows));
    this.audiobooks$ = this.items$.pipe(map((data) => data.audiobooks));
    this.albums$ = this.items$.pipe(map((data) => data.albums));
  }

  toggleSection(section: string): void {
    switch (section) {
      case 'showAll':
        this.toggleStates.set([true, true, true, true, true, true]);
        break;
      case 'showArtists':
        this.toggleStates.set([true, false, false, false, false, false]);
        break;
      case 'showAlbums':
        this.toggleStates.set([false, true, false, false, false, false]);
        break;
      case 'showPlaylists':
        this.toggleStates.set([false, false, true, false, false, false]);
        break;
      case 'showEpisodes':
        this.toggleStates.set([false, false, false, true, false, false]);
        break;
      case 'showShows':
        this.toggleStates.set([false, false, false, false, true, false]);
        break;
    }
  }
}
