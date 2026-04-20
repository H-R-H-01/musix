import { useLibraryStore } from '../store/useLibraryStore';
import { usePlayerStore } from '../store/usePlayerStore';
import { Mic, Play, Trash2, Calendar, Music } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Recordings() {
  const { karaokeRecordings } = useLibraryStore();
  const { isPlaying, currentSong, setPlayState } = usePlayerStore();

  const handlePlayRecording = (recording) => {
    // In a real app, we might want a separate recording player
    // For now, we can just open it in a new tab or use a native audio element
    const audio = new Audio(recording.recordingUrl);
    audio.play();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="animated-fade-in max-w-6xl mx-auto h-full flex flex-col gap-10 pb-20">
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary border border-primary/10 shadow-xl">
          <Mic size={32} />
        </div>
        <div>
           <h1 className="text-5xl font-black tracking-tighter italic">Your Recordings</h1>
           <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.3em] mt-1">Karaoke Sessions • {karaokeRecordings.length} Recordings</p>
        </div>
      </div>

      <div className="bg-sidebar rounded-[3rem] p-4 border border-border shadow-xl">
        {karaokeRecordings.length > 0 ? (
          <div className="space-y-2">
            <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-4 px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest border-b border-border/50">
              <span className="w-12 text-center">#</span>
              <span>Recording Details</span>
              <span className="hidden md:block">Recorded On</span>
              <span className="w-20 text-center">Action</span>
            </div>
            
            <div className="space-y-1">
              {karaokeRecordings.map((rec, index) => (
                <div 
                  key={rec.id}
                  className="grid grid-cols-[auto_1fr_1fr_auto] gap-4 px-4 py-3 rounded-2xl items-center group hover:bg-accent/50 transition-all cursor-pointer relative overflow-hidden"
                >
                  <div className="w-12 flex justify-center text-sm font-black text-muted-foreground group-hover:text-primary transition-colors">
                     {index + 1}
                  </div>
                  
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="relative">
                      <img src={rec.coverUrl} alt={rec.songTitle} className="w-12 h-12 rounded-xl object-cover shadow-lg" />
                      <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handlePlayRecording(rec)}>
                        <Play size={16} fill="white" className="text-white" />
                      </div>
                    </div>
                    <div className="min-w-0">
                       <h4 className="font-black text-sm truncate tracking-tight group-hover:text-primary transition-colors">{rec.songTitle} (Karaoke)</h4>
                       <p className="text-[10px] font-bold text-muted-foreground truncate uppercase tracking-widest">Original by {rec.artist} • {formatTime(rec.duration)}</p>
                    </div>
                  </div>

                  <div className="hidden md:flex items-center gap-2 text-muted-foreground">
                     <Calendar size={14} />
                     <span className="text-xs font-bold">{new Date(rec.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="w-20 flex justify-center">
                     <button 
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
             <div className="w-24 h-24 rounded-[2rem] bg-accent flex items-center justify-center text-muted-foreground/20 mb-8 border border-border/50 rotate-12">
                <Mic size={48} />
             </div>
             <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter italic">Voice Silent</h3>
             <p className="text-muted-foreground font-bold max-w-sm text-sm uppercase tracking-widest leading-loose">You haven't recorded any karaoke sessions yet. Pick a song and start singing!</p>
          </div>
        )}
      </div>
    </div>
  );
}
