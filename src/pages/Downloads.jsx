import { useLibraryStore } from '../store/useLibraryStore';
import { usePlayerStore } from '../store/usePlayerStore';
import { Download, Play, Music, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Downloads() {
  const { downloadedSongs, toggleDownload } = useLibraryStore();
  const { setCurrentSong, currentSong, isPlaying } = usePlayerStore();

  const handlePlay = (song) => {
    setCurrentSong(song);
    usePlayerStore.getState().setDuration(song.duration);
    usePlayerStore.getState().setQueue(downloadedSongs);
  };

  return (
    <div className="animated-fade-in space-y-10 pb-20">
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 rounded-[2.5rem] bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary border border-primary/10 shadow-xl shadow-primary/5">
          <Download size={32} />
        </div>
        <div>
           <h1 className="text-5xl font-black tracking-tighter italic text-gradient">Offline Hub</h1>
           <p className="text-sm font-bold text-muted-foreground/60 uppercase tracking-[0.3em] mt-1">Available without connection • {downloadedSongs.length} Tracks</p>
        </div>
      </div>

      <div className="glass dark:glass-dark rounded-[3rem] p-6 border border-border/30 shadow-premium">
        {downloadedSongs.length > 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-[48px_1fr_1fr_100px] gap-6 px-8 py-4 text-[11px] font-bold uppercase text-muted-foreground/60 tracking-[0.2em] border-b border-border/10">
              <span className="text-center">#</span>
              <span>Track Details</span>
              <span className="hidden md:block">Downloaded At</span>
              <span className="text-center">Actions</span>
            </div>
            
            <div className="space-y-2">
              {downloadedSongs.map((song, index) => {
                const isCurrent = currentSong?.id === song.id;
                return (
                  <div 
                    key={song.id}
                    className={cn(
                      "grid grid-cols-[48px_1fr_1fr_100px] gap-6 px-6 py-4 rounded-2xl items-center group transition-all duration-300 cursor-pointer border border-transparent",
                      isCurrent ? "bg-primary/5 border-primary/20 shadow-sm shadow-primary/5" : "hover:bg-secondary/40 hover:border-border/20"
                    )}
                    onClick={() => handlePlay(song)}
                  >
                    <div className="flex justify-center text-sm font-bold text-muted-foreground group-hover:text-primary transition-colors">
                       {isCurrent && isPlaying ? (
                         <div className="flex items-end gap-1 h-3.5">
                            <div className="w-1 bg-primary animate-music-bar [animation-delay:-0.3s]"></div>
                            <div className="w-1 bg-primary animate-music-bar [animation-delay:-0.1s]"></div>
                            <div className="w-1 bg-primary animate-music-bar [animation-delay:-0.2s]"></div>
                         </div>
                       ) : <span className="tabular-nums">{(index + 1).toString().padStart(2, '0')}</span>}
                    </div>
                    
                    <div className="flex items-center gap-5 min-w-0">
                      <div className="relative shrink-0">
                        <img src={song.cover_url} alt={song.title} className="w-14 h-14 rounded-2xl object-cover shadow-lg group-hover:scale-105 transition-transform duration-500" />
                        {isCurrent && isPlaying && (
                          <div className="absolute inset-0 bg-primary/20 rounded-2xl animate-pulse" />
                        )}
                      </div>
                      <div className="min-w-0">
                         <h4 className={cn("font-bold text-[15px] truncate tracking-tight transition-colors mb-0.5", isCurrent ? "text-primary" : "group-hover:text-primary")}>{song.title}</h4>
                         <p className="text-[10px] font-black text-muted-foreground truncate uppercase tracking-widest leading-none">{song.artist}</p>
                      </div>
                    </div>
  
                    <div className="hidden md:flex flex-col gap-1">
                       <span className="text-xs font-bold text-foreground/80">{new Date(song.downloadedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                       <div className="flex items-center gap-2">
                          <Check size={10} className="text-primary" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-primary/70">Verified Integrity</span>
                       </div>
                    </div>
  
                    <div className="flex justify-center gap-2">
                       <button 
                         onClick={(e) => { e.stopPropagation(); toggleDownload(song); }}
                         className="w-10 h-10 rounded-xl bg-secondary/50 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center shadow-sm group/btn active:scale-90"
                         title="Remove from Hub"
                       >
                          <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
                       </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="py-40 flex flex-col items-center justify-center text-center px-10">
             <div className="w-28 h-28 rounded-[2.5rem] bg-secondary/50 flex items-center justify-center text-muted-foreground/30 mb-8 border border-border/10 animate-float shadow-xl">
                <Music size={56} />
             </div>
             <h3 className="text-3xl font-black mb-4 italic tracking-tight">Registry Empty</h3>
             <p className="text-muted-foreground font-medium max-w-sm text-sm leading-relaxed mb-8">Deploy your favorite sets to the offline hub for uninterrupted sonic experiences.</p>
             <button className="px-8 py-4 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-110 active:scale-95 transition-all">Explore Collections</button>
          </div>
        )}
      </div>
    </div>
  );
}
