import { Injectable } from '@angular/core';
import { spotifyConfiguration } from '../../../environments/environment';
import { BehaviorSubject, map, Observable, of, switchMap } from 'rxjs';
import { Playlist } from '../../models/playlist';
import { HttpClient } from '@angular/common/http';
import { LoginService } from '../login.service';
import { Song } from '../../models/song';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  private spotifyApiUrl = spotifyConfiguration.spotifyApiBaseUrl;
  private playlistDetailsSubject = new BehaviorSubject<Playlist | null>(null);
  public playlistDetails$ = this.playlistDetailsSubject.asObservable();
  public playlistsSubject= new BehaviorSubject<Playlist[] | null>(null);
  public playlists$ = this.playlistsSubject.asObservable();

  constructor(private http: HttpClient, private loginService: LoginService) { }

    addPlaylist(userId: string | undefined, playlist: any): Observable<any> {
      const url = this.spotifyApiUrl + `/users/${userId}/playlists`;
      return this.http.post<any>(url, playlist);
    }

  AddItem(item: any, playlist_id: String) {
    const url = `${this.spotifyApiUrl}/playlists/${playlist_id}/tracks`;
    return this.http.post<any>(url, item);
  }

  DeleteItem(playlistId: string, item: any): Observable<any> {
    const url = `${this.spotifyApiUrl}/playlists/${playlistId}/tracks`;
    console.log(item);
    return this.http.delete<any>(url, { body: item });
  }

  SaveTracks(reqBody: any) {
    const url = `${this.spotifyApiUrl}/me/tracks`;
    return this.http.put<any>(url, reqBody);
  }

  RemoveSavedTrack(reqBody: any) {
    const url = `${this.spotifyApiUrl}/me/tracks?ids=${reqBody}`;
    return this.http.delete<any>(url);
  }
  updatePlaylistDetails(updatedDetails: Playlist) {
    this.playlistDetailsSubject.next(updatedDetails);
  }
  updatePlaylists(updatedDetails: Playlist[]) {

    this.playlistsSubject.next(updatedDetails);
  }


  Check(reqBody: any){
    const url = `${this.spotifyApiUrl}/me/tracks/contains?ids=${reqBody}`;
    return this.http.get<any>(url);
  }

  isCurrentUserOwner(playlist: Playlist): Observable<boolean> {
    return this.loginService.currentUser$.pipe(
      switchMap((user) => {
        const currentUserId = user?.id;
        return of(currentUserId === playlist.owner);
      })
    );
  }

  isSongInPlaylist(song: Song): Observable<boolean | undefined> {
    return this.playlistDetails$.pipe(
      map((playlistDetails) => playlistDetails?.songs?.some((track) => track.id === song.id))
    );
  }
}
