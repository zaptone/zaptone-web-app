// Music-specific Nostr event kinds as per ZapTone custom NIPs
export const MUSIC_EVENT_KINDS = {
  MUSIC_TRACK: 31808,
  MUSIC_ALBUM: 31809,
  MUSIC_PLAYLIST: 31810,
} as const;

// Music track event structure (Kind 31808)
export interface MusicTrackEvent {
  kind: typeof MUSIC_EVENT_KINDS.MUSIC_TRACK;
  content: string; // Track description/lyrics
  tags: Array<[string, string]>; // Flexible tag structure
}

// Music album event structure (Kind 31809)
export interface MusicAlbumEvent {
  kind: typeof MUSIC_EVENT_KINDS.MUSIC_ALBUM;
  content: string; // Album description
  tags: Array<[string, string]>; // Flexible tag structure
}

// Music playlist event structure (Kind 31810)
export interface MusicPlaylistEvent {
  kind: typeof MUSIC_EVENT_KINDS.MUSIC_PLAYLIST;
  content: string; // Playlist description
  tags: Array<[string, string]>; // Flexible tag structure
}

// Helper functions for creating music events
export class MusicEventBuilder {
  static createTrackEvent(trackData: {
    id: string;
    title: string;
    artist: string;
    duration: number;
    genre: string;
    audioUrl: string;
    coverUrl?: string;
    description?: string;
    license?: string;
    price?: number;
    albumId?: string;
    trackNumber?: number;
    releaseDate?: string;
  }): Partial<MusicTrackEvent> {
    const tags: MusicTrackEvent['tags'] = [
      ['d', trackData.id],
      ['title', trackData.title],
      ['artist', trackData.artist],
      ['duration', trackData.duration.toString()],
      ['genre', trackData.genre],
      ['url', trackData.audioUrl],
    ];

    if (trackData.coverUrl) tags.push(['cover', trackData.coverUrl]);
    if (trackData.license) tags.push(['license', trackData.license]);
    if (trackData.price) tags.push(['price', trackData.price.toString()]);
    if (trackData.albumId) tags.push(['album', trackData.albumId]);
    if (trackData.trackNumber) tags.push(['track_number', trackData.trackNumber.toString()]);
    if (trackData.releaseDate) tags.push(['release_date', trackData.releaseDate]);

    return {
      kind: MUSIC_EVENT_KINDS.MUSIC_TRACK,
      content: trackData.description || '',
      tags,
    };
  }

  static createAlbumEvent(albumData: {
    id: string;
    title: string;
    artist: string;
    coverUrl: string;
    releaseDate: string;
    genre: string;
    trackIds: string[];
    description?: string;
  }): Partial<MusicAlbumEvent> {
    const tags: MusicAlbumEvent['tags'] = [
      ['d', albumData.id],
      ['title', albumData.title],
      ['artist', albumData.artist],
      ['cover', albumData.coverUrl],
      ['release_date', albumData.releaseDate],
      ['genre', albumData.genre],
      ['total_tracks', albumData.trackIds.length.toString()],
      ['tracks', albumData.trackIds.join(',')],
    ];

    return {
      kind: MUSIC_EVENT_KINDS.MUSIC_ALBUM,
      content: albumData.description || '',
      tags,
    };
  }

  static createPlaylistEvent(playlistData: {
    id: string;
    title: string;
    creator: string;
    trackIds: string[];
    coverUrl?: string;
    description?: string;
    isPublic?: boolean;
  }): Partial<MusicPlaylistEvent> {
    const tags: MusicPlaylistEvent['tags'] = [
      ['d', playlistData.id],
      ['title', playlistData.title],
      ['creator', playlistData.creator],
      ['tracks', playlistData.trackIds.join(',')],
      ['public', (playlistData.isPublic ?? true).toString()],
      ['created', Math.floor(Date.now() / 1000).toString()],
    ];

    if (playlistData.coverUrl) tags.push(['cover', playlistData.coverUrl]);

    return {
      kind: MUSIC_EVENT_KINDS.MUSIC_PLAYLIST,
      content: playlistData.description || '',
      tags,
    };
  }
}

// Helper functions for parsing music events
export class MusicEventParser {
  static parseTrackEvent(event: any): {
    id: string;
    title: string;
    artist: string;
    duration: number;
    genre: string;
    audioUrl: string;
    coverUrl?: string;
    description: string;
    license?: string;
    price?: number;
    albumId?: string;
    trackNumber?: number;
    releaseDate?: string;
  } | null {
    if (event.kind !== MUSIC_EVENT_KINDS.MUSIC_TRACK) return null;

    const getTag = (name: string) => event.tags.find((tag: string[]) => tag[0] === name)?.[1];

    const duration = parseInt(getTag('duration') || '0');
    const price = getTag('price') ? parseInt(getTag('price')) : undefined;
    const trackNumber = getTag('track_number') ? parseInt(getTag('track_number')) : undefined;

    return {
      id: getTag('d') || '',
      title: getTag('title') || '',
      artist: getTag('artist') || '',
      duration,
      genre: getTag('genre') || '',
      audioUrl: getTag('url') || '',
      coverUrl: getTag('cover'),
      description: event.content || '',
      license: getTag('license'),
      price,
      albumId: getTag('album'),
      trackNumber,
      releaseDate: getTag('release_date'),
    };
  }

  static parseAlbumEvent(event: any): {
    id: string;
    title: string;
    artist: string;
    coverUrl: string;
    releaseDate: string;
    genre: string;
    totalTracks: number;
    trackIds: string[];
    description: string;
  } | null {
    if (event.kind !== MUSIC_EVENT_KINDS.MUSIC_ALBUM) return null;

    const getTag = (name: string) => event.tags.find((tag: string[]) => tag[0] === name)?.[1];

    return {
      id: getTag('d') || '',
      title: getTag('title') || '',
      artist: getTag('artist') || '',
      coverUrl: getTag('cover') || '',
      releaseDate: getTag('release_date') || '',
      genre: getTag('genre') || '',
      totalTracks: parseInt(getTag('total_tracks') || '0'),
      trackIds: getTag('tracks')?.split(',') || [],
      description: event.content || '',
    };
  }

  static parsePlaylistEvent(event: any): {
    id: string;
    title: string;
    creator: string;
    trackIds: string[];
    coverUrl?: string;
    description: string;
    isPublic: boolean;
    createdAt: number;
  } | null {
    if (event.kind !== MUSIC_EVENT_KINDS.MUSIC_PLAYLIST) return null;

    const getTag = (name: string) => event.tags.find((tag: string[]) => tag[0] === name)?.[1];

    return {
      id: getTag('d') || '',
      title: getTag('title') || '',
      creator: getTag('creator') || '',
      trackIds: getTag('tracks')?.split(',') || [],
      coverUrl: getTag('cover'),
      description: event.content || '',
      isPublic: getTag('public') === 'true',
      createdAt: parseInt(getTag('created') || '0'),
    };
  }
}
