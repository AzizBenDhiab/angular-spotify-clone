import { Component, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    CommonModule,
  ],
  templateUrl: './album-page.component.html',
  styleUrl: './album-page.component.css',
})
export class AlbumPageComponent implements OnInit {
  // Define signals with initial values
  album = signal<Album | undefined>(undefined);
  albumName = computed(() => 
    this.album()?.name ?? 'No name available'
  );
  albumImage = computed(() => {
    return (
      this.album()?.imageUrl ??
      'https://community.spotify.com/t5/image/serverpage/image-id/55829iC2AD64ADB887E2A5/image-size/large?v=v2&px=999'
    );
  });
  albumReleaseDate = computed(() => {
    return this.album()?.release_date ?? 'No date available';
  });
  albumTracks = signal<Song[]>([]);
  moreAlbumsFromTheSameArtists = signal<Album[]>([]);
  artistName = computed(() => {
    const name = this.album()?.artists[0]?.name;
    return 'More By ' + (name ?? 'Artist');
  });

  artistId: string = '';

  constructor(
    private route: ActivatedRoute,
    private spotifyService: SpotifyService,
    private artistService: ArtisteProfileService
  ) {}

  ngOnInit(): void {
    // Convert route params to signal and handle updates
    this.route.paramMap.subscribe((params) => {
      const albumId = params.get('id');
      const artistId = params.get('artistId');

      if (albumId) {
        // Update album details
        this.spotifyService
          .getAlbumtDetails(albumId)
          .subscribe((albumData) => this.album.set(albumData));

        // Update album tracks
        this.spotifyService
          .getAlbumTracks(albumId)
          .subscribe((tracks) => this.albumTracks.set(tracks));
      }

      if (artistId) {
        // Update more albums from the same artist
        this.artistService
          .getArtistAlbums(artistId)
          .subscribe((albums) => this.moreAlbumsFromTheSameArtists.set(albums));
      }
    });
  }
}
