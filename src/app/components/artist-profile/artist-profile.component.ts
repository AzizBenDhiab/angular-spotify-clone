import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { Artist } from '../../models/artist';
import { Song } from '../../models/song';
import { Album } from '../../models/album';
import { ArtisteProfileService } from '../../services/artisteProfile/artiste-profile.service';
import { PlaylistHeaderComponent } from '../playlist-header/playlist-header.component';
import { MusicListComponent } from '../music-list/music-list.component';
import { ListItemComponent } from '../list-item/list-item.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-artist-profile',
  standalone: true,
  imports: [
    PlaylistHeaderComponent,
    MusicListComponent,
    ListItemComponent,
    CommonModule
  ],
  templateUrl: './artist-profile.component.html',
  styleUrl: './artist-profile.component.css',
})
export class ArtistProfileComponent implements OnInit {
  artist$!: Observable<Artist>;
  topTracks$!: Observable<Song[]>;
  artistId: string = '';
  relatedArtists$!: Observable<Artist[]>;
  albums$!: Observable<Album[]>;

  constructor(
    private route: ActivatedRoute,
    private artistService: ArtisteProfileService
  ) {}

  ngOnInit(): void {
    this.artist$ = this.route.paramMap.pipe(
      switchMap((params) =>
        this.artistService.getArtistDetails(params.get('id'))
      )
    );
    this.topTracks$ = this.route.paramMap.pipe(
      switchMap((params) => this.artistService.getTopTracks(params.get('id')))
    );
    this.relatedArtists$ = this.route.paramMap.pipe(
      switchMap((params) =>
        this.artistService.getRelatedArtists(params.get('id'))
      )
    );
    this.albums$ = this.route.paramMap.pipe(
      switchMap((params) =>
        this.artistService.getArtistAlbums(params.get('id'))
      )
    );
  }
}
