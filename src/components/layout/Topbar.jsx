import { Moon, Sun, Search, Bell } from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';

export default function Topbar() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="h-20 flex items-center justify-between px-8 shrink-0">
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <input 
          type="text" 
          placeholder="Search for artists, songs, or podcasts..." 
          className="w-full h-10 bg-accent/50 rounded-full pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-border transition-all border border-transparent hover:border-border"
        />
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-accent text-muted-foreground hover:text-foreground transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-foreground border-2 border-background"></span>
        </button>
        <div className="w-10 h-10 rounded-full border border-border overflow-hidden cursor-pointer">
          <img src="https://ui-avatars.com/api/?name=User&background=random" alt="User avatar" className="w-full h-full object-cover" />
        </div>
      </div>
    </header>
  );
}
