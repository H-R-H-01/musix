import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle, Mic2, ListMusic, MonitorSpeaker, Heart, Share2, Download } from 'lucide-react';
import { useEffect } from 'react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useLibraryStore } from '../../store/useLibraryStore';
import { useAuthStore } from '../../store/useAuthStore';
import { cn } from '../../lib/utils';

export default function Player() {
  const { volume, progress, duration, setPlayState, isPlaying, currentSong, playNext, playPrevious, setProgress, isKaraokeMode, setKaraokeMode } = usePlayerStore();
  const { user, incrementListeningTime } = useAuthStore();
  const { toggleLike, isLiked, toggleDownload, isDownloaded } = useLibraryStore();

  useEffect(() => {
    let interval;
    if (isPlaying && currentSong) {
      interval = setInterval(() => {
        incrementListeningTime(1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentSong]);


  const handlePlayPause = () => {
    if (currentSong) {
      setPlayState(!isPlaying);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const newTime = percentage * duration;
    
    setProgress(newTime);
    window.dispatchEvent(new CustomEvent('audio-seek', { detail: newTime }));
  };

  const handleShare = () => {
    if (currentSong) {
      navigator.clipboard.writeText(`https://musix.app/song/${currentSong.id}`);
      alert('Link copied to clipboard!');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const liked = useLibraryStore(isLiked(currentSong?.id));
  const downloaded = useLibraryStore(isDownloaded(currentSong?.id));

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl h-24 glass dark:glass-dark rounded-[2rem] px-8 flex items-center justify-between z-50 transition-all duration-500 shadow-premium group/player">
      
      {/* Current Song Details */}
      <div className="w-1/4 flex items-center gap-5">
        {currentSong ? (
          <>
            <div className="relative group/cover">
              <img 
                src={currentSong.cover_url} 
                alt={currentSong.title} 
                className="w-16 h-16 rounded-2xl object-cover shadow-lg group-hover/cover:scale-105 transition-transform duration-500"
              />
              <div className={cn(
                "absolute inset-0 rounded-2xl bg-primary/20 animate-pulse-subtle",
                !isPlaying && "hidden"
              )} />
            </div>
            <div className="flex flex-col min-w-0">
              <h4 className="text-[15px] font-bold truncate group-hover/player:text-primary transition-colors">{currentSong.title}</h4>
              <p className="text-xs font-semibold text-muted-foreground truncate hover:text-foreground cursor-pointer transition-colors mt-0.5">{currentSong.artist}</p>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-4 opacity-40">
            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center border border-border/20">
               <ListMusic size={24} className="text-muted-foreground" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="w-28 h-4 rounded-full bg-secondary"></div>
              <div className="w-16 h-3 rounded-full bg-secondary/50"></div>
            </div>
          </div>
        )}
      </div>

      {/* Controls & Progress */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-xl mx-8">
        <div className="flex items-center gap-8 mb-3">
          <button className="text-muted-foreground hover:text-primary transition-all active:scale-90">
            <Shuffle size={20} />
          </button>
          <button 
            onClick={playPrevious}
            className="text-foreground/80 hover:text-foreground transition-all active:scale-90"
          >
            <SkipBack size={24} fill="currentColor" />
          </button>
          
          <button 
            onClick={handlePlayPause}
            className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center hover:scale-110 hover:shadow-xl hover:shadow-primary/30 active:scale-95 transition-all outline-none"
          >
            {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
          </button>

          <button 
            onClick={playNext}
            className="text-foreground/80 hover:text-foreground transition-all active:scale-90"
          >
            <SkipForward size={24} fill="currentColor" />
          </button>
          <button className="text-muted-foreground hover:text-primary transition-all active:scale-90">
            <Repeat size={20} />
          </button>
        </div>

        {/* Improved Progress Bar */}
        <div className="w-full flex items-center gap-4 text-[10px] font-bold text-muted-foreground/80 tracking-widest">
          <span className="w-10 text-right tabular-nums">{formatTime(progress)}</span>
          <div 
            className="flex-1 h-1.5 bg-secondary/50 rounded-full cursor-pointer group/progress relative overflow-hidden"
            onClick={handleSeek}
          >
            <div className="absolute inset-0 bg-secondary/30" />
            <div 
              className="h-full bg-linear-to-r from-primary to-primary/60 relative group-hover/progress:from-primary group-hover/progress:to-primary transition-all rounded-full"
              style={{ width: `${(progress / Math.max(duration, 1)) * 100}%` }}
            >
               <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/30 backdrop-blur-sm" />
            </div>
          </div>
          <span className="w-10 tabular-nums">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Actions & Volume */}
      <div className="w-1/4 flex items-center justify-end gap-5">
        <div className="flex items-center gap-1.5 border-r border-border/20 pr-5">
          <button 
            onClick={() => setKaraokeMode(!isKaraokeMode)}
            className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90",
              isKaraokeMode ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
            title="Karaoke Mode"
          >
            <Mic2 size={18} />
          </button>
          <button 
            onClick={() => currentSong && toggleLike(currentSong)}
            className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90 hover:bg-secondary",
              liked ? "text-red-500" : "text-muted-foreground"
            )}
          >
            <Heart size={18} fill={liked ? "currentColor" : "none"} />
          </button>
          <button 
            onClick={() => currentSong && toggleDownload(currentSong)}
            className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90 hover:bg-secondary",
              downloaded ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Download size={18} className={cn(downloaded && "animate-bounce")} />
          </button>
        </div>
        
        <div className="flex items-center gap-3 group/volume w-32 ml-1">
          <Volume2 size={18} className="text-muted-foreground group-hover/volume:text-primary transition-colors" />
          <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden cursor-pointer">
            <div 
              className="h-full bg-primary transition-all"
              style={{ width: `${volume * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
