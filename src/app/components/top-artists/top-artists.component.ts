import { Component } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Artist } from '../../models/artist';
import { SpotifyService } from '../../services/spotify-service.service';
import { MenuUserItemComponent } from '../menu-user-item/menu-user-item.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-top-artists',
  standalone: true,
  imports: [
    MenuUserItemComponent,
    CommonModule,
  ],
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
