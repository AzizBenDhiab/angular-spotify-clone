import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { SpotifyService } from '../../services/spotify-service.service';
import { Artist } from '../../models/artist';
import { faPen, faSearch } from '@fortawesome/free-solid-svg-icons';
import { PlaylistService } from '../../services/playlist/playlist.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-playlist-header',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './playlist-header.component.html',
  styleUrl: './playlist-header.component.css'
})
export class PlaylistHeaderComponent {
  @Input() name: string = '';
  @Input() followers: number | string = '';
  @Input() imageUrl: string = '';
  @Input() verified: boolean = false;

  constructor(private playlistService: PlaylistService) {}

  protected readonly faSearch = faSearch;
}
