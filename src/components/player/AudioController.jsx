import { useEffect, useRef } from 'react';
import { usePlayerStore } from '../../store/usePlayerStore';

export default function AudioController() {
  const { 
    currentSong, 
    isPlaying, 
    volume, 
    setPlayState, 
    setProgress, 
    setDuration, 
    playNext, 
    playPrevious 
  } = usePlayerStore();
  
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => setProgress(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => playNext();

    const handleSeek = (e) => {
      audio.currentTime = e.detail;
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    window.addEventListener('audio-seek', handleSeek);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      window.removeEventListener('audio-seek', handleSeek);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (currentSong?.song_url) {
      if (audio.src !== currentSong.song_url) {
        audio.src = currentSong.song_url;
        if (isPlaying) audio.play().catch(console.error);
      }
    }
  }, [currentSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  // Media Session API
  useEffect(() => {
    if ('mediaSession' in navigator && currentSong) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentSong.title,
        artist: currentSong.artist,
        album: 'Musix',
        artwork: [
          { src: currentSong.cover_url, sizes: '96x96', type: 'image/png' },
          { src: currentSong.cover_url, sizes: '128x128', type: 'image/png' },
          { src: currentSong.cover_url, sizes: '192x192', type: 'image/png' },
          { src: currentSong.cover_url, sizes: '256x256', type: 'image/png' },
          { src: currentSong.cover_url, sizes: '384x384', type: 'image/png' },
          { src: currentSong.cover_url, sizes: '512x512', type: 'image/png' },
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => setPlayState(true));
      navigator.mediaSession.setActionHandler('pause', () => setPlayState(false));
      navigator.mediaSession.setActionHandler('previoustrack', () => playPrevious());
      navigator.mediaSession.setActionHandler('nexttrack', () => playNext());
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime) {
          audioRef.current.currentTime = details.seekTime;
        }
      });
    }
  }, [currentSong, setPlayState, playNext, playPrevious]);

  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
    }
  }, [isPlaying]);

  return null;
}
