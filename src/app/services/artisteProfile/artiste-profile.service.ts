import { Injectable } from '@angular/core';
import { spotifyConfiguration } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, EMPTY, map, Observable } from 'rxjs';
import { Song } from '../../models/song';
import { SpotifyAlbum, SpotifyArtist, SpotifyTrack } from '../../shared/helpers/SpotifyHelper';
import { Artist } from '../../models/artist';
import { Album } from '../../models/album';

@Injectable({
  providedIn: 'root'
})
export class ArtisteProfileService {
  private apiUrl = spotifyConfiguration.spotifyApiBaseUrl;
  private genericRoute = `${this.apiUrl}/artists/`;
  constructor(private http: HttpClient) {}
  getArtistDetails(artistId: string | null): Observable<any> {
    const url = `${this.genericRoute}${artistId}`;
    console.log(url);

    return this.http.get<any>(url);
  }

  getTopTracks(artistId: string | null): Observable<Song[]> {
    const url = `${this.genericRoute}${artistId}/top-tracks?country=US`;

    return this.http.get<any>(url).pipe(
      map((response) =>
        response.tracks.map((track: any) => SpotifyTrack(track))
      ),
      catchError((error) => {
        console.error('Error fetching top tracks:', error);
        return EMPTY;
      })
    );
  }

  getRelatedArtists(artistId: string | null): Observable<Artist[]> {
    const url = `${this.genericRoute}${artistId}/related-artists`;

    return this.http.get<any>(url).pipe(
      map((response) =>
        response.artists.map((artist: any) => SpotifyArtist(artist))
      ),
      catchError((error) => {
        console.error('Error fetching artists:', error);
        return EMPTY;
      })
    );
  }

  getArtistAlbums(artistId: string | null): Observable<Album[]> {
    const url = `${this.genericRoute}${artistId}/albums?include_groups=album,single,compilation,appears_on&offset=0&limit=20&locale=fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7`;
    return this.http.get<any>(url).pipe(
      map((response) =>
        response.items.map((album: any) => SpotifyAlbum(album))
      ),
      catchError((error) => {
        console.error('Error fetching albums:', error);
        return EMPTY;
      })
    );
  }
}
