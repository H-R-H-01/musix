import { create } from 'zustand'

export const usePlayerStore = create((set) => ({
  currentSong: null,
  isPlaying: false,
  volume: 0.8,
  progress: 0,
  duration: 0,
  queue: [],
  setPlayState: (isPlaying) => set({ isPlaying }),
  setCurrentSong: (song) => set({ currentSong: song, isPlaying: true }),
  setVolume: (volume) => set({ volume }),
  setProgress: (progress) => set({ progress }),
  setDuration: (duration) => set({ duration }),
  setQueue: (queue) => set({ queue }),
  playNext: () => set((state) => {
    // Basic logic for play next
    const currentIndex = state.queue.findIndex(s => s.id === state.currentSong?.id);
    if (currentIndex !== -1 && currentIndex < state.queue.length - 1) {
      return { currentSong: state.queue[currentIndex + 1], isPlaying: true };
    }
    return { isPlaying: false };
  }),
  playPrevious: () => set((state) => {
    const currentIndex = state.queue.findIndex(s => s.id === state.currentSong?.id);
    if (currentIndex > 0) {
      return { currentSong: state.queue[currentIndex - 1], isPlaying: true };
    }
    return state;
  }),
}))
