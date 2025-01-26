import { Component } from '@angular/core';
import { ListItemComponent } from '../list-item/list-item.component';
import { Playlist } from '../../models/playlist';
import { Artist } from '../../models/artist';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [ListItemComponent],
  template: `
    <app-list-item
      [items]="testArtists"
      [title]="'Test Playlist'"
      [shouldApplyRoundedClass]="true"
    ></app-list-item>
  `,
  styleUrls: ['./test.component.css'],
})
export class TestListItemComponent {
  // Dummy data with image URLs
  testArtists: Artist[] = [
    {
      id: '1',
      name: 'Artist 1',
      followers: { total: 10000 },
      images: [
        { url: 'https://via.placeholder.com/150' }, // Assuming 'images' contains objects with URLs
      ],
      imageUrl: 'https://via.placeholder.com/150',
    },
    {
      id: '2',
      name: 'Artist 2',
      followers: { total: 20000 },
      images: [{ url: 'https://via.placeholder.com/150' }],
      imageUrl: 'https://via.placeholder.com/150',
    },
    {
      id: '3',
      name: 'Artist 3',
      followers: { total: 30000 },
      images: [{ url: 'https://via.placeholder.com/150' }],
      imageUrl: 'https://via.placeholder.com/150',
    },
  ];
}
