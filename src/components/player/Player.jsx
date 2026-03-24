import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle, Mic2, ListMusic, MonitorSpeaker } from 'lucide-react';
import { usePlayerStore } from '../../store/usePlayerStore';

export default function Player() {
  const { currentSong, isPlaying, setPlayState, volume, progress, duration } = usePlayerStore();

  const handlePlayPause = () => {
    if (currentSong) {
      setPlayState(!isPlaying);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
            <div className="flex flex-col">
              <h4 className="text-sm font-semibold truncate max-w-[200px]">{currentSong.title}</h4>
              <p className="text-xs text-muted-foreground truncate max-w-[200px] hover:underline cursor-pointer">{currentSong.artist}</p>
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
