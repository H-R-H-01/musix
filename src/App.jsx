import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="discover" element={<div className="p-8">Discover logic here</div>} />
          <Route path="library" element={<div className="p-8">Library logic here</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
