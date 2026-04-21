import { Home, Compass, Library, PlaySquare, Settings, Heart, Plus, Mic, ShieldAlert, Download } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../store/useAuthStore';
import { useLibraryStore } from '../../store/useLibraryStore';

export default function Sidebar() {
  const { user } = useAuthStore();
  const { playlists, createPlaylist } = useLibraryStore();

  const mainLinks = [
    { icon: <Home size={18} />, label: 'Home', path: '/' },
    { icon: <Compass size={18} />, label: 'Discover', path: '/discover' },
    { icon: <Library size={18} />, label: 'Library', path: '/library' },
    { icon: <Mic size={18} />, label: 'Recordings', path: '/recordings' },
    { icon: <Download size={18} />, label: 'Downloads', path: '/downloads' }
  ];

  return (
    <aside className="w-64 glass dark:glass-dark border-r border-border/30 h-full flex flex-col pt-10 pb-24 z-20">
      <div className="px-8 mb-10 flex items-center gap-3 group cursor-pointer">
        <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-500">
          <PlaySquare className="text-white" size={20} fill="currentColor" />
        </div>
        <h1 className="text-2xl font-black tracking-tight text-gradient">Musix</h1>
      </div>

      <div className="flex-1 px-4 space-y-8 overflow-y-auto">
        <div>
          <p className="px-4 text-[11px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] mb-4">Discovery</p>
          <nav className="space-y-1.5">
            {mainLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 relative group",
                    isActive 
                      ? "bg-primary/10 text-primary shadow-sm" 
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )
                }
              >
                <span className="relative z-10 group-hover:scale-110 transition-transform duration-300">{link.icon}</span>
                <span className="relative z-10">{link.label}</span>
                {/* Active indicator dot */}
                <NavLink
                  to={link.path}
                >
                  {({ isActive }) => isActive && (
                    <span className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />
                  )}
                </NavLink>
              </NavLink>
            ))}
          </nav>
        </div>

        <div>
          <div className="flex items-center justify-between px-4 mb-4">
            <p className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em]">Playlists</p>
            <button 
              onClick={() => createPlaylist('New Playlist')}
              className="w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
            >
              <Plus size={16} />
            </button>
          </div>
          <nav className="space-y-1.5">
            {playlists.map((playlist) => (
              <NavLink
                key={playlist.id}
                to={`/playlist/${playlist.id}`}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group",
                    isActive 
                      ? "bg-primary/10 text-primary shadow-sm" 
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )
                }
              >
                <span className="group-hover:scale-110 transition-transform duration-300">
                  {playlist.isDefault ? <Heart size={18} fill={playlist.isDefault ? "currentColor" : "none"} className={playlist.isDefault ? "text-red-500" : ""} /> : <PlaySquare size={18} />}
                </span>
                <span className="truncate">{playlist.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {user.role === 'admin' && (
          <div className="pt-4 border-t border-border/10">
            <p className="px-4 text-[11px] font-bold text-primary/80 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <ShieldAlert size={14}/> Admin Control
            </p>
            <nav className="space-y-1.5">
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300",
                    isActive 
                      ? "bg-primary text-white shadow-lg shadow-primary/20" 
                      : "text-primary/70 hover:text-primary hover:bg-primary/10"
                  )
                }
              >
                <div className="w-5 h-5 flex items-center justify-center rounded-lg bg-current/10">
                  <Mic size={16} />
                </div>
                Dashboard
              </NavLink>
            </nav>
          </div>
        )}
      </div>
    </aside>
  );
}
