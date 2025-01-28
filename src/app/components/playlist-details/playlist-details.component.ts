import {
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { SpotifyService } from '../../services/spotify-service.service';
import {
  map,
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

  // In PlaylistDetailsComponent
ngOnInit() {
  this.route.params.subscribe((data: Params) => {
    this.playlistId = data['id'];
  });

  this.route.params.pipe(
    switchMap((params) =>
      this.spotifyService.getPlaylistDetails(params['id'])
    ),
    switchMap((details) => {
      // Fetch the owner's real name using the owner ID (username)
      console.log("Songs array:", details.songs);

      return this.spotifyService.getUserProfile(details.owner).pipe(
        map(SpotifyUser => {
          // Add the owner's real name to the playlist details
          details.ownerDisplayName = SpotifyUser.name || "Unknown"; // Use the `name` from the User object
          return details;
        })
      );
    })
  ).subscribe((details) => {
    const totalDuration = this.getTotalDuration(details.songs);
    details.totalDuration = totalDuration;
    this.playlistService.updatePlaylistDetails(details);
    this.isCurrentUserOwner$ = this.playlistService.isCurrentUserOwner(details);
  });
}
  
getTotalDuration(songs: any[] | null): string {
  if (!songs || songs.length === 0) return '0 mins';

  let totalSeconds = 0;

  songs.forEach((song, index) => {
  
      if (song?.time) {
          const [minutes, seconds] = song.time.split(':').map(Number); // Convert "04:05" -> [4, 5]
          if (!isNaN(minutes) && !isNaN(seconds)) {
              const songTime = minutes * 60 + seconds; // Convert to total seconds
              totalSeconds += songTime;
          } else {
          }
      }
  });
  
  if (totalSeconds === 0) return '0 mins'; // Prevent "NaN mins" bug

  const minutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return hours > 0
    ? `${hours} hrs ${remainingMinutes} mins`
    : `${minutes} mins`;
}


  
  
  protected readonly faSearch = faSearch;
  protected readonly faPlay = faPlay;
}
