import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { Song } from '../../models/song';
import { Album } from '../../models/album';

import { ArtisteProfileService } from '../../services/artisteProfile/artiste-profile.service';
import { SpotifyService } from '../../services/spotify-service.service';
import { PlaylistHeaderComponent } from '../playlist-header/playlist-header.component';
import { MusicListComponent } from '../music-list/music-list.component';
import { ListItemComponent } from '../list-item/list-item.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-album-page',
  standalone: true,
  imports: [
    PlaylistHeaderComponent,
    MusicListComponent,
    ListItemComponent,
    CommonModule
  ],
  templateUrl: './album-page.component.html',
  styleUrl: './album-page.component.css',
})
export class AlbumPageComponent {
  album$!: Observable<Album>;
  albumTracks$!: Observable<Song[]>;

  artistId: string = '';
  moreAlbumsFromTheSameArtists$!: Observable<Album[]>;

  constructor(
    private route: ActivatedRoute,
    private spotifyService: SpotifyService,
    private artistService: ArtisteProfileService
  ) {}

  ngOnInit(): void {
    this.album$ = this.route.paramMap.pipe(
      switchMap((params) =>
        this.spotifyService.getAlbumtDetails(params.get('id'))
      )
    );

    this.albumTracks$ = this.route.paramMap.pipe(
      switchMap((params) =>
        this.spotifyService.getAlbumTracks(params.get('id'))
      )
    );
    this.moreAlbumsFromTheSameArtists$ = this.route.paramMap.pipe(
      switchMap((params) =>
        this.artistService.getArtistAlbums(params.get('artistId'))
      )
    );
  }
}
