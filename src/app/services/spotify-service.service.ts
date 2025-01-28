import { Injectable } from '@angular/core';
import {
  SpotifyAlbum,
  SpotifyArtist,
  SpotifyAudiobook,
  SpotifyEpisode,
  SpotifyPlaylist,
  SpotifyPlaylistDetails,
  SpotifyShow,
  SpotifyTrack,
  SpotifyUser,
} from '../shared/helpers/SpotifyHelper';
import { Playlist } from '../models/playlist';
import { Song } from '../models/song';
import { LoginService } from './login.service';
import { Artist } from '../models/artist';
import {
  APISearch,
  AlbumsItem,
  ArtistsItem,
  AudiobooksItem,
  EpsiodesItem,
  ShowsItem,
} from '../models/spotifySearch';
import {
  BehaviorSubject,
  catchError,
  EMPTY,
  filter,
  map,
  Observable,
  tap,
} from 'rxjs';
import { spotifyConfiguration } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { User } from '../models/user';
import { Episode } from '../models/episode';
import { Show } from '../models/show';
import { Audiobook } from '../models/audiobook';
import { Album } from '../models/album';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  private spotifyApiUrl = spotifyConfiguration.spotifyApiBaseUrl;
  public playlistSongsSubject = new BehaviorSubject<Song[] | null>(null);
  public playlistSongs$ = this.playlistSongsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private loginService: LoginService,
    private toastr: ToastrService
  ) {}

  getUserPlaylists(
    userId: string | undefined,
    offset = 0,
    limit = 50
  ): Observable<Playlist[]> {
    const url =
      this.spotifyApiUrl +
      `/users/${userId}/playlists?limit=${limit}&offset=${offset}`;
    return this.http.get<any>(url).pipe(
      map((response) =>
        response.items.map((item: any) => SpotifyPlaylist(item))
      ),
      catchError((error) => {
        this.toastr.error(`Error fetching data from the API`);
        return EMPTY;
      })
    );
  }
  updatePlaylistSongs(updatedDetails: Song[]) {
    this.playlistSongsSubject.next(updatedDetails);
  }
  getFollowedArtists(): Observable<Artist[]> {
    const url = this.spotifyApiUrl + `/me/following?type=artist`;
    return this.http.get<any>(url).pipe(
      tap((response) => console.log(response)),
      map((response) =>
        response.artists.items.map((item: any) => SpotifyArtist(item))
      ),
      catchError((error) => {
        this.toastr.error(`Error fetching data from the API`);
        return EMPTY;
      })
    );
  }

  getUserProfile(userId: string | undefined): Observable<User> {
    const url = this.spotifyApiUrl + `/users/${userId}`;

    return this.http.get<any>(url).pipe(
      tap((response) => console.log(response)),
      map((response) => SpotifyUser(response)),
      catchError((error) => {
        this.toastr.error(`Error fetching data from the API`);
        return EMPTY;
      })
    );
  }

  getSavedTracks(offset = 0, limit = 50): Observable<Song[]> {
    const url = `${this.spotifyApiUrl}/me/tracks?offset=${offset}&limit=${limit}`;
    return this.http.get<any>(url).pipe(
      map((response) =>
        response.items.map((item: any) => SpotifyTrack(item.track))
      ),
      catchError((error) => {
        this.toastr.error(`Error fetching data from the API`);
        return EMPTY;
      })
    );
  }

  getTopArtists(limit = 10): Observable<Artist[]> {
    const url = `${this.spotifyApiUrl}/me/top/artists?limit=${limit}`;
    return this.http.get<any>(url).pipe(
      map((response) => response.items.map((item: any) => SpotifyArtist(item))),
      catchError((error) => {
        this.toastr.error(`Error fetching data from the API`);
        return EMPTY;
      })
    );
  }

  getPlaylistDetails(playlistId: string | null): Observable<Playlist> {
    const url = `${this.spotifyApiUrl}/playlists/${playlistId}`;
    return this.http.get<any>(url).pipe(
      map((playlistDetails) => SpotifyPlaylistDetails(playlistDetails)),
      catchError((error) => {
        this.toastr.error(`Error fetching data from the API`);
        return EMPTY;
      })
    );
  }
  searchForItems(
    term: string,
    searchTypes: string[],
    offset = 0,
    limit = 50
  ): Observable<{
    artists: Artist[];
    tracks: Song[];
    playlists: Playlist[];
    episodes: Episode[];
    shows: Show[];
    audiobooks: Audiobook[];
    albums: Album[];
  }> {
    // Ensure all search types are valid before constructing the URL
    const validSearchTypes = [
      'audiobook',
      'artist',
      'album',
      'playlist',
      'show',
      'track',
      'episode',
    ];
    if (!searchTypes.every((type) => validSearchTypes.includes(type))) {
      throw new Error('Invalid searchTypes. Please provide valid searchTypes.');
    }

    const typeParam = searchTypes.join('%2C');
    console.log(typeParam);
    const url = `${this.spotifyApiUrl}/search?q=${term}&type=${typeParam}&offset=${offset}&limit=${limit}`;

    return this.http.get<any>(url).pipe(
      map((response: APISearch) => {
        return {
          artists: response.artists?.items?.map((item: ArtistsItem) =>
            SpotifyArtist(item)
          ),
          tracks: response.tracks?.items?.map((item: any) =>
            SpotifyTrack(item)
          ),
          playlists: response.playlists?.items?.map((item: any) =>
            SpotifyPlaylistDetails(item)
          ),
          episodes: response.episodes?.items?.map((item: EpsiodesItem) =>
            SpotifyEpisode(item)
          ),
          shows: response.shows?.items?.map((item: ShowsItem) =>
            SpotifyShow(item)
          ),
          audiobooks: response.audiobooks?.items?.map((item: AudiobooksItem) =>
            SpotifyAudiobook(item)
          ),
          albums: response.albums?.items?.map((item: AlbumsItem) =>
            SpotifyAlbum(item)
          ),
        };
      })
    );
  }
  getFeaturedPlaylists(offset = 0, limit = 50): Observable<Playlist[]> {
    const url =
      this.spotifyApiUrl +
      `/browse/featured-playlists?offset=${offset}&limit=${limit}`;
    return this.http.get<any>(url).pipe(
      map((response) =>
        response.playlists.items.map((item: any) => SpotifyPlaylist(item))
      ),
      filter(Boolean),
      catchError((error) => {
        this.toastr.error('Failed to load featured playlists');
        return EMPTY;
      })
    );
  }

  getCategoryPlaylists(
    category: string,
    offset = 0,
    limit = 50
  ): Observable<Playlist[]> {
    const url = `${this.spotifyApiUrl}/browse/categories/${category}/playlists?offset=${offset}&limit=${limit}`;
    return this.http
      .get<any>(url)
      .pipe(
        map((response) =>
          response.playlists.items.map((item: any) => SpotifyPlaylist(item))
        )
      );
  }

  getAlbumtDetails(albumId: string | null): Observable<Album> {
    const url = `${this.spotifyApiUrl}/albums/${albumId}`;
    return this.http
      .get<AlbumsItem>(url)
      .pipe(map((album) => SpotifyAlbum(album)));
  }
  getAlbumTracks(albumId: string | null): Observable<Song[]> {
    const url = `${this.spotifyApiUrl}/albums/${albumId}/tracks`;
    console.log('fel album tracks');

    return this.http.get<any>(url).pipe(
      map((response) => {
        const items = response.items || [];
        return items.map((track: any) => SpotifyTrack(track));
      }),
      catchError((error) => {
        console.error('Error fetching top tracks:', error);
        return EMPTY;
      })
    );
  }

  getUserTopArtist(
    timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term',
    limit: number = 20,
    offset: number = 0
  ): Observable<Artist[]> {
    

    const url = `${this.spotifyApiUrl}/me/top/artists?time_range=${timeRange}&limit=${limit}&offset=${offset}`;
  
    return this.http.get<any>(url).pipe(
      map((response) => {
    return response.items.map((item: any) => SpotifyArtist(item)) as Artist[];
        
      }),
      catchError((error) => {
        this.toastr.error(`Error fetching top artists from the API`);
        console.error('API error:', error);
        return EMPTY;
      })
    );
  }

  getNewReleases(
    country: string = 'US',
    limit: number = 20,
    offset: number = 0
  ): Observable<Album[]> {
    const url = `${this.spotifyApiUrl}/browse/new-releases?country=${country}&limit=${limit}&offset=${offset}`;
  
    return this.http.get<any>(url).pipe(
      map((response) => {
        // Transform the albums in the response to Album model
        return response.albums.items.map((album: any) => SpotifyAlbum(album)) as Album[];
      }),
      catchError((error) => {
        this.toastr.error('Error fetching new releases from the API');
        console.error('API error:', error);
        return EMPTY;
      })
    );
  }


}
