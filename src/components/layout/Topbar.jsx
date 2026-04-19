import { Moon, Sun, Search, Bell, User as UserIcon } from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Link } from 'react-router-dom';

export default function Topbar() {
  const { theme, toggleTheme } = useThemeStore();
  const { user, toggleRole } = useAuthStore();

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
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
           <span className="text-[10px] font-black uppercase text-primary tracking-widest leading-none">
             {Math.floor(user.listeningTime / 60)} Minutes Listened
           </span>
        </div>

        <button 
          onClick={toggleRole}
          className="text-xs font-semibold px-3 py-1.5 rounded-full bg-accent text-muted-foreground hover:text-foreground hover:bg-border transition-colors border border-border flex items-center gap-2"
        >
          <UserIcon size={14} /> View as {user.role === 'admin' ? 'User' : 'Admin'}
        </button>

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
        <Link to="/profile" className="w-10 h-10 rounded-full border border-border overflow-hidden cursor-pointer hover:border-foreground transition-colors">
          <img src={user.avatar} alt="User avatar" className="w-full h-full object-cover" />
        </Link>
      </div>
    </header>
  );
}
