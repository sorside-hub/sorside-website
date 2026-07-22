import React, { useRef, useState } from "react";
import { Upload, Image as ImageIcon, X, Check, Link as LinkIcon } from "lucide-react";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  theme?: "dark" | "light";
  presetOptions?: Array<{ label: string; value: string }>;
  aspectRatio?: "square" | "video" | "portrait" | "banner";
  placeholder?: string;
  helpText?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  label = "Foto / Cover / Sampul",
  theme = "dark",
  presetOptions = [],
  aspectRatio = "square",
  placeholder = "Pilih file dari perangkat atau masukkan URL gambar...",
  helpText = "Upload foto dari HP/Komputer (JPG, PNG, WebP) atau pilih dari galeri default."
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeMode, setActiveMode] = useState<"file" | "preset" | "url">("file");
  const [dragOver, setDragOver] = useState(false);

  // Compress image using HTML5 Canvas to keep Data URL optimized for DB storage
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Max dimension 1200px for crisp quality while staying lightweight
          const maxDim = 1200;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(e.target?.result as string);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Quality 0.85 JPEG or WebP
          const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
          resolve(dataUrl);
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Mohon pilih file gambar yang valid (JPG, PNG, WebP, GIF)");
      return;
    }

    try {
      setIsUploading(true);
      const dataUrl = await compressImage(file);
      onChange(dataUrl);
    } catch (err) {
      console.error("Gagal memproses gambar:", err);
      alert("Gagal memproses file gambar. Silakan coba file lain.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const aspectRatioClass = {
    square: "aspect-square w-24 md:w-32",
    video: "aspect-video w-36 md:w-48",
    portrait: "aspect-[3/4] w-24 md:w-32",
    banner: "aspect-[3/1] w-full max-h-32"
  }[aspectRatio];

  return (
    <div className="space-y-2 text-left">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-sans uppercase tracking-wider text-stone-500 font-bold block">
          {label}
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-[10px] font-mono text-red-500 hover:text-red-400 flex items-center gap-1 cursor-pointer"
          >
            <X size={12} />
            <span>Hapus Foto</span>
          </button>
        )}
      </div>

      <div className={`p-4 rounded-xl border transition-all ${
        theme === "dark" 
          ? "bg-zinc-950/70 border-zinc-800 text-white" 
          : "bg-stone-50 border-stone-200 text-stone-900"
      }`}>
        {/* Main Content Area */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          {/* Image Preview Box */}
          <div className={`relative rounded-lg overflow-hidden border flex-shrink-0 bg-stone-900 flex items-center justify-center ${aspectRatioClass} ${
            theme === "dark" ? "border-zinc-800" : "border-stone-200"
          }`}>
            {value ? (
              <>
                <img
                  src={value}
                  alt="Preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/pages/artist_bedroom.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-1.5 bg-sorside-red text-white rounded-md text-[10px] font-sans uppercase font-bold flex items-center gap-1 shadow cursor-pointer"
                    title="Ganti Foto"
                  >
                    <Upload size={12} />
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center p-2 space-y-1 text-stone-500">
                <ImageIcon size={24} className="mx-auto text-stone-600" />
                <span className="text-[9px] font-sans uppercase block">Belum ada foto</span>
              </div>
            )}
          </div>

          {/* Upload Controls */}
          <div className="flex-1 space-y-3 w-full">
            {/* Mode Selector Tabs */}
            <div className="flex border-b border-stone-500/20 pb-1 gap-4 text-[10px] font-sans uppercase tracking-wider">
              <button
                type="button"
                onClick={() => setActiveMode("file")}
                className={`pb-1 cursor-pointer flex items-center gap-1 font-bold transition-colors ${
                  activeMode === "file" 
                    ? "text-sorside-red border-b-2 border-sorside-red" 
                    : "text-stone-500 hover:text-stone-300"
                }`}
              >
                <Upload size={12} />
                <span>Upload File</span>
              </button>

              {presetOptions.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveMode("preset")}
                  className={`pb-1 cursor-pointer flex items-center gap-1 font-bold transition-colors ${
                    activeMode === "preset" 
                      ? "text-sorside-red border-b-2 border-sorside-red" 
                      : "text-stone-500 hover:text-stone-300"
                  }`}
                >
                  <ImageIcon size={12} />
                  <span>Pilih Galeri</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setActiveMode("url")}
                className={`pb-1 cursor-pointer flex items-center gap-1 font-bold transition-colors ${
                  activeMode === "url" 
                    ? "text-sorside-red border-b-2 border-sorside-red" 
                    : "text-stone-500 hover:text-stone-300"
                }`}
              >
                <LinkIcon size={12} />
                <span>URL Gambar</span>
              </button>
            </div>

            {/* Hidden HTML File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0])}
            />

            {/* Mode 1: Drag & Drop / File Selector */}
            {activeMode === "file" && (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                  dragOver
                    ? "border-sorside-red bg-sorside-red/10"
                    : theme === "dark"
                    ? "border-zinc-800 hover:border-sorside-red/50 bg-zinc-900/40"
                    : "border-stone-300 hover:border-sorside-red/50 bg-stone-100"
                }`}
              >
                {isUploading ? (
                  <div className="flex items-center justify-center gap-2 py-1 text-xs text-sorside-red font-mono">
                    <span className="w-4 h-4 border-2 border-sorside-red border-t-transparent rounded-full animate-spin" />
                    <span>Memproses & Mengompres Gambar...</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Upload size={20} className="mx-auto text-sorside-red" />
                    <p className="text-xs font-sans font-bold text-stone-300 dark:text-stone-200">
                      Klik untuk pilih foto dari perangkat HP / Komputer
                    </p>
                    <p className="text-[10px] text-stone-500 font-sans">
                      Atau drag & drop file foto ke area kotak ini (PNG, JPG, WebP)
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Mode 2: Preset Gallery Selector */}
            {activeMode === "preset" && presetOptions.length > 0 && (
              <div className="space-y-1">
                <select
                  value={presetOptions.some(p => p.value === value) ? value : ""}
                  onChange={(e) => onChange(e.target.value)}
                  className={`w-full p-2.5 rounded-lg border text-xs font-sans ${
                    theme === "dark"
                      ? "bg-zinc-900 border-zinc-800 text-white focus:border-sorside-red"
                      : "bg-white border-stone-200 text-stone-900 focus:border-sorside-red"
                  }`}
                >
                  <option value="">-- Pilih dari Galeri Presets --</option>
                  {presetOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Mode 3: Custom Image URL Input */}
            {activeMode === "url" && (
              <div className="space-y-1">
                <input
                  type="text"
                  value={value || ""}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder={placeholder}
                  className={`w-full p-2.5 rounded-lg border text-xs font-sans ${
                    theme === "dark"
                      ? "bg-zinc-900 border-zinc-800 text-white focus:border-sorside-red"
                      : "bg-white border-stone-200 text-stone-900 focus:border-sorside-red"
                  }`}
                />
              </div>
            )}

            {helpText && (
              <p className="text-[9px] text-stone-500 font-sans leading-tight">
                * {helpText}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
