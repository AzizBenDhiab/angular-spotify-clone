import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Song } from '../models/song';
import { Playlist } from '../models/playlist';
import { Artist } from '../models/artist';
import { Album } from '../models/album';
import { User } from '../models/user';
import { Audiobook } from '../models/audiobook';
import { Show } from '../models/show';
import { Episode } from '../models/episode';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  constructor() {}

  private currentSong = new BehaviorSubject<Song | null>(null);
  public currentSong$ = this.currentSong.asObservable();
  private showAllSource = new BehaviorSubject<
    | Playlist[]
    | Artist[]
    | User[]
    | Audiobook[]
    | Show[]
    | Episode[]
    | Album[]
    | null
  >([]);

  showAll$ = this.showAllSource.asObservable();

  setShowAll(
    showAll:
      | Playlist[]
      | Artist[]
      | User[]
      | Audiobook[]
      | Show[]
      | Episode[]
      | Album[]
  ): void {
    this.showAllSource.next(showAll);
  }

  playMusic(song: Song | null) {
    this.currentSong.next(song);
  }
}
