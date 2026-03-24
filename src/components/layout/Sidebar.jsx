import { Home, Compass, Library, PlaySquare, Settings, Heart } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';

export default function Sidebar() {
  const mainLinks = [
    { icon: <Home size={20} />, label: 'Home', path: '/' },
    { icon: <Compass size={20} />, label: 'Discover', path: '/discover' },
    { icon: <Library size={20} />, label: 'Library', path: '/library' }
  ];

  const libraryLinks = [
    { icon: <PlaySquare size={20} />, label: 'Playlists', path: '/playlists' },
    { icon: <Heart size={20} />, label: 'Liked Songs', path: '/liked' }
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
          <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Library</p>
          <nav className="space-y-1">
            {libraryLinks.map((link) => (
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
      </div>
    </aside>
  );
}
