import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const MOCK_LIKED_SONGS = [
  {
    id: '1',
    title: 'Neon Nights',
    artist: 'Synthwave Boy',
    cover_url: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=300&h=300',
    duration: 215,
  }
];

export const useLibraryStore = create(
  persist(
    (set, get) => ({
  playlists: [
    {
      id: 'liked-music',
      name: 'Liked Music',
      description: 'Your favorite tracks',
      isDefault: true,
      cover_url: 'https://images.unsplash.com/photo-1493225457124-a1a2a5f5f924?auto=format&fit=crop&q=80&w=300&h=300',
      songs: MOCK_LIKED_SONGS
    },
    {
      id: 'p1',
      name: 'Chill Vibes',
      description: 'Relaxing sounds for a sunday afternoon',
      isDefault: false,
      cover_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&q=80&w=300&h=300',
      songs: []
    }
  ],
  homeSections: [
    { id: 'recently-played', title: 'Recently Played', type: 'grid', personalized: true },
    { id: '1', title: 'Good evening', type: 'grid' },
    { id: '2', title: 'Made For You', type: 'list' },
    { id: 'weekly-highlights', title: 'Weekly Highlights', type: 'list' }
  ],
  createPlaylist: (name) => set((state) => ({
    playlists: [...state.playlists, {
      id: Date.now().toString(),
      name,
      description: '',
      isDefault: false,
      cover_url: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=300&h=300', // default cover
      songs: []
    }]
  })),
  addSongToPlaylist: (playlistId, song) => set((state) => ({
    playlists: state.playlists.map(p => 
      p.id === playlistId ? { ...p, songs: [...p.songs, song] } : p
    )
  })),
  toggleLike: (song) => set((state) => {
    const likedMusic = state.playlists.find(p => p.id === 'liked-music');
    const isAlreadyLiked = likedMusic.songs.some(s => s.id === song.id);
    
    return {
      playlists: state.playlists.map(p => {
        if (p.id === 'liked-music') {
          return {
            ...p,
            songs: isAlreadyLiked 
              ? p.songs.filter(s => s.id !== song.id) 
              : [...p.songs, song]
          };
        }
        return p;
      })
    };
  }),
  isLiked: (songId) => (state) => {
    const likedMusic = state.playlists.find(p => p.id === 'liked-music');
    return likedMusic?.songs.some(s => s.id === songId);
  },
  downloadedSongs: [],
  recentlyPlayed: [],
  toggleDownload: (song) => set((state) => {
    const isDownloaded = state.downloadedSongs.some(s => s.id === song.id);
    return {
      downloadedSongs: isDownloaded
        ? state.downloadedSongs.filter(s => s.id !== song.id)
        : [...state.downloadedSongs, { ...song, downloadedAt: new Date().toISOString() }]
    };
  }),
  isDownloaded: (songId) => (state) => {
    return state.downloadedSongs.some(s => s.id === songId);
  },
  addToRecentlyPlayed: (song) => set((state) => {
    const filtered = state.recentlyPlayed.filter(s => s.id !== song.id);
    return {
      recentlyPlayed: [song, ...filtered].slice(0, 10)
    };
  }),
  karaokeRecordings: [],
  addKaraokeRecording: (recording) => set((state) => ({
    karaokeRecordings: [recording, ...state.karaokeRecordings]
  })),
  updateHomeSections: (sections) => set({ homeSections: sections })
}),
{
  name: 'musix-library',
}
)
)


