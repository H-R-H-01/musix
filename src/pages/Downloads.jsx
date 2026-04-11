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
    <div className="animated-fade-in max-w-6xl mx-auto h-full flex flex-col gap-10 pb-20">
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary border border-primary/10 shadow-xl">
          <Download size={32} />
        </div>
        <div>
           <h1 className="text-5xl font-black tracking-tighter italic">Offline Hub</h1>
           <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.3em] mt-1">Available without connection • {downloadedSongs.length} Tracks</p>
        </div>
      </div>

      <div className="bg-sidebar rounded-[3rem] p-4 border border-border shadow-xl">
        {downloadedSongs.length > 0 ? (
          <div className="space-y-2">
            <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-4 px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest border-b border-border/50">
              <span className="w-12 text-center text-[10px]">#</span>
              <span>Track Details</span>
              <span className="hidden md:block">Downloaded At</span>
              <span className="w-20 text-center">Action</span>
            </div>
            
            <div className="space-y-1">
              {downloadedSongs.map((song, index) => (
                <div 
                  key={song.id}
                  className={cn(
                    "grid grid-cols-[auto_1fr_1fr_auto] gap-4 px-4 py-3 rounded-2xl items-center group hover:bg-accent/50 transition-all cursor-pointer relative overflow-hidden",
                    currentSong?.id === song.id && "bg-primary/5 border border-primary/20"
                  )}
                  onClick={() => handlePlay(song)}
                >
                  <div className="w-12 flex justify-center text-sm font-black text-muted-foreground group-hover:text-primary transition-colors">
                     {currentSong?.id === song.id && isPlaying ? (
                       <div className="flex items-end gap-0.5 h-3">
                          <div className="w-1 bg-primary animate-[music-bar_0.8s_ease-in-out_infinite] h-full"></div>
                          <div className="w-1 bg-primary animate-[music-bar_1.2s_ease-in-out_infinite] h-full"></div>
                          <div className="w-1 bg-primary animate-[music-bar_1s_ease-in-out_infinite] h-full"></div>
                       </div>
                     ) : index + 1}
                  </div>
                  
                  <div className="flex items-center gap-4 min-w-0">
                    <img src={song.cover_url} alt={song.title} className="w-12 h-12 rounded-xl object-cover shadow-lg group-hover:scale-110 transition-transform duration-500" />
                    <div className="min-w-0">
                       <h4 className={cn("font-black text-sm truncate tracking-tight transition-colors", currentSong?.id === song.id ? "text-primary" : "group-hover:text-foreground")}>{song.title}</h4>
                       <p className="text-[10px] font-bold text-muted-foreground truncate uppercase tracking-widest">{song.artist}</p>
                    </div>
                  </div>

                  <div className="hidden md:flex flex-col">
                     <span className="text-xs font-bold text-muted-foreground">{new Date(song.downloadedAt).toLocaleDateString()}</span>
                     <span className="text-[10px] opacity-40 font-black uppercase tracking-widest leading-none">Safe in Hub</span>
                  </div>

                  <div className="w-20 flex justify-center gap-2">
                     <button 
                       onClick={(e) => { e.stopPropagation(); toggleDownload(song); }}
                       className="w-10 h-10 rounded-xl bg-accent hover:bg-red-500 hover:text-white transition-all flex items-center justify-center shadow-sm"
                     >
                        <Trash2 size={16} />
                     </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-32 flex flex-col items-center justify-center text-center px-10">
             <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center text-muted-foreground/20 mb-8 border border-border/50">
                <Music size={48} />
             </div>
             <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter italic">No Offline Registry</h3>
             <p className="text-muted-foreground font-bold max-w-sm text-sm uppercase tracking-widest leading-loose">Download tracks from your collections to listen without an active connection.</p>
          </div>
        )}
      </div>
    </div>
  );
}
