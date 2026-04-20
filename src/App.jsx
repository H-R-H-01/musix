import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Downloads from './pages/Downloads';
import Recordings from './pages/Recordings';
import AdminDashboard from './pages/AdminDashboard';
import { useThemeStore } from './store/useThemeStore';
import { Compass, Library } from 'lucide-react';

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
            <div className="animated-fade-in py-12 flex flex-col items-center justify-center text-center">
              <Compass size={64} className="text-muted-foreground/30 mb-6" />
              <h1 className="text-4xl font-extrabold mb-4">Discover New Music</h1>
              <p className="text-muted-foreground max-w-md">Our curators are currently hand-picking the best tracks for you. Check back soon!</p>
            </div>
          } />
          <Route path="library" element={
            <div className="animated-fade-in py-12 flex flex-col items-center justify-center text-center">
              <Library size={64} className="text-muted-foreground/30 mb-6" />
              <h1 className="text-4xl font-extrabold mb-4">Your Music Library</h1>
              <p className="text-muted-foreground max-w-md">Save songs, albums, and artists to build your own personal collection.</p>
            </div>
          } />
          <Route path="profile" element={<Profile />} />
          <Route path="downloads" element={<Downloads />} />
          <Route path="recordings" element={<Recordings />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="playlist/:id" element={<div className="p-8">Playlist View</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

