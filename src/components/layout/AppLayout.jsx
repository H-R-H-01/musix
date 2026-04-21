import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Player from '../player/Player';
import AudioController from '../player/AudioController';
import KaraokeOverlay from '../player/KaraokeOverlay';

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden relative">
      {/* Dynamic Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-primary/3 rounded-full blur-[100px] animate-float" />
        <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[150px] opacity-50" />
      </div>

      <Sidebar />
      <div className="flex-col flex-1 flex h-full min-w-0 relative z-10">
        <Topbar />
        <main className="flex-1 overflow-y-auto pb-40 px-10 pt-8 no-scrollbar scroll-smooth">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      <Player />
      <AudioController />
      <KaraokeOverlay />
    </div>
  );
}
