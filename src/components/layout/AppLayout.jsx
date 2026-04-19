import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Player from '../player/Player';
import AudioController from '../player/AudioController';

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      <div className="flex-col flex-1 flex h-full min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto pb-24 px-8 pt-6">
          <Outlet />
        </main>
      </div>
      <Player />
      <AudioController />
    </div>
  );
}
