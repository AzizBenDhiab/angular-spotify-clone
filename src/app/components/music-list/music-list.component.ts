import {
  Component,
  Input,
  OnChanges,
  OnInit,
  signal,
  computed,
  ChangeDetectorRef,
} from '@angular/core';
import {
  faClock,
  faEllipsis,
  faPlay,
  faSave,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { Song } from '../../models/song';
import { PlayerService } from '../../services/player.service';
import { PlaylistService } from '../../services/playlist/playlist.service';
import { ToastrService } from 'ngx-toastr';
import { SpotifyService } from '../../services/spotify-service.service';
import { catchError, switchMap, tap } from 'rxjs';
import { Playlist } from '../../models/playlist';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-music-list',
  imports: [CommonModule, FontAwesomeModule],
  standalone: true,
  templateUrl: './music-list.component.html',
  styleUrl: './music-list.component.css',
})
export class MusicListComponent implements OnInit, OnChanges {
  @Input() songs: Song[] | null = [];
  @Input() playlist!: Playlist;

  clockIcon = faClock;
  playIcon = faPlay;
  moreIcon = faEllipsis;
  saveIcon = faSave;
  deleteIcon = faTrash;

  showMore = signal<boolean>(false); // Signal to track "show more" state

  displayedSongs = computed(() => {
    const songs = this.showMore()
      ? this.songs || []
      : this.songs?.slice(0, 5) || [];
    //   console.log('Computed songs:', songs);
    return songs;
  });

  constructor(
    public playerService: PlayerService,
    public playlistService: PlaylistService,
    private toast: ToastrService,
    private cdr: ChangeDetectorRef,

    private spotifyService: SpotifyService
  ) {}

  ngOnInit(): void {
    // Initial state
    this.showMore.set(false);
    // console.log('MusicListComponent INIT', {
    //   songs: this.songs,
    //   songsLength: this.songs?.length,
    // });
  }

  ngOnChanges(): void {
    this.cdr.detectChanges(); // Force change detection
  }

  toggleShowMore(): void {
    console.log('Clicked show more');
    console.log('Current songs:', this.songs);
    console.log('Current show more state:', this.showMore());
    this.showMore.set(!this.showMore());
    console.log('New show more state:', this.showMore());
    console.log('New displayed songs:', this.displayedSongs());
  }

  getArtists(song: Song): string {
    return song.artists.map((artist) => artist.name).join(', ');
  }

  deleteItem(song: Song): void {
    const requestBody = {
      tracks: [{ uri: song.uri }],
      snapshot_id: this.playlist.snapshot_id,
    };

    this.playlistService
      .DeleteItem(this.playlist.id, requestBody)
      .pipe(
        switchMap((response) => {
          if (response.snapshot_id !== this.playlist.snapshot_id) {
            this.toast.success('Deleted from the playlist');
          } else {
            this.toast.error('Try Again');
          }
          return this.spotifyService.getPlaylistDetails(this.playlist.id);
        }),
        tap((updatedDetails) => {
          this.playlistService.updatePlaylistDetails(updatedDetails);
        }),
        catchError((error) => {
          console.error('Error deleting item:', error);
          this.toast.error('Error deleting item');
          throw error;
        })
      )
      .subscribe();
  }

  addToLikedSongs(song: Song): void {
    const requestBody = { ids: [song.id] };

    this.playlistService
      .SaveTracks(requestBody)
      .pipe(
        tap(() => {
          song.isLiked = true;
          this.toast.success('Added to Liked Songs');
        }),
        catchError((error) => {
          console.error('Error adding to liked songs:', error);
          this.toast.error('Error adding to liked songs');
          throw error;
        })
      )
      .subscribe();
  }

  removeFromLikedSongs(song: Song): void {
    this.playlistService
      .RemoveSavedTrack(song.id)
      .pipe(
        switchMap(() => this.spotifyService.getSavedTracks()),
        tap((songs) => {
          this.spotifyService.updatePlaylistSongs(songs);
          song.isLiked = false;
          this.toast.success('Removed From Liked Songs');
        }),
        catchError((error) => {
          console.error('Error removing from liked songs:', error);
          this.toast.error('Error removing from liked songs');
          throw error;
        })
      )
      .subscribe();
  }

  PlaySong(song: Song): void {
    this.playerService.playMusic(song);
  }
}
