import { useState, useRef, useCallback } from "react";
import { Upload, X, FileVideo, Image, AlertCircle } from "lucide-react";

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  label?: string;
  hint?: string;
  onFilesChange?: (files: File[]) => void;
}

interface PreviewFile {
  file: File;
  url: string;
  progress: number;
  done: boolean;
  error?: string;
}

export default function FileUpload({ accept = "image/*,video/*", multiple = true, maxSizeMB = 20, label, hint, onFilesChange }: FileUploadProps) {
  const [files, setFiles] = useState<PreviewFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback((newFiles: File[]) => {
    const processed: PreviewFile[] = newFiles.map(file => {
      const sizeMB = file.size / 1024 / 1024;
      const error = sizeMB > maxSizeMB ? `File too large (max ${maxSizeMB}MB)` : undefined;
      const url = URL.createObjectURL(file);
      return { file, url, progress: 0, done: false, error };
    });

    setFiles(prev => {
      const updated = multiple ? [...prev, ...processed] : processed;
      onFilesChange?.(updated.filter(f => !f.error).map(f => f.file));
      return updated;
    });

    // Fake progress for valid files
    processed.filter(f => !f.error).forEach((pf, i) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 25 + 10;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setFiles(prev => prev.map(f => f.url === pf.url ? { ...f, progress: 100, done: true } : f));
        } else {
          setFiles(prev => prev.map(f => f.url === pf.url ? { ...f, progress } : f));
        }
      }, 200 + i * 100);
    });
  }, [maxSizeMB, multiple, onFilesChange]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    if (dropped.length) processFiles(dropped);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length) processFiles(selected);
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeFile = (url: string) => {
    setFiles(prev => {
      const next = prev.filter(f => f.url !== url);
      onFilesChange?.(next.filter(f => !f.error).map(f => f.file));
      return next;
    });
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3">
      {label && <label className="block text-sm font-medium text-gold-400">{label}</label>}

      <div onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)} onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200
          ${dragging ? "border-gold-500 bg-gold-700/5 scale-[1.01]" : "border-ink-500 hover:border-gold-700 hover:bg-white/2"}`}>
        <input ref={inputRef} type="file" accept={accept} multiple={multiple} onChange={handleInput} className="hidden" />
        <div className="flex flex-col items-center gap-2">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors
            ${dragging ? "bg-gold-700/20" : "bg-ink-700"}`}>
            <Upload size={22} className={dragging ? "text-gold-400" : "text-gold-700"} />
          </div>
          <div>
            <p className="text-gold-500 font-medium text-sm">{dragging ? "Drop files here" : "Drag & drop or click to upload"}</p>
            {hint && <p className="text-gold-700 text-xs mt-1">{hint}</p>}
            <p className="text-gold-700 text-xs mt-1">Max {maxSizeMB}MB per file</p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {files.map(pf => (
            <div key={pf.url} className="relative glass-card overflow-hidden">
              {pf.error ? (
                <div className="h-24 flex flex-col items-center justify-center gap-1 text-crimson-400 p-2">
                  <AlertCircle size={20} />
                  <span className="text-xs text-center">{pf.error}</span>
                </div>
              ) : pf.file.type.startsWith("video") ? (
                <div className="relative h-24">
                  <video src={pf.url} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <FileVideo size={24} className="text-gold-400" />
                  </div>
                </div>
              ) : (
                <img src={pf.url} alt="preview" className="w-full h-24 object-cover" />
              )}

              {!pf.done && !pf.error && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-ink-700">
                  <div className="h-full bg-gold-gradient transition-all duration-200"
                    style={{ width: `${pf.progress}%` }} />
                </div>
              )}

              {pf.done && (
                <div className="absolute top-1 left-1">
                  <span className="text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 rounded-full w-5 h-5 flex items-center justify-center text-xs">✓</span>
                </div>
              )}

              <button onClick={(e) => { e.stopPropagation(); removeFile(pf.url); }}
                className="absolute top-1 right-1 w-5 h-5 bg-crimson-600/80 rounded-full flex items-center justify-center text-white hover:bg-crimson-500 transition-colors">
                <X size={10} />
              </button>

              <div className="px-2 py-1 bg-ink-800/80">
                <p className="text-xs text-gold-700 truncate">{pf.file.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
