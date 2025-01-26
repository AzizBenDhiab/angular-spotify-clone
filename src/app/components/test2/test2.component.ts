import { Component } from '@angular/core';
import { Song } from '../../models/song';
import { MusicListComponent } from '../music-list/music-list.component';

@Component({
  selector: 'app-test2',
  standalone: true,
  imports: [MusicListComponent],
  template: `
    <app-music-list [songs]="dummySongs"></app-music-list>
  `,
})
export class Test2Component {
  dummySongs: Song[] = [
    {
      id: '1',
      title: 'Song One',
      artists: [{ id: 'a1', name: 'Artist One' }],
      album: { id: 'al1', name: 'Album One', imageUrl: 'https://via.placeholder.com/150' },
      time: '3:45',
      previewUrl: 'https://www.example.com/song1.mp3',
      addedAt: '2025-01-26',
      uri: 'spotify:track:1',
      isLiked: true,
    },
    {
      id: '2',
      title: 'Song Two',
      artists: [{ id: 'a2', name: 'Artist Two' }],
      album: { id: 'al2', name: 'Album Two', imageUrl: 'https://via.placeholder.com/150' },
      time: '4:12',
      previewUrl: 'https://www.example.com/song2.mp3',
      addedAt: '2025-01-25',
      uri: 'spotify:track:2',
      isLiked: false,
    },
    {
      id: '3',
      title: 'Song Three',
      artists: [{ id: 'a3', name: 'Artist Three' }],
      album: { id: 'al3', name: 'Album Three', imageUrl: 'https://via.placeholder.com/150' },
      time: '5:01',
      previewUrl: 'https://www.example.com/song3.mp3',
      addedAt: '2025-01-24',
      uri: 'spotify:track:3',
      isLiked: true,
    },
    {
      id: '4',
      title: 'Song Four',
      artists: [{ id: 'a4', name: 'Artist Four' }],
      album: { id: 'al4', name: 'Album Four', imageUrl: 'https://via.placeholder.com/150' },
      time: '2:58',
      previewUrl: 'https://www.example.com/song4.mp3',
      addedAt: '2025-01-23',
      uri: 'spotify:track:4',
      isLiked: false,
    },
    {
      id: '5',
      title: 'Song Five',
      artists: [{ id: 'a5', name: 'Artist Five' }],
      album: { id: 'al5', name: 'Album Five', imageUrl: 'https://via.placeholder.com/150' },
      time: '3:30',
      previewUrl: 'https://www.example.com/song5.mp3',
      addedAt: '2025-01-22',
      uri: 'spotify:track:5',
      isLiked: true,
    },
    {
      id: '6',
      title: 'Song Six',
      artists: [{ id: 'a6', name: 'Artist Six' }],
      album: { id: 'al6', name: 'Album Six', imageUrl: 'https://via.placeholder.com/150' },
      time: '4:20',
      previewUrl: 'https://www.example.com/song6.mp3',
      addedAt: '2025-01-21',
      uri: 'spotify:track:6',
      isLiked: false,
    },
    {
      id: '7',
      title: 'Song Seven',
      artists: [{ id: 'a7', name: 'Artist Seven' }],
      album: { id: 'al7', name: 'Album Seven', imageUrl: 'https://via.placeholder.com/150' },
      time: '3:10',
      previewUrl: 'https://www.example.com/song7.mp3',
      addedAt: '2025-01-20',
      uri: 'spotify:track:7',
      isLiked: true,
    }
  ];
}
