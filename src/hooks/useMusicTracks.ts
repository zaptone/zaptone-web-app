import { useQuery } from '@tanstack/react-query';
import { useNostr } from '@nostrify/react';
import { useCurrentUser } from './useCurrentUser';
import { MUSIC_EVENT_KINDS, MusicEventParser } from '@/lib/musicEvents';
import type { NostrEvent } from '@nostrify/nostrify';

interface UserTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  genre: string;
  audioUrl: string;
  coverUrl?: string;
  description: string;
  createdAt: number;
  event: NostrEvent;
}

export function useUserTracks(pubkey?: string) {
  const { nostr } = useNostr();
  const { user } = useCurrentUser();
  
  // Use provided pubkey or current user's pubkey
  const targetPubkey = pubkey || user?.pubkey;

  return useQuery({
    queryKey: ['user-tracks', targetPubkey],
    queryFn: async (c) => {
      if (!targetPubkey) return [];
      
      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(3000)]);
      
      const events = await nostr.query([
        {
          kinds: [MUSIC_EVENT_KINDS.MUSIC_TRACK],
          authors: [targetPubkey],
          limit: 50,
        }
      ], { signal });

      const tracks: UserTrack[] = [];
      
      for (const event of events) {
        const parsed = MusicEventParser.parseTrackEvent(event);
        if (parsed) {
          tracks.push({
            ...parsed,
            createdAt: event.created_at * 1000,
            event,
          });
        }
      }

      // Sort by creation date (newest first)
      return tracks.sort((a, b) => b.createdAt - a.createdAt);
    },
    enabled: !!targetPubkey,
  });
}

export function useRecentTracks() {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['recent-tracks'],
    queryFn: async (c) => {
      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(3000)]);
      
      const events = await nostr.query([
        {
          kinds: [MUSIC_EVENT_KINDS.MUSIC_TRACK],
          limit: 20,
        }
      ], { signal });

      const tracks: UserTrack[] = [];
      
      for (const event of events) {
        const parsed = MusicEventParser.parseTrackEvent(event);
        if (parsed) {
          tracks.push({
            ...parsed,
            createdAt: event.created_at * 1000,
            event,
          });
        }
      }

      return tracks.sort((a, b) => b.createdAt - a.createdAt);
    },
  });
}
