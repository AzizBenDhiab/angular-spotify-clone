import {
  Component,
  OnInit,
  signal,
  computed,
  ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    CommonModule,
  ],
  templateUrl: './artist-profile.component.html',
  styleUrl: './artist-profile.component.css',
})
export class ArtistProfileComponent implements OnInit {
  artist = signal<Artist | undefined>(undefined);
  topTracks = signal<Song[]>([]);
  relatedArtists = signal<Artist[]>([]);
  albums = signal<Album[]>([]);

  artistName = computed(() => this.artist()?.name ?? '');
  artistImage = computed(() => this.artist()?.images[0]?.url ?? '');
  followerCount = computed(() => this.artist()?.followers.total ?? 0);

  constructor(
    private route: ActivatedRoute,
    private artistService: ArtisteProfileService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const artistId = params.get('id');

      if (artistId) {
        this.artistService
          .getArtistDetails(artistId)
          .subscribe((artistData) => this.artist.set(artistData));

        this.artistService.getTopTracks(artistId).subscribe((tracks) => {
          this.topTracks.set(tracks);
        });
        this.artistService
          .getRelatedArtists(artistId)
          .subscribe((artists) => this.relatedArtists.set(artists));

        this.artistService
          .getArtistAlbums(artistId)
          .subscribe((albums) => this.albums.set(albums));
      }
    });
  }
}
