import { Moon, Sun, Search, Bell, User as UserIcon } from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Link } from 'react-router-dom';

export default function Topbar() {
  const { theme, toggleTheme } = useThemeStore();
  const { user, toggleRole } = useAuthStore();

  return (
    <header className="h-20 flex items-center justify-between px-8 shrink-0 glass dark:glass-dark border-b border-border/30 sticky top-0 z-30">
      <div className="relative w-96 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Search for artists, songs, or podcasts..." 
          className="w-full h-11 bg-secondary/50 rounded-2xl pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-background transition-all border border-transparent hover:border-border/50"
        />
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-primary/5 rounded-2xl border border-primary/10">
           <div className="relative flex h-2 w-2">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
             <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
           </div>
           <span className="text-[11px] font-bold uppercase text-primary tracking-widest leading-none">
             {Math.floor(user.listeningTime / 60)}m Listened
           </span>
        </div>

        <button 
          onClick={toggleRole}
          className="text-xs font-bold px-4 py-2 rounded-xl bg-secondary/80 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all border border-border/30 flex items-center gap-2 active:scale-95"
        >
          <UserIcon size={14} className="text-primary" /> 
          Switch to {user.role === 'admin' ? 'User' : 'Admin'}
        </button>

        <div className="flex items-center gap-2">
          <button 
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-primary transition-all active:scale-90"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-primary transition-all relative active:scale-90">
            <Bell size={18} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-primary border-2 border-background"></span>
          </button>
        </div>

        <Link to="/profile" className="flex items-center gap-3 pl-2 border-l border-border/30 group">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold leading-none mb-1 group-hover:text-primary transition-colors">{user.name}</p>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Pro Member</p>
          </div>
          <div className="w-10 h-10 rounded-xl border-2 border-transparent group-hover:border-primary/50 overflow-hidden cursor-pointer transition-all shadow-md group-hover:shadow-primary/10">
            <img src={user.avatar} alt="User avatar" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          </div>
        </Link>
      </div>
    </header>
  );
}
