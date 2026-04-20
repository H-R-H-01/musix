import { Home, Compass, Library, PlaySquare, Settings, Heart, Plus, Mic, ShieldAlert, Download } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../store/useAuthStore';
import { useLibraryStore } from '../../store/useLibraryStore';

export default function Sidebar() {
  const { user } = useAuthStore();
  const { playlists, createPlaylist } = useLibraryStore();

  const mainLinks = [
    { icon: <Home size={20} />, label: 'Home', path: '/' },
    { icon: <Compass size={20} />, label: 'Discover', path: '/discover' },
    { icon: <Library size={20} />, label: 'Library', path: '/library' },
    { icon: <Mic size={20} />, label: 'Recordings', path: '/recordings' },
    { icon: <Download size={20} />, label: 'Downloads', path: '/downloads' }
  ];

  return (
    <aside className="w-64 bg-sidebar border-r border-border h-full flex flex-col pt-8 pb-24">
      <div className="px-6 mb-8 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center">
          <PlaySquare className="text-background" size={16} fill="currentColor" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Musix</h1>
      </div>

      <div className="flex-1 px-4 space-y-6">
        <div>
          <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Menu</p>
          <nav className="space-y-1">
            {mainLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors",
                    isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  )
                }
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div>
          <div className="flex items-center justify-between px-4 mb-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Playlists</p>
            <button 
              onClick={() => createPlaylist('New Playlist')}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
          <nav className="space-y-1">
            {playlists.map((playlist) => (
              <NavLink
                key={playlist.id}
                to={`/playlist/${playlist.id}`}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors",
                    isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  )
                }
              >
                {playlist.isDefault ? <Heart size={20} /> : <PlaySquare size={20} />}
                {playlist.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {user.role === 'admin' && (
          <div>
            <p className="px-4 text-xs font-semibold text-primary uppercase tracking-wider mb-3 flex items-center gap-1.5"><ShieldAlert size={14}/> Admin Panel</p>
            <nav className="space-y-1">
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors text-primary",
                    isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  )
                }
              >
                <Mic size={20} />
                Dashboard & Upload
              </NavLink>
            </nav>
          </div>
        )}
      </div>
    </aside>
  );
}
