import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Downloads from './pages/Downloads';
import Recordings from './pages/Recordings';
import AdminDashboard from './pages/AdminDashboard';
import { useThemeStore } from './store/useThemeStore';
import { Compass, Library, Music } from 'lucide-react';

function App() {
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    // Sync theme state with document class on mount
    setTheme(theme);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="discover" element={
            <div className="animated-fade-in py-24 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 rounded-[2.5rem] bg-primary/10 flex items-center justify-center text-primary mb-10 shadow-xl animate-float">
                <Compass size={48} />
              </div>
              <h1 className="text-5xl font-black italic tracking-tight text-gradient mb-4">Discover Signal</h1>
              <p className="text-muted-foreground font-medium max-w-sm leading-relaxed">Our sonic curators are currently hand-picking the best frequencies for your grid. Stay tuned.</p>
            </div>
          } />
          <Route path="library" element={
            <div className="animated-fade-in py-24 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 rounded-[2.5rem] bg-primary/10 flex items-center justify-center text-primary mb-10 shadow-xl animate-float">
                <Library size={48} />
              </div>
              <h1 className="text-5xl font-black italic tracking-tight text-gradient mb-4">Registry Hub</h1>
              <p className="text-muted-foreground font-medium max-w-sm leading-relaxed">Save your favorite signals to build a personalized sonic architecture.</p>
            </div>
          } />
          <Route path="profile" element={<Profile />} />
          <Route path="downloads" element={<Downloads />} />
          <Route path="recordings" element={<Recordings />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="playlist/:id" element={
            <div className="animated-fade-in py-24 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 rounded-[2.5rem] bg-secondary/50 flex items-center justify-center text-muted-foreground/30 mb-8 border border-border/10 animate-float shadow-xl">
                 <Music size={48} />
              </div>
              <h1 className="text-4xl font-black italic tracking-tight mb-2">Playlist Node</h1>
              <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Accessing encoded collection data...</p>
            </div>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

