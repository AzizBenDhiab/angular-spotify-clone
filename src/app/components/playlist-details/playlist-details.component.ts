import {
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { SpotifyService } from '../../services/spotify-service.service';
import {
  Observable,
  switchMap,
} from 'rxjs';
import { faPlay, faSearch } from '@fortawesome/free-solid-svg-icons';
import { HttpClient } from '@angular/common/http';
import { PlaylistService } from '../../services/playlist/playlist.service';
import { MusicListComponent } from '../music-list/music-list.component';
import { CommonModule } from '@angular/common';
import { PlaylistHeaderComponent } from '../playlist-header/playlist-header.component';

@Component({
  
  selector: 'app-playlist-details',
  standalone: true,
  providers: [SpotifyService],  
  imports: [MusicListComponent,PlaylistHeaderComponent,CommonModule],
  templateUrl: './playlist-details.component.html',
  styleUrl: './playlist-details.component.css'
})
export class PlaylistDetailsComponent implements OnInit {
  playlistId!: string;
  isCurrentUserOwner$!: Observable<boolean>;
  constructor(
    public route: ActivatedRoute,
    public spotifyService: SpotifyService,
    public playlistService: PlaylistService,
    public http: HttpClient,
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe((data: Params) => {
      this.playlistId = data['id'];
    });
    this.route.params.pipe(
      switchMap((params) =>
        this.spotifyService.getPlaylistDetails(params['id'])
      )
    ).subscribe((details) => {
      this.playlistService.updatePlaylistDetails(details);
      this.isCurrentUserOwner$ = this.playlistService.isCurrentUserOwner(details)
    });
  }
  protected readonly faSearch = faSearch;
  protected readonly faPlay = faPlay;
}
