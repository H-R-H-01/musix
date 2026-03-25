import { useAuthStore } from '../store/useAuthStore';
import { useLibraryStore } from '../store/useLibraryStore';
import { Heart, PlaySquare, Settings, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user } = useAuthStore();
  const { playlists } = useLibraryStore();

  return (
    <div className="animated-fade-in max-w-5xl mx-auto h-full flex flex-col">
      <div className="flex items-end gap-8 mb-10 pb-8 border-b border-border">
        <div className="w-48 h-48 rounded-full shadow-2xl overflow-hidden border-4 border-background bg-secondary flex-shrink-0">
          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col gap-2 flex-1 mb-2">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Profile</p>
          <h1 className="text-6xl font-extrabold tracking-tight mb-4">{user.name}</h1>
          <div className="flex text-sm text-muted-foreground font-medium items-center gap-2">
            <span className="text-foreground capitalize">{user.role}</span>
            <span>•</span>
            <span>{playlists.length} Public Playlists</span>
            <span>•</span>
            <span>12 Followers</span>
            <span>•</span>
            <span>24 Following</span>
          </div>
        </div>
        
        <div className="flex gap-3 mb-2">
          <button className="h-10 px-4 rounded-full bg-foreground text-background font-semibold text-sm flex items-center gap-2 hover:scale-105 transition-transform">
            <UserPlus size={16} /> Follow
          </button>
          <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-accent transition-colors">
            <Settings size={18} />
          </button>
        </div>
      </div>

      <section className="mb-10">
        <h2 className="text-2xl font-bold tracking-tight mb-6">Your Public Playlists</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {playlists.map(playlist => (
            <Link key={playlist.id} to={`/playlist/${playlist.id}`} className="w-full p-4 bg-sidebar hover:bg-secondary rounded-xl cursor-pointer group transition-colors block">
              <div className="w-full aspect-square rounded-md overflow-hidden mb-4 shadow-md bg-accent flex items-center justify-center">
                {playlist.isDefault ? (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-800 flex items-center justify-center">
                    <Heart size={48} className="text-white" fill="currentColor" />
                  </div>
                ) : (
                  <img src={playlist.cover_url} alt={playlist.name} className="w-full h-full object-cover" />
                )}
              </div>
              <h4 className="font-semibold truncate mb-1">{playlist.name}</h4>
              <p className="text-xs text-muted-foreground truncate">{playlist.description || 'By ' + user.name}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
