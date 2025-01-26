import { Component } from '@angular/core';
import { PlaylistHeaderComponent } from '../playlist-header/playlist-header.component';

@Component({
  selector: 'app-test3',
  standalone: true,
  imports: [PlaylistHeaderComponent],
  template: `<app-playlist-header 
               [name]="playlistName" 
               [followers]="playlistFollowers" 
               [imageUrl]="playlistImageUrl" 
               [verified]="playlistVerified">
             </app-playlist-header>`,
  styleUrl: './test3.component.css'
})
export class Test3Component {
  playlistName = 'My Favorite Playlist';
  playlistFollowers = 1234;
  playlistImageUrl = '../../../assets/images/default-image.png';
  playlistVerified = true;

}
