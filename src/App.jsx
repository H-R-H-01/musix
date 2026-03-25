import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Home from './pages/Home';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="discover" element={<div className="p-8">Discover logic here</div>} />
          <Route path="library" element={<div className="p-8">Library logic here</div>} />
          <Route path="profile" element={<Profile />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="playlist/:id" element={<div className="p-8">Playlist View</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
