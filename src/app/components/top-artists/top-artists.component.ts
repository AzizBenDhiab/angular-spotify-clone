import { Component } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Artist } from '../../models/artist';
import { SpotifyService } from '../../services/spotify-service.service';

@Component({
  selector: 'app-top-artists',
  standalone: true,
  imports: [],
  templateUrl: './top-artists.component.html',
  styleUrl: './top-artists.component.css',
})
export class TopArtistsComponent {
  artists$: Observable<Artist[]> = of([]);

  constructor(private spotifyService: SpotifyService) {}

  ngOnInit(): void {
    this.artists$ = this.spotifyService
      .getTopArtists()
      .pipe(tap((items) => console.log('artists : ', items)));
  }
}
