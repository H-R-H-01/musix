import { useState } from 'react';
import { useLibraryStore } from '../store/useLibraryStore';
import { useAuthStore } from '../store/useAuthStore';
import { UploadCloud, CheckCircle2, Layout, Plus, Trash2 } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const { homeSections, updateHomeSections } = useLibraryStore();
  
  const [uploadStatus, setUploadStatus] = useState('');
  const [songName, setSongName] = useState('');
  
  if (user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-full">
        <h2 className="text-xl font-bold">Access Denied. You must be an admin.</h2>
      </div>
    );
  }

  const handleUpload = (e) => {
    e.preventDefault();
    setUploadStatus('uploading');
    // Mock upload
    setTimeout(() => {
      setUploadStatus('success');
      setSongName('');
      setTimeout(() => setUploadStatus(''), 3000);
    }, 1500);
  };

  const handleAddSection = () => {
    updateHomeSections([
      ...homeSections,
      { id: Date.now().toString(), title: 'New Section', type: 'list' }
    ]);
  };

  const handleRemoveSection = (id) => {
    updateHomeSections(homeSections.filter(s => s.id !== id));
  };

  const handleUpdateSectionTitle = (id, newTitle) => {
    updateHomeSections(homeSections.map(s => 
      s.id === id ? { ...s, title: newTitle } : s
    ));
  };

  return (
    <div className="animated-fade-in max-w-4xl mx-auto h-full flex flex-col gap-10">
      
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage platform content and customize user experience.</p>
      </div>

      <section className="bg-sidebar p-6 rounded-2xl border border-border">
        <div className="flex items-center gap-3 mb-6">
          <UploadCloud className="text-primary" />
          <h2 className="text-2xl font-bold">Upload Music</h2>
        </div>
        
        <form onSubmit={handleUpload} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="song_name">Song Title</label>
            <input 
              required
              id="song_name"
              type="text" 
              value={songName}
              onChange={(e) => setSongName(e.target.value)}
              className="w-full h-10 bg-background rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary border border-border"
              placeholder="e.g. Midnight City"
            />
          </div>
          <div>
             <label className="block text-sm font-medium mb-1">Upload Audio File (mp3, wav)</label>
             <div className="border-2 border-dashed border-border rounded-md p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-background/50 transition-colors">
                <UploadCloud size={24} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Select a file from your device</span>
             </div>
          </div>
          <button 
            type="submit" 
            disabled={uploadStatus === 'uploading'}
            className="h-10 px-6 rounded-md bg-foreground text-background font-semibold text-sm hover:scale-105 transition-transform disabled:opacity-50 flex items-center gap-2"
          >
            {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload to Platform'}
          </button>
          
          {uploadStatus === 'success' && (
            <div className="flex items-center gap-2 text-green-500 text-sm mt-2">
              <CheckCircle2 size={16} /> Song successfully uploaded to global library!
            </div>
          )}
        </form>
      </section>

      <section className="bg-sidebar p-6 rounded-2xl border border-border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Layout className="text-primary" />
            <h2 className="text-2xl font-bold">Home Page Customization</h2>
          </div>
          <button 
            onClick={handleAddSection}
            className="text-sm font-medium flex items-center gap-2 hover:text-primary transition-colors bg-background px-3 py-1.5 rounded-full border border-border"
          >
            <Plus size={14} /> Add Section
          </button>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">Edit the sections that appear on every user's Home Feed.</p>

        <div className="space-y-4">
          {homeSections.map((section, idx) => (
            <div key={section.id} className="flex items-center gap-4 bg-background p-4 rounded-xl border border-border group">
              <div className="flex flex-col flex-1 gap-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Section {idx + 1} Title</label>
                <input 
                  type="text" 
                  value={section.title}
                  onChange={(e) => handleUpdateSectionTitle(section.id, e.target.value)}
                  className="w-full bg-transparent text-lg font-bold focus:outline-none"
                />
              </div>
              <div className="text-sm text-muted-foreground bg-accent px-3 py-1 rounded-full uppercase tracking-wider font-semibold text-xs h-min">
                {section.type} Layout
              </div>
              <button 
                onClick={() => handleRemoveSection(section.id)}
                className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          {homeSections.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No sections created. Users will see a blank home page.
            </div>
          )}
        </div>
      </section>
      
    </div>
  );
}
