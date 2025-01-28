import {
  ChangeDetectorRef,
  Component,
  inject,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable, switchMap, tap } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faGuitar,
  faHome,
  faMusic,
  faPlus,
  faSearch,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import { LoginService } from '../../services/login.service';
import { SpotifyService } from '../../services/spotify-service.service';
import { PlaylistService } from '../../services/playlist/playlist.service';
import { Song } from '../../models/song';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import { MenuUserItemComponent } from '../menu-user-item/menu-user-item.component';
import { DialogModule } from 'primeng/dialog';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-left-panel',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    MenuItemComponent,
    MenuUserItemComponent,
    DialogModule,
  ],
  animations: [
    trigger('dialogAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
    ]),
  ],
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.css'],
})
export class LeftPanelComponent implements OnInit, OnChanges {
  private router = inject(Router);
  savedTracks$!: Observable<Song[]>;
  visible = false;
  Form = new FormGroup({
    playlistName: new FormControl(''),
  });

  homeIcon = faHome;
  searchIcon = faSearch;
  artistIcon = faGuitar;
  playlistIcon = faMusic;
  signOutIcon = faSignOutAlt;
  addIcon = faPlus;

  constructor(
    public spotifyService: SpotifyService,
    public loginService: LoginService,
    public playlistService: PlaylistService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.cdr.detectChanges();
  }

  ngOnInit() {
    this.getPlaylists()?.subscribe((response) => {
      this.playlistService.updatePlaylists(response);
    });
    this.savedTracks$ = this.spotifyService.getSavedTracks();
  }

  showDialog() {
    this.visible = true;
    this.cdr.detectChanges();
  }

  addPlaylist(value: any) {
    if (value == null) {
      value = 'new Playlist';
    }

    const newPlaylist = {
      name: value,
      description: 'New playlist description',
      public: false,
    };

    const currentUser = this.loginService.currentUser();
    if (!currentUser?.id) {
      console.error('No user found.');
      return;
    }

    this.playlistService
      .addPlaylist(currentUser.id, newPlaylist)
      .pipe(
        switchMap((response) =>
          this.spotifyService.getUserPlaylists(currentUser.id).pipe(
            tap((playlists) => {
              this.visible = false;
              this.router.navigate([`home/playlist/${response.id}`]);
              this.playlistService.updatePlaylists(playlists);
            })
          )
        )
      )
      .subscribe({
        error: (err) => console.error('Error adding playlist:', err),
      });
  }

  cancel() {
    this.visible = false;
  }

  private getPlaylists() {
    const currentUser = this.loginService.currentUser();
    if (!currentUser?.id) {
      console.error('No user found.');
      return;
    }
    return this.spotifyService.getUserPlaylists(currentUser.id);
  }

  logout() {
    this.loginService.logout();
  }
}
