import { Song } from './song';

export interface Playlist {
  id: string;
  name: string;
  imageUrl: string;
  snapshot_id: string;
  songs: Song[] | null;
  owner: string;
}
