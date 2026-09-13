import { useState, useRef } from "react";
import { Video, Upload, Play, Pause, Scissors, Save, RotateCcw, Volume2, VolumeX, ChevronLeft, Film } from "lucide-react";
import { useLang, useToast } from "@/contexts/AppContext";
import { useNavigate } from "react-router-dom";

export default function VideoEditor() {
  const { t } = useLang();
  const { toast } = useToast();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(100);
  const [showTrimControls, setShowTrimControls] = useState(false);
  const [filter, setFilter] = useState("none");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        toast("error", "File too large. Max 100MB allowed.");
        return;
      }
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      toast("success", "Video uploaded successfully!");
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
    setTrimEnd(videoRef.current.duration);
  };

  const applyTrim = () => {
    if (!videoRef.current) return;
    const start = (trimStart / 100) * duration;
    videoRef.current.currentTime = start;
    toast("success", `Trim applied: ${start.toFixed(1)}s to ${((trimEnd / 100) * duration).toFixed(1)}s`);
  };

  const filters = [
    { id: "none", label: "Original", css: "none" },
    { id: "bright", label: "Bright", css: "brightness(1.2)" },
    { id: "warm", label: "Warm", css: "sepia(0.3) saturate(1.3)" },
    { id: "cool", label: "Cool", css: "saturate(0.8) hue-rotate(20deg)" },
    { id: "contrast", label: "High Contrast", css: "contrast(1.3)" },
    { id: "bw", label: "B&W", css: "grayscale(1)" },
  ];

  const saveVideo = () => {
    toast("success", "Video saved to your profile gallery!");
    navigate("/worker-dashboard");
  };

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-10">
      <div className="page-container max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="glass-card p-2 hover:border-gold-700/40 transition-all">
            <ChevronLeft size={20} className="text-gold-400" />
          </button>
          <div>
            <h1 className="font-display font-bold text-2xl text-gold-400 flex items-center gap-2">
              <Film size={22} /> {t.videoEditTitle}
            </h1>
            <p className="text-gold-700 text-sm">{t.videoEditDesc}</p>
          </div>
        </div>

        {!videoSrc ? (
          /* Upload Area */
          <div className="glass-card p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-gold-700/10 flex items-center justify-center mx-auto mb-6">
              <Video size={32} className="text-gold-500" />
            </div>
            <h3 className="font-display font-semibold text-xl text-gold-400 mb-2">Upload Your Work Video</h3>
            <p className="text-gold-700 text-sm mb-6 max-w-md mx-auto">
              Show customers your skills in action. Upload a video of your work — plumbing, electrical, cleaning, cooking, or any service you provide.
            </p>
            <label className="btn-gold px-8 py-4 inline-flex items-center gap-2 cursor-pointer">
              <Upload size={18} /> {t.videoUpload}
              <input type="file" accept="video/*" onChange={handleFileUpload} className="hidden" />
            </label>
            <p className="text-gold-700/60 text-xs mt-4">MP4, MOV, AVI • Max 100MB • Recommended: 30-120 seconds</p>

            {/* Tips */}
            <div className="mt-8 glass-card p-5 text-left max-w-md mx-auto">
              <h4 className="text-gold-400 font-semibold text-sm mb-3">Tips for a great work video:</h4>
              <ul className="space-y-2 text-gold-700 text-xs">
                <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> Show the before and after of your work</li>
                <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> Keep the camera steady and well-lit</li>
                <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> Include your face briefly to build trust</li>
                <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> Keep it between 30-90 seconds</li>
                <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> Add text overlay explaining the work</li>
              </ul>
            </div>
          </div>
        ) : (
          /* Editor */
          <div className="space-y-6">
            {/* Video Preview */}
            <div className="glass-card p-4">
              <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
                <video
                  ref={videoRef}
                  src={videoSrc}
                  className="w-full h-full object-contain"
                  style={{ filter: filter !== "none" ? filters.find(f => f.id === filter)?.css : "none" }}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={() => setIsPlaying(false)}
                />
                {/* Play overlay */}
                {!isPlaying && (
                  <button onClick={togglePlay} className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors">
                    <div className="w-16 h-16 rounded-full bg-gold-600/80 flex items-center justify-center backdrop-blur-sm">
                      <Play size={28} className="text-white ml-1" />
                    </div>
                  </button>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3 mt-3">
                <button onClick={togglePlay} className="text-gold-400 hover:text-gold-300">
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button onClick={toggleMute} className="text-gold-400 hover:text-gold-300">
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <div className="flex-1 h-1.5 bg-ink-600 rounded-full relative cursor-pointer"
                  onClick={(e) => {
                    if (!videoRef.current) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pct = (e.clientX - rect.left) / rect.width;
                    videoRef.current.currentTime = pct * duration;
                  }}>
                  <div className="h-full bg-gold-gradient rounded-full" style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }} />
                </div>
                <span className="text-gold-700 text-xs font-mono w-20 text-right">{formatTime(currentTime)} / {formatTime(duration)}</span>
              </div>
            </div>

            {/* Trim Controls */}
            <div className="glass-card p-5">
              <button onClick={() => setShowTrimControls(!showTrimControls)}
                className="flex items-center gap-2 text-gold-400 font-medium text-sm mb-3">
                <Scissors size={16} /> {t.videoTrim}
              </button>
              {showTrimControls && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="text-xs text-gold-600 w-16">Start</label>
                    <input type="range" min={0} max={100} value={trimStart}
                      onChange={e => setTrimStart(+e.target.value)}
                      className="flex-1 accent-yellow-500" />
                    <span className="text-gold-400 text-xs font-mono w-12">{formatTime((trimStart / 100) * duration)}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="text-xs text-gold-600 w-16">End</label>
                    <input type="range" min={0} max={100} value={trimEnd}
                      onChange={e => setTrimEnd(+e.target.value)}
                      className="flex-1 accent-yellow-500" />
                    <span className="text-gold-400 text-xs font-mono w-12">{formatTime((trimEnd / 100) * duration)}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={applyTrim} className="btn-gold py-2 px-4 text-sm flex items-center gap-1.5">
                      <Scissors size={14} /> Apply Trim
                    </button>
                    <button onClick={() => { setTrimStart(0); setTrimEnd(100); }}
                      className="btn-outline-gold py-2 px-4 text-sm flex items-center gap-1.5">
                      <RotateCcw size={14} /> Reset
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Filters */}
            <div className="glass-card p-5">
              <h3 className="text-gold-400 font-medium text-sm mb-3">Visual Filters</h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {filters.map(f => (
                  <button key={f.id} onClick={() => setFilter(f.id)}
                    className={`py-2 px-3 rounded-xl text-xs border transition-all text-center
                      ${filter === f.id ? "border-gold-600 bg-gold-700/10 text-gold-400" : "border-ink-500 text-gold-700 hover:border-gold-700"}`}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Save */}
            <div className="flex gap-3">
              <button onClick={saveVideo} className="btn-gold flex-1 py-3 flex items-center justify-center gap-2">
                <Save size={16} /> {t.videoSave}
              </button>
              <button onClick={() => { setVideoSrc(null); setIsPlaying(false); }}
                className="btn-outline-gold py-3 px-6 text-sm">
                Upload New
              </button>
            </div>

            {/* Hidden canvas for potential frame capture */}
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}
      </div>
    </div>
  );
}
