import { Component } from '@angular/core';
import { AddSongComponent } from '../add-song/add-song.component';

@Component({
  selector: 'app-dummy-add-song',
  standalone: true,
  imports: [AddSongComponent],
  template: `
    <div>
      <h1>Test Add Song Feature</h1>
      <app-add-song [playlistId]="'testPlaylistId'"></app-add-song>
    </div>
  `,
})
export class DummyAddSongComponent {}
