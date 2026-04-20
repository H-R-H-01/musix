import { useState, useRef, useEffect } from 'react';
import { Mic, Square, X, Music, Save, Trash2, Volume2 } from 'lucide-react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useLibraryStore } from '../../store/useLibraryStore';
import { cn } from '../../lib/utils';

export default function KaraokeOverlay() {
  const { isKaraokeMode, setKaraokeMode, currentSong, isPlaying, setPlayState } = usePlayerStore();
  const { addKaraokeRecording } = useLibraryStore();
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [visualizerData, setVisualizerData] = useState(new Array(30).fill(0));
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const animationRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);

  useEffect(() => {
    if (!isKaraokeMode) {
      stopRecording();
      return;
    }

    // Initialize audio context for visualization
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    return () => {
      stopRecording();
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [isKaraokeMode]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Setup visualization
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 64;
      source.connect(analyserRef.current);
      
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const updateVisualizer = () => {
        analyserRef.current.getByteFrequencyData(dataArray);
        const normalizedData = Array.from(dataArray).map(v => v / 255);
        setVisualizerData(normalizedData);
        animationRef.current = requestAnimationFrame(updateVisualizer);
      };
      updateVisualizer();

      // Setup MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setRecordedBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setRecordedBlob(null);

      // Start music if not playing
      if (!isPlaying) {
        setPlayState(true);
      }

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    clearInterval(timerRef.current);
    cancelAnimationFrame(animationRef.current);
    setVisualizerData(new Array(30).fill(0));
  };

  const handleSave = () => {
    if (!recordedBlob || !currentSong) return;
    
    const recordingUrl = URL.createObjectURL(recordedBlob);
    addKaraokeRecording({
      id: Date.now().toString(),
      songId: currentSong.id,
      songTitle: currentSong.title,
      artist: currentSong.artist,
      coverUrl: currentSong.cover_url,
      recordingUrl,
      duration: recordingTime,
      createdAt: new Date().toISOString()
    });
    
    alert('Karaoke recording saved to your library!');
    setRecordedBlob(null);
    setRecordingTime(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isKaraokeMode) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-2xl flex flex-col items-center justify-center animated-fade-in p-8">
      <button 
        onClick={() => setKaraokeMode(false)}
        className="absolute top-8 right-8 p-3 rounded-full hover:bg-accent transition-colors"
      >
        <X size={24} />
      </button>

      <div className="max-w-2xl w-full flex flex-col items-center text-center gap-8">
        {/* Song Info */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative group">
            <img 
              src={currentSong?.cover_url || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=300&h=300'} 
              className={cn(
                "w-48 h-48 rounded-2xl shadow-2xl object-cover transition-transform duration-700",
                isRecording && "scale-110 animate-pulse-subtle"
              )}
              alt="Song Cover"
            />
            {isRecording && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          <div>
            <h2 className="text-3xl font-extrabold mb-1">{currentSong?.title || 'Select a song'}</h2>
            <p className="text-xl text-muted-foreground">{currentSong?.artist || 'Ready to sing?'}</p>
          </div>
        </div>

        {/* Visualizer */}
        <div className="h-32 flex items-end justify-center gap-1 w-full max-w-md">
          {visualizerData.map((v, i) => (
            <div 
              key={i}
              className="w-2 bg-primary rounded-full transition-all duration-75"
              style={{ height: `${Math.max(10, v * 100)}%`, opacity: 0.3 + (v * 0.7) }}
            ></div>
          ))}
        </div>

        {/* Recording Stats */}
        { (isRecording || recordingTime > 0) && (
          <div className="flex items-center gap-4 bg-accent/50 px-6 py-3 rounded-full backdrop-blur-md">
             <div className="flex items-center gap-2 text-primary">
                <div className={cn("w-2 h-2 rounded-full bg-primary", isRecording && "animate-pulse")} />
                <span className="font-mono text-xl">{formatTime(recordingTime)}</span>
             </div>
             {recordedBlob && !isRecording && (
               <span className="text-sm font-medium text-muted-foreground px-2 py-1 bg-background/50 rounded-md">Recording Ready</span>
             )}
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center gap-6 mt-4">
          {!isRecording ? (
            <button 
              onClick={startRecording}
              className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition-all hover:scale-110 shadow-lg shadow-red-500/25 active:scale-95"
            >
              <Mic size={32} />
            </button>
          ) : (
            <button 
              onClick={stopRecording}
              className="w-20 h-20 rounded-full bg-foreground flex items-center justify-center text-background transition-all hover:scale-110 shadow-lg active:scale-95"
            >
              <Square size={32} fill="currentColor" />
            </button>
          )}

          {recordedBlob && !isRecording && (
            <div className="flex gap-4">
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transform transition hover:scale-105 active:scale-95 shadow-lg"
              >
                <Save size={20} />
                Save Recording
              </button>
              <button 
                onClick={() => { setRecordedBlob(null); setRecordingTime(0); }}
                className="p-3 rounded-full bg-accent hover:bg-accent/80 text-foreground transition-all hover:scale-105 active:scale-95"
              >
                <Trash2 size={24} />
              </button>
            </div>
          )}
        </div>

        <div className="max-w-md text-sm text-muted-foreground">
          <p>Sing along with the music! Your voice will be recorded using your microphone. Make sure you use headphones for the best result.</p>
        </div>
      </div>
    </div>
  );
}

