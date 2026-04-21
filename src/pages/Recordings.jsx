import { useLibraryStore } from '../store/useLibraryStore';
import { usePlayerStore } from '../store/usePlayerStore';
import { Mic, Play, Trash2, Calendar, Music } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Recordings() {
  const { karaokeRecordings } = useLibraryStore();
  const { isPlaying, currentSong, setPlayState } = usePlayerStore();

  const handlePlayRecording = (recording) => {
    const audio = new Audio(recording.recordingUrl);
    audio.play();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="animated-fade-in space-y-10 pb-20">
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 rounded-[2.5rem] bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary border border-primary/10 shadow-xl shadow-primary/5">
          <Mic size={32} />
        </div>
        <div>
           <h1 className="text-5xl font-black tracking-tighter italic text-gradient">Your Recordings</h1>
           <p className="text-sm font-bold text-muted-foreground/60 uppercase tracking-[0.3em] mt-1">Karaoke Sessions • {karaokeRecordings.length} Recordings</p>
        </div>
      </div>

      <div className="glass dark:glass-dark rounded-[3rem] p-6 border border-border/30 shadow-premium">
        {karaokeRecordings.length > 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-[48px_1fr_1fr_100px] gap-6 px-8 py-4 text-[11px] font-bold uppercase text-muted-foreground/60 tracking-[0.2em] border-b border-border/10">
              <span className="text-center">#</span>
              <span>Recording Details</span>
              <span className="hidden md:block text-right">Recorded At</span>
              <span className="text-center">Action</span>
            </div>
            
            <div className="space-y-2">
              {karaokeRecordings.map((rec, index) => (
                <div 
                  key={rec.id}
                  className="grid grid-cols-[48px_1fr_1fr_100px] gap-6 px-6 py-4 rounded-2xl items-center group transition-all duration-300 cursor-pointer border border-transparent hover:bg-secondary/40 hover:border-border/20"
                >
                  <div className="flex justify-center text-sm font-bold text-muted-foreground group-hover:text-primary transition-colors tabular-nums">
                     {(index + 1).toString().padStart(2, '0')}
                  </div>
                  
                  <div className="flex items-center gap-5 min-w-0">
                    <div className="relative shrink-0">
                      <img src={rec.coverUrl} alt={rec.songTitle} className="w-14 h-14 rounded-2xl object-cover shadow-lg group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handlePlayRecording(rec)}>
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black">
                           <Play size={14} fill="currentColor" className="ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <div className="min-w-0">
                       <h4 className="font-bold text-[15px] truncate tracking-tight group-hover:text-primary transition-colors flex items-center gap-2">
                          {rec.songTitle}
                          <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded uppercase font-black tracking-widest">Karaoke</span>
                       </h4>
                       <p className="text-[10px] font-black text-muted-foreground truncate uppercase tracking-widest leading-none mt-1">Artist: {rec.artist} • {formatTime(rec.duration)}</p>
                    </div>
                  </div>

                  <div className="hidden md:flex flex-col items-end gap-1">
                     <div className="flex items-center gap-2">
                        <Calendar size={12} className="text-primary/50" />
                        <span className="text-xs font-bold text-foreground/80">{new Date(rec.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                     </div>
                     <span className="text-[9px] font-black tracking-widest uppercase text-muted-foreground/60">Session Logged</span>
                  </div>

                  <div className="flex justify-center">
                     <button 
                       className="w-10 h-10 rounded-xl bg-secondary/50 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center shadow-sm group/btn active:scale-90"
                       title="Discard Recording"
                     >
                        <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
                     </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-40 flex flex-col items-center justify-center text-center px-10">
             <div className="w-28 h-28 rounded-[2.5rem] bg-secondary/50 flex items-center justify-center text-muted-foreground/30 mb-8 border border-border/10 animate-float shadow-xl rotate-12">
                <Mic size={56} />
             </div>
             <h3 className="text-3xl font-black mb-4 italic tracking-tight">Voice Silent</h3>
             <p className="text-muted-foreground font-medium max-w-sm text-sm leading-relaxed mb-8">You haven't recorded any sessions yet. Unleash your inner artist and start your first recording.</p>
             <button className="px-8 py-4 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-110 active:scale-95 transition-all">Start Session</button>
          </div>
        )}
      </div>
    </div>
  );
}
