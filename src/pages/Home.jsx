import { useEffect } from 'react';
import { Play, Heart, Share2 } from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';
import { useLibraryStore } from '../store/useLibraryStore';
import { cn } from '../lib/utils';

const MOCK_SONGS = [
  { id: '1', title: 'Neon Nights', artist: 'Synthwave Boy', cover_url: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=300&h=300', duration: 215 },
  { id: '2', title: 'Midnight City', artist: 'The Midnight', cover_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=300&h=300', duration: 184 },
  { id: '3', title: 'Ocean Breeze', artist: 'Chillout Lounge', cover_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=300&h=300', duration: 245 },
  { id: '4', title: 'Lofi Study', artist: 'Beats to Relax', cover_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&q=80&w=300&h=300', duration: 156 },
  { id: '5', title: 'Cyberpunk Drive', artist: 'NightCity', cover_url: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&q=80&w=300&h=300', duration: 228 }
];

export default function Home() {
  const { setCurrentSong, currentSong, isPlaying } = usePlayerStore();
  const { homeSections, toggleLike, isLiked } = useLibraryStore();

  const handlePlay = (song) => {
    setCurrentSong(song);
    usePlayerStore.getState().setDuration(song.duration);
    usePlayerStore.getState().setQueue(MOCK_SONGS);
  };

  const handleShare = (song) => {
    navigator.clipboard.writeText(`https://musix.app/song/${song.id}`);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="animated-fade-in">
      {homeSections.map((section, idx) => (
        <section key={section.id} className="mb-12">
          {section.type === 'grid' ? (
            <>
              <h2 className="text-3xl font-extrabold tracking-tight mb-6">{section.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {MOCK_SONGS.slice(0, 6).map((song) => {
                  const liked = useLibraryStore(isLiked(song.id));
                  return (
                    <div 
                      key={song.id}
                      className="flex items-center gap-4 bg-secondary/50 hover:bg-secondary rounded-lg overflow-hidden cursor-pointer group transition-colors pr-4 relative"
                      onClick={() => handlePlay(song)}
                    >
                      <img src={song.cover_url} alt={song.title} className="w-20 h-20 object-cover shadow-sm" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{song.title}</h3>
                        <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                      </div>
                      
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                          onClick={(e) => { e.stopPropagation(); toggleLike(song); }}
                          className={cn("p-2 rounded-full hover:bg-background transition-colors", liked ? "text-red-500" : "text-muted-foreground")}
                        >
                          <Heart size={16} fill={liked ? "currentColor" : "none"} />
                        </button>
                        <button 
                          className={`w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center shadow-md transition-all ${currentSong?.id === song.id && isPlaying ? 'opacity-100 scale-100' : 'scale-90 opacity-100'}`}
                        >
                          <Play size={16} fill="currentColor" className="ml-1" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-end justify-between mb-6">
                <h2 className="text-2xl font-bold tracking-tight hover:underline cursor-pointer">{section.title}</h2>
                <span className="text-sm font-semibold text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Show all</span>
              </div>
              
              <div className="flex flex-wrap gap-6">
                {MOCK_SONGS.map((song) => {
                  const liked = useLibraryStore(isLiked(song.id));
                  return (
                    <div 
                      key={song.id}
                      className="w-48 p-4 bg-sidebar hover:bg-secondary rounded-xl cursor-pointer group transition-colors flex flex-col relative"
                      onClick={() => handlePlay(song)}
                    >
                      <div className="relative w-full aspect-square rounded-md overflow-hidden mb-4 shadow-md bg-accent">
                        <img src={song.cover_url} alt={song.title} className="w-full h-full object-cover" />
                        
                        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={(e) => { e.stopPropagation(); toggleLike(song); }}
                              className={cn("w-8 h-8 rounded-full bg-background/80 backdrop-blur-md flex items-center justify-center transition-all", liked ? "text-red-500" : "text-muted-foreground")}
                            >
                              <Heart size={14} fill={liked ? "currentColor" : "none"} />
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleShare(song); }}
                              className="w-8 h-8 rounded-full bg-background/80 backdrop-blur-md flex items-center justify-center text-muted-foreground transition-all"
                            >
                              <Share2 size={14} />
                            </button>
                        </div>

                        <button 
                          className={`absolute right-3 bottom-3 w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center shadow-lg transition-all translate-y-2 group-hover:translate-y-0 ${currentSong?.id === song.id && isPlaying ? 'opacity-100 translate-y-0' : 'opacity-0 group-hover:opacity-100'}`}
                          onClick={(e) => { e.stopPropagation(); handlePlay(song); }}
                        >
                          <Play size={20} fill="currentColor" className="ml-1" />
                        </button>
                      </div>
                      <h4 className="font-semibold truncate mb-1">{song.title}</h4>
                      <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </section>
      ))}
    </div>
  );
}

