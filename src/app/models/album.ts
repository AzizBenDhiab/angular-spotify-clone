import { Artist } from './artist';

export interface Album {
  id: string;
  total_tracks: number;
  imageUrl: string;
  release_date: string;
  name: string;
  artists: { id: string; name: string }[];
}
