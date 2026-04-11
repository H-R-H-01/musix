import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle, Mic2, ListMusic, MonitorSpeaker, Heart, Share2, Download } from 'lucide-react';
import { useEffect } from 'react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useLibraryStore } from '../../store/useLibraryStore';
import { useAuthStore } from '../../store/useAuthStore';
import { cn } from '../../lib/utils';

export default function Player() {
  const { volume, progress, duration, setPlayState, isPlaying, currentSong } = usePlayerStore();
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
    <div className="fixed bottom-0 left-0 right-0 h-24 bg-player/80 backdrop-blur-xl border-t border-border px-6 flex items-center justify-between z-50 transition-colors shadow-[0_-4px_24px_rgba(0,0,0,0.05)] dark:shadow-none">
      
      {/* Current Song Details */}
      <div className="w-1/3 flex items-center gap-4">
        {currentSong ? (
          <>
            <img 
              src={currentSong.cover_url} 
              alt={currentSong.title} 
              className="w-14 h-14 rounded-md object-cover shadow-md"
            />
            <div className="flex flex-col min-w-0">
              <h4 className="text-sm font-semibold truncate max-w-[150px]">{currentSong.title}</h4>
              <p className="text-xs text-muted-foreground truncate max-w-[150px] hover:underline cursor-pointer">{currentSong.artist}</p>
            </div>
            <div className="flex items-center gap-1.5 ml-2">
              <button 
                onClick={() => toggleLike(currentSong)}
                className={cn(
                  "p-2 rounded-full transition-colors",
                  liked ? "text-red-500 hover:bg-red-500/10" : "text-muted-foreground hover:bg-accent"
                )}
              >
                <Heart size={18} fill={liked ? "currentColor" : "none"} />
              </button>
              <button 
                onClick={handleShare}
                className="p-2 rounded-full text-muted-foreground hover:bg-accent transition-colors"
              >
                <Share2 size={18} />
              </button>
              <button 
                onClick={() => toggleDownload(currentSong)}
                className={cn(
                  "p-2 rounded-full transition-colors",
                  downloaded ? "text-primary hover:bg-primary/10" : "text-muted-foreground hover:bg-accent"
                )}
              >
                <Download size={18} className={cn(downloaded && "animate-pulse")} />
              </button>
            </div>
          </>

        ) : (
          <div className="flex items-center gap-4 opacity-50">
            <div className="w-14 h-14 rounded-md bg-accent flex items-center justify-center">
               <ListMusic size={20} className="text-muted-foreground" />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="w-24 h-3 rounded-full bg-accent"></div>
              <div className="w-16 h-2 rounded-full bg-border"></div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="w-1/3 flex border-red-500 flex-col items-center justify-center">
        <div className="flex items-center gap-6 mb-2">
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Shuffle size={18} />
          </button>
          <button className="text-foreground hover:text-muted-foreground transition-colors">
            <SkipBack size={20} fill="currentColor" />
          </button>
          
          <button 
            onClick={handlePlayPause}
            className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
          </button>

          <button className="text-foreground hover:text-muted-foreground transition-colors">
            <SkipForward size={20} fill="currentColor" />
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Repeat size={18} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-md flex items-center gap-3 text-xs text-muted-foreground font-medium">
          <span className="w-8 text-right">{formatTime(progress)}</span>
          <div className="flex-1 h-1.5 bg-accent rounded-full overflow-hidden cursor-pointer group hover:h-2 transition-all">
            <div 
              className="h-full bg-foreground rounded-full relative group-hover:bg-primary transition-colors"
              style={{ width: `${(progress / Math.max(duration, 1)) * 100}%` }}
            >
               <div className="opacity-0 group-hover:opacity-100 absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-foreground rounded-full shadow-sm"></div>
            </div>
          </div>
          <span className="w-8">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Extra Controls */}
      <div className="w-1/3 flex items-center justify-end gap-4 text-muted-foreground">
        <button className="hover:text-foreground transition-colors"><Mic2 size={18} /></button>
        <button className="hover:text-foreground transition-colors"><ListMusic size={18} /></button>
        <button className="hover:text-foreground transition-colors"><MonitorSpeaker size={18} /></button>
        
        <div className="flex items-center gap-2 group w-32 ml-2">
          <Volume2 size={18} />
          <div className="flex-1 h-1.5 bg-accent rounded-full overflow-hidden cursor-pointer">
            <div 
              className="h-full bg-foreground rounded-full transition-colors group-hover:bg-primary"
              style={{ width: `${volume * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
