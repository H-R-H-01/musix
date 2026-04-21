import { useEffect } from 'react';
import { Play, Heart, Share2, Download } from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';
import { useLibraryStore } from '../store/useLibraryStore';
import { useAuthStore } from '../store/useAuthStore';
import { cn } from '../lib/utils';

const MOCK_SONGS = [
  { id: '1', title: 'Neon Nights', artist: 'Synthwave Boy', cover_url: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=300&h=300', duration: 215, song_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: '2', title: 'Midnight City', artist: 'The Midnight', cover_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=300&h=300', duration: 184, song_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: '3', title: 'Ocean Breeze', artist: 'Chillout Lounge', cover_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=300&h=300', duration: 245, song_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { id: '4', title: 'Lofi Study', artist: 'Beats to Relax', cover_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&q=80&w=300&h=300', duration: 156, song_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
  { id: '5', title: 'Cyberpunk Drive', artist: 'NightCity', cover_url: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&q=80&w=300&h=300', duration: 228, song_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' }
];

export default function Home() {
  const { setCurrentSong, currentSong, isPlaying } = usePlayerStore();
  const { homeSections, toggleLike, isLiked, addToRecentlyPlayed, recentlyPlayed, toggleDownload, isDownloaded } = useLibraryStore();
  const { user } = useAuthStore();

  const handlePlay = (song) => {
    setCurrentSong(song);
    addToRecentlyPlayed(song);
    usePlayerStore.getState().setDuration(song.duration);
    usePlayerStore.getState().setQueue(MOCK_SONGS);
  };

  const handleShare = (song) => {
    navigator.clipboard.writeText(`https://musix.app/song/${song.id}`);
    alert('Link copied to clipboard!');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="animated-fade-in space-y-12 pb-12">
      <div className="relative pt-4 pb-2">
        <h1 className="text-5xl font-black tracking-tight mb-3 text-gradient">{getGreeting()}, {user?.name.split(' ')[0]}</h1>
        <p className="text-muted-foreground text-lg font-medium">Have a listen to your personalized daily mix.</p>
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse-subtle" />
      </div>

      {homeSections.map((section, idx) => {
        const sectionSongs = section.id === 'recently-played' ? recentlyPlayed : MOCK_SONGS;
        
        if (section.id === 'recently-played' && recentlyPlayed.length === 0) return null;

        return (
          <section key={section.id} className="relative">
            {section.type === 'grid' ? (
              <div className="space-y-6">
                <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
                  {section.title}
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {sectionSongs.slice(0, 6).map((song) => {
                    const liked = useLibraryStore(isLiked(song.id));
                    const isCurrent = currentSong?.id === song.id;
                    
                    return (
                      <div 
                        key={`${section.id}-${song.id}`}
                        className={cn(
                          "flex items-center gap-5 p-3 rounded-2xl cursor-pointer group transition-all duration-500 border border-border/10",
                          isCurrent ? "bg-primary/5 border-primary/20" : "bg-secondary/40 hover:bg-secondary/80 hover:scale-[1.02] song-card-shadow"
                        )}
                        onClick={() => handlePlay(song)}
                      >
                        <div className="relative shrink-0">
                          <img src={song.cover_url} alt={song.title} className="w-16 h-16 rounded-xl object-cover shadow-md group-hover:rotate-3 transition-transform duration-500" />
                          {isCurrent && isPlaying && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl">
                              <div className="flex gap-1 items-end h-4">
                                <div className="w-1 bg-white animate-music-bar [animation-delay:-0.3s]" />
                                <div className="w-1 bg-white animate-music-bar [animation-delay:-0.1s]" />
                                <div className="w-1 bg-white animate-music-bar [animation-delay:-0.2s]" />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className={cn("font-bold truncate text-sm", isCurrent ? "text-primary" : "text-foreground")}>{song.title}</h3>
                          <p className="text-xs font-semibold text-muted-foreground truncate group-hover:text-foreground/70 transition-colors">{song.artist}</p>
                        </div>
                        
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                           <button 
                            onClick={(e) => { e.stopPropagation(); toggleLike(song); }}
                            className={cn("w-9 h-9 rounded-full flex items-center justify-center hover:bg-background transition-all", liked ? "text-red-500" : "text-muted-foreground")}
                          >
                            <Heart size={16} fill={liked ? "currentColor" : "none"} />
                          </button>
                          <div 
                            className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all",
                              isCurrent && isPlaying ? "bg-primary text-white scale-110" : "bg-primary text-white"
                            )}
                          >
                            {isCurrent && isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-1" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-end justify-between">
                  <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
                    {section.title}
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  </h2>
                  <button className="text-xs font-bold text-primary uppercase tracking-widest hover:underline transition-all">View All</button>
                </div>
                
                <div className="flex overflow-x-auto pb-4 gap-6 no-scrollbar -mx-2 px-2">
                  {sectionSongs.map((song) => {
                    const liked = useLibraryStore(isLiked(song.id));
                    const downloaded = useLibraryStore(isDownloaded(song.id));
                    const isCurrent = currentSong?.id === song.id;

                    return (
                      <div 
                        key={`${section.id}-${song.id}`}
                        className="w-52 shrink-0 group cursor-pointer"
                        onClick={() => handlePlay(song)}
                      >
                        <div className="relative w-full aspect-square rounded-3xl overflow-hidden mb-4 song-card-shadow border border-border/10 bg-secondary group-hover:scale-[1.03] transition-all duration-500">
                          <img src={song.cover_url} alt={song.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          
                          {/* Overlay Gradient */}
                          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          
                          {/* Actions */}
                          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-[-10px] group-hover:translate-y-0 duration-500">
                              <button 
                                onClick={(e) => { e.stopPropagation(); toggleLike(song); }}
                                className={cn("w-9 h-9 rounded-2xl glass flex items-center justify-center transition-all hover:scale-110", liked ? "text-red-500" : "text-white/80 hover:text-white")}
                              >
                                <Heart size={16} fill={liked ? "currentColor" : "none"} />
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleShare(song); }}
                                className="w-9 h-9 rounded-2xl glass flex items-center justify-center text-white/80 hover:text-white transition-all hover:scale-110"
                              >
                                <Share2 size={16} />
                              </button>
                          </div>
  
                          <div 
                            className={cn(
                              "absolute border-red-500 right-4 bottom-4 w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-xl transition-all duration-500 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100",
                              isCurrent && isPlaying ? "opacity-100 translate-y-0 ring-4 ring-primary/20" : ""
                            )}
                          >
                            {isCurrent && isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                          </div>
                        </div>
                        <div className="px-1">
                          <h4 className={cn("font-bold truncate text-[15px] mb-0.5 transition-colors", isCurrent ? "text-primary" : "group-hover:text-primary")}>{song.title}</h4>
                          <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground/70 transition-colors uppercase tracking-tight">{song.artist}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

