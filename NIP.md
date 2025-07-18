# NIP-ZapTone: Music Events

`draft` `optional`

This NIP defines event kinds for music-related content on the Nostr network, enabling decentralized music sharing and discovery.

## Events

This NIP defines three new event kinds:

- `31808`: Music Track
- `31809`: Music Album  
- `31810`: Music Playlist

All events are **addressable events** (30000 ≤ kind < 40000), identified by `pubkey` + `kind` + `d` tag combination.

## Music Track (Kind 31808)

A music track event represents a single audio track.

### Event Structure

```json
{
  "kind": 31808,
  "content": "<track description or lyrics>",
  "tags": [
    ["d", "<unique-track-id>"],
    ["title", "<track-title>"],
    ["artist", "<artist-name>"],
    ["duration", "<duration-in-seconds>"],
    ["genre", "<music-genre>"],
    ["url", "<audio-file-url>"],
    ["cover", "<cover-art-url>"],
    ["license", "<license-type>"],
    ["price", "<price-in-sats>"],
    ["album", "<album-id>"],
    ["track_number", "<track-number-in-album>"],
    ["release_date", "<YYYY-MM-DD>"]
  ]
}
```

### Required Tags

- `d`: Unique identifier for the track
- `title`: Track title
- `artist`: Artist name
- `duration`: Track duration in seconds
- `genre`: Music genre
- `url`: URL to the audio file

### Optional Tags

- `cover`: URL to cover art image
- `license`: License type (e.g., "CC-BY-SA", "All Rights Reserved")
- `price`: Price in satoshis for purchasing/streaming
- `album`: Reference to album ID if part of an album
- `track_number`: Track number within an album
- `release_date`: Release date in YYYY-MM-DD format

## Music Album (Kind 31809)

A music album event represents a collection of tracks.

### Event Structure

```json
{
  "kind": 31809,
  "content": "<album description>",
  "tags": [
    ["d", "<unique-album-id>"],
    ["title", "<album-title>"],
    ["artist", "<artist-name>"],
    ["cover", "<album-cover-url>"],
    ["release_date", "<YYYY-MM-DD>"],
    ["genre", "<primary-genre>"],
    ["total_tracks", "<number-of-tracks>"],
    ["tracks", "<comma-separated-track-ids>"]
  ]
}
```

### Required Tags

- `d`: Unique identifier for the album
- `title`: Album title
- `artist`: Artist name
- `cover`: URL to album cover art
- `release_date`: Release date in YYYY-MM-DD format
- `genre`: Primary genre of the album
- `total_tracks`: Total number of tracks
- `tracks`: Comma-separated list of track IDs

## Music Playlist (Kind 31810)

A music playlist event represents a curated collection of tracks.

### Event Structure

```json
{
  "kind": 31810,
  "content": "<playlist description>",
  "tags": [
    ["d", "<unique-playlist-id>"],
    ["title", "<playlist-title>"],
    ["creator", "<creator-name>"],
    ["tracks", "<comma-separated-track-ids>"],
    ["public", "<true|false>"],
    ["created", "<unix-timestamp>"],
    ["cover", "<playlist-cover-url>"]
  ]
}
```

### Required Tags

- `d`: Unique identifier for the playlist
- `title`: Playlist title
- `creator`: Creator name
- `tracks`: Comma-separated list of track IDs
- `public`: Whether the playlist is public (true/false)
- `created`: Creation timestamp

### Optional Tags

- `cover`: URL to playlist cover art

## File Storage

Audio files and cover art should be stored using Blossom servers (NIP-96) for decentralized file hosting. The `url` and `cover` tags should contain the Blossom URLs returned from upload.

## Querying

### Get tracks by artist
```javascript
const tracks = await nostr.query([
  { kinds: [31808], "#artist": ["Artist Name"] }
]);
```

### Get album tracks
```javascript
const albumTracks = await nostr.query([
  { kinds: [31808], "#album": ["album-id"] }
]);
```

### Get tracks by genre
```javascript
const genreTracks = await nostr.query([
  { kinds: [31808], "#genre": ["Electronic"] }
]);
```

### Get user's playlists
```javascript
const playlists = await nostr.query([
  { kinds: [31810], authors: ["user-pubkey"] }
]);
```

## Implementation Notes

- Track IDs should be unique within the artist's scope
- Album and playlist IDs should be unique within the creator's scope
- Duration should be provided in seconds as an integer
- Prices should be in satoshis for Lightning Network compatibility
- Cover art images should ideally be square (1:1 aspect ratio)
- Audio files should be in web-compatible formats (MP3, AAC, OGG, etc.)

## Examples

### Track Event
```json
{
  "kind": 31808,
  "pubkey": "...",
  "created_at": 1672531200,
  "content": "My latest electronic track with deep bass and atmospheric elements.",
  "tags": [
    ["d", "deep-space-journey"],
    ["title", "Deep Space Journey"],
    ["artist", "ElectroNaut"],
    ["duration", "240"],
    ["genre", "Electronic"],
    ["url", "https://blossom.primal.net/abc123.mp3"],
    ["cover", "https://blossom.primal.net/cover456.jpg"],
    ["license", "CC-BY-SA"],
    ["release_date", "2023-01-01"]
  ]
}
```

### Album Event
```json
{
  "kind": 31809,
  "pubkey": "...",
  "created_at": 1672531200,
  "content": "A journey through space and time with electronic soundscapes.",
  "tags": [
    ["d", "cosmic-voyager-album"],
    ["title", "Cosmic Voyager"],
    ["artist", "ElectroNaut"],
    ["cover", "https://blossom.primal.net/album789.jpg"],
    ["release_date", "2023-01-01"],
    ["genre", "Electronic"],
    ["total_tracks", "8"],
    ["tracks", "deep-space-journey,stellar-winds,nebula-dreams,cosmic-dance,void-walker,star-birth,galactic-tide,homeward-bound"]
  ]
}
```
