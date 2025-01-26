/// <reference types="spotify-web-api-js" />
import { Playlist } from '../../models/playlist';
import { User } from '../../models/user';
import { Artist } from '../../models/artist';
import { addMilliseconds, format } from 'date-fns';
import { Song } from '../../models/song';
import { Audiobook } from '../../models/audiobook';
import {
  AlbumsItem,
  ArtistsItem,
  AudiobooksItem,
  EpsiodesItem,
  ShowsItem,
} from '../../models/spotifySearch';
import { Episode } from '../../models/episode';
import { Show } from '../../models/show';
import { Album } from '../../models/album';

export function SpotifyUser(user: any): User {
  return {
    id: user.id,
    name: user.display_name,
    imageUrl: getLastImageUrl(user.images),
  };
}

export function SpotifyPlaylist(
  playlist: SpotifyApi.PlaylistObjectSimplified
): Playlist | null {
  if (!playlist || !playlist.id) {
    return null;
  }
  return {
    id: playlist.id,
    name: playlist.name,
    imageUrl: getLastImageUrl(playlist.images),
    snapshot_id: playlist.snapshot_id,
    songs: null,
    owner: playlist.owner.id,
  };
}
export function SpotifyPlaylistDetails(
  playlist: SpotifyApi.PlaylistObjectFull
): Playlist {
  // Check if playlist or any required properties are null or undefined
  if (!playlist || !playlist.owner || !playlist.owner.id) {
    console.warn('Invalid playlist data:', playlist);
    return {
      id: '',
      name: '',
      imageUrl: '',
      snapshot_id: '',
      songs: [],
      owner: '',
    }; // Return a default empty Playlist object if the data is invalid
  }

  return {
    id: playlist.id || '', // If playlist.id is null/undefined, default to empty string
    name: playlist.name || '', // Default to empty string if name is null/undefined
    imageUrl: getFirstImageUrl(playlist.images),
    snapshot_id: playlist.snapshot_id || '', // Default to empty string if snapshot_id is null/undefined
    songs: playlist.tracks.items
      ? playlist.tracks.items.map((item) => SpotifyTrack(item.track))
      : [], // Ensure items exists before mapping
    owner: playlist.owner.id,
  };
}

export function SpotifyTrack(
  track: SpotifyApi.TrackObjectFull | SpotifyApi.EpisodeObjectFull
): Song {
  return {
    id: track.id,
    title: track.name,
    artists:
      'artists' in track
        ? track.artists.map((artist) => ({ id: artist.id, name: artist.name }))
        : [],
    album: {
      id: 'album' in track ? track.album.id : '',
      name: 'album' in track ? track.album.name : '',
      imageUrl: 'album' in track ? getFirstImageUrl(track.album.images) : '',
    },
    time: convertTime('duration_ms' in track ? track.duration_ms : 0),
    previewUrl: 'preview_url' in track ? track.preview_url : '',
    uri: track.uri,
  };
}

export function SpotifyArtist(artist: ArtistsItem): Artist {
  const sortedImages = artist.images
    .filter((image) => image.width !== undefined)
    .sort((a, b) => (a.width || 0) - (b.width || 0));
  const imageUrl =
    sortedImages.length > 0 ? sortedImages.pop()?.url : undefined;
  return {
    id: artist.id,
    name: artist.name,
    imageUrl: imageUrl || '',
    followers: null,
    images: null,
  };
}
export function SpotifyAlbum(album: AlbumsItem): Album {
  const sortedImages = album.images
    .filter((image) => image.width !== undefined)
    .sort((a, b) => (a.width || 0) - (b.width || 0));
  const imageUrl =
    sortedImages.length > 0 ? sortedImages.pop()?.url : undefined;
  return {
    id: album.id,
    total_tracks: album.total_tracks,
    imageUrl: imageUrl || '',
    release_date: album.release_date,
    name: album.name,
    artists:
      'artists' in album
        ? album.artists.map((artist) => ({ id: artist.id, name: artist.name }))
        : [],
  };
}
export function SpotifyEpisode(episode: EpsiodesItem): Episode {
  const sortedImages = episode.images
    .filter((image) => image.width !== undefined)
    .sort((a, b) => (a.width || 0) - (b.width || 0));
  const imageUrl =
    sortedImages.length > 0 ? sortedImages.pop()?.url : undefined;
  return {
    audio_preview_url: episode.audio_preview_url || '',
    description: episode.description,
    duration_ms: episode.duration_ms,
    id: episode.id,
    imageUrl: imageUrl || '',
    is_playable: episode.is_playable,
    name: episode.name,
    release_date: episode.release_date,
    resume_point: episode.resume_point,
  };
}

export function SpotifyAudiobook(audiobook: AudiobooksItem): Audiobook {
  const sortedImages = audiobook.images
    .filter((image) => image.width !== undefined)
    .sort((a, b) => (a.width || 0) - (b.width || 0));
  const imageUrl =
    sortedImages.length > 0 ? sortedImages.pop()?.url : undefined;
  return {
    id: audiobook.id,
    authors: audiobook.authors,
    edition: audiobook.edition,
    explicit: audiobook.explicit,
    imageUrl: imageUrl || '',
    name: audiobook.name,
    narrators: audiobook.narrators,
    total_chapters: audiobook.total_chapters,
  };
}

export function SpotifyShow(show: ShowsItem): Show {
  const sortedImages = show.images
    .filter((image) => image.width !== undefined)
    .sort((a, b) => (a.width || 0) - (b.width || 0));
  const imageUrl =
    sortedImages.length > 0 ? sortedImages.pop()?.url : undefined;
  return {
    id: show.id,
    imageUrl: imageUrl || '',
    name: show.name,
    publisher: show.publisher,
  };
}
const convertTime = (timeMs: number) => {
  const date = addMilliseconds(new Date(0), timeMs);
  return format(date, 'mm:ss');
};

function getLastImageUrl(images: SpotifyApi.ImageObject[] | undefined): string {
  return images && images.length > 0 ? images[images.length - 1].url : '';
}

function getFirstImageUrl(
  images: SpotifyApi.ImageObject[] | undefined,
  defaultValue: string = ''
): string {
  return images && images.length > 0
    ? images.shift()?.url || defaultValue
    : defaultValue;
}
