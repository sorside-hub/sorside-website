import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Play, 
  Pause, 
  ArrowLeft, 
  BookOpen, 
  Disc, 
  Calendar, 
  Mic, 
  Radio, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Search,
  X
} from "lucide-react";
import { Song, Track } from "../types";
import { SONGS_DATA } from "../data/musicData";
import { HomeConfig } from "../lib/homeConfig";
import MarkdownRenderer from "./MarkdownRenderer";

interface MusicPageProps {
  theme: "dark" | "light";
  currentSong: Song | null;
  currentTrack: Track | null;
  isAudioPlaying: boolean;
  songs: Song[];
  config: HomeConfig;
  onPlaySong: (song: Song, track?: Track) => void;
  onPauseSong: () => void;
  onOpenJournal: (title: string) => void;
  activeReleaseId?: string | null;
  onSelectRelease?: (id: string | null) => void;
}

// Utility to parse YouTube video ID from URL
function getYouTubeId(url?: string): string | null {
  if (!url) return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export default function MusicPage({
  theme,
  currentSong,
  currentTrack,
  isAudioPlaying,
  songs,
  config,
  onPlaySong,
  onPauseSong,
  onOpenJournal,
  activeReleaseId,
  onSelectRelease
}: MusicPageProps) {
  const [filter, setFilter] = useState<"ALL" | "SINGLE" | "EP" | "ALBUM">("ALL");
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [activeTrack, setActiveTrack] = useState<Track | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Sync selectedSong and activeTrack with activeReleaseId prop
  useEffect(() => {
    if (activeReleaseId) {
      const match = (songs || []).find(s => s.id === activeReleaseId);
      if (match) {
        setSelectedSong(match);
        if (match.tracks && match.tracks.length > 0) {
          setActiveTrack(match.tracks[0]);
        } else {
          setActiveTrack(null);
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setSelectedSong(null);
        setActiveTrack(null);
      }
    } else {
      setSelectedSong(null);
      setActiveTrack(null);
    }
  }, [activeReleaseId, songs]);

  const handleSelectSong = (song: Song | null) => {
    if (onSelectRelease) {
      onSelectRelease(song ? song.id : null);
    } else {
      setSelectedSong(song);
      if (song && song.tracks && song.tracks.length > 0) {
        setActiveTrack(song.tracks[0]);
      } else {
        setActiveTrack(null);
      }
    }
  };

  // Filter songs based on category tag and search query
  const filteredSongs = (songs || []).filter(song => {
    // 1. Tag matching
    if (filter !== "ALL" && song.tag !== filter) return false;
    
    // 2. Search query matching
    if (searchQuery.trim() === "") return true;
    
    const query = searchQuery.toLowerCase().trim();
    
    // Matches song title, artist, description, release type
    const matchesSongMeta = 
      song.title.toLowerCase().includes(query) ||
      song.artist.toLowerCase().includes(query) ||
      (song.about && song.about.toLowerCase().includes(query)) ||
      (song.story && song.story.toLowerCase().includes(query)) ||
      song.type.toLowerCase().includes(query);
      
    // Matches any of the track titles, stories or lyrics in EPs/albums
    const matchesTrack = song.tracks?.some(track => 
      track.title.toLowerCase().includes(query) || 
      (track.story && track.story.toLowerCase().includes(query)) ||
      (track.lyrics && track.lyrics.toLowerCase().includes(query))
    ) || false;
    
    return matchesSongMeta || matchesTrack;
  });

  // Featured song selection based on config or falls back to first song
  const songsList = songs || [];
  const featuredSong = songsList.find(s => s.id === config.featuredReleaseId) || 
                       songsList.find(s => s.id === config.latestReleaseSongId) || 
                       songsList[0];

  const handleSongPlayToggle = (song: Song) => {
    if (currentSong?.id === song.id && isAudioPlaying) {
      onPauseSong();
    } else {
      onPlaySong(song);
    }
  };

  return (
    <div className="space-y-16 md:space-y-24 min-h-screen">
      <AnimatePresence mode="wait">
        {!selectedSong ? (
          <motion.div
            key="catalog"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5 }}
            className="space-y-16 md:space-y-24"
          >
            {/* 1. MUSIC HERO SECTION */}
            <section className="relative overflow-hidden rounded-3xl border border-sorside-red/10 p-8 md:p-16 flex flex-col justify-between min-h-[40vh] md:min-h-[50vh] bg-stone-950 text-white shadow-2xl">
              {/* Subtle Lyric Snippet Moving in Background */}
              <div className="absolute top-1/4 right-0 transform translate-x-12 select-none pointer-events-none opacity-[0.03] text-5xl md:text-8xl font-serif whitespace-nowrap tracking-widest leading-none">
                "menanti esok tanpa curiga..."
              </div>
              <div className="absolute bottom-1/4 left-0 transform -translate-x-12 select-none pointer-events-none opacity-[0.02] text-5xl md:text-8xl font-serif whitespace-nowrap tracking-widest leading-none">
                "menanti esok tanpa curiga..."
              </div>

              {/* Grid background simulation */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(224,36,36,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(224,36,36,0.03)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)] pointer-events-none" />

              {/* Atmospheric visualizer waveform background */}
              <div className="absolute bottom-0 left-0 right-0 h-24 flex items-end justify-center gap-[3px] px-6 select-none pointer-events-none opacity-20">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-[3px] rounded-t bg-sorside-red transition-all"
                    style={{
                      height: isAudioPlaying 
                        ? `${Math.max(10, Math.sin(i * 0.4 + Date.now() * 0.003) * 60 + 40)}%` 
                        : `${(i % 5) * 4 + 10}%`,
                      opacity: 0.3 + (i % 3) * 0.2
                    }}
                  />
                ))}
              </div>

              {/* Title & Copy */}
              <div className="space-y-4 max-w-xl z-10">
                <span className="text-xs font-mono tracking-[0.4em] text-sorside-red uppercase font-semibold">
                  {config?.musicTitlePrefix || "SISI SUARA // ARCHIVES"}
                </span>
                <h1 className="text-4xl md:text-6xl font-display font-extrabold tracking-tight uppercase">
                  MUSIC
                </h1>
                <p className="text-base md:text-xl font-serif italic text-sorside-red leading-relaxed max-w-md">
                  &ldquo;{config?.musicQuote || config?.musicSubtitle || "Kumpulan bebunyian, cerita, dan sisa-sisa ingatan dari sudut kamar sorside."}&rdquo;
                </p>
                <p className="text-xs font-mono text-stone-500 max-w-sm pt-2 leading-relaxed">
                  {config?.musicDescription || "Dari rekaman kasar di kamar hingga rilisan utuh. Setiap trek menyimpan fragmen emosi dan eksperimen nada independen."}
                </p>
              </div>

              {/* Footer Indicator info inside hero */}
              <div className="pt-12 flex items-center gap-6 text-[10px] font-mono uppercase tracking-widest text-zinc-500 z-10">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-sorside-red rounded-full animate-pulse" />
                  <span>Eksplorasi Audio Mandiri</span>
                </div>
                <span>•</span>
                <span>Arsip Nada & Cerita</span>
              </div>
            </section>

            {/* 2. FEATURED RELEASE SECTION */}
            {featuredSong && (
              <section className="space-y-6">
                <div className="flex items-center space-x-2">
                  <span className="h-[1px] w-8 bg-sorside-red" />
                  <span className="text-[10px] font-mono tracking-[0.25em] text-sorside-red uppercase">
                    Rilisan Pilihan
                  </span>
                </div>

                <div className={`p-6 md:p-10 rounded-3xl border transition-all duration-500 relative overflow-hidden ${
                  theme === "dark" 
                    ? "bg-zinc-950/40 border-zinc-900/80 hover:border-sorside-red/20" 
                    : "bg-white border-stone-200/80 shadow-sm hover:border-sorside-red/10"
                }`}>
                  {/* Floating graphic */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-sorside-red/5 rounded-full blur-3xl pointer-events-none" />

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
                    
                    {/* Left Column: Cover art */}
                    <div className="lg:col-span-5 flex justify-center">
                      <div className="relative w-64 md:w-72 aspect-square group">
                        {/* Vinyl disc rotating animation peeking from behind cover on hover or when playing */}
                        <div className={`absolute top-0 left-4 w-full h-full rounded-full bg-zinc-900 border border-zinc-800 shadow-2xl transition-all duration-700 flex items-center justify-center pointer-events-none ${
                          isAudioPlaying && currentSong?.id === featuredSong.id 
                            ? "translate-x-12 rotate-[360deg]" 
                            : "group-hover:translate-x-6 group-hover:rotate-45"
                        }`}
                        style={{
                          animation: isAudioPlaying && currentSong?.id === featuredSong.id ? "spin 8s linear infinite" : undefined
                        }}>
                          {/* Vinyl ridges lines */}
                          <div className="w-4/5 h-4/5 rounded-full border border-zinc-800/50 flex items-center justify-center">
                            <div className="w-3/5 h-3/5 rounded-full border border-zinc-800/50 flex items-center justify-center">
                              {/* Vinyl Center label */}
                              <div className="w-12 h-12 rounded-full bg-sorside-red flex items-center justify-center">
                                <span className="text-[6px] text-white font-mono uppercase font-black tracking-tighter">SOR</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="absolute inset-0 bg-sorside-red/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        
                        {/* Main cover jacket */}
                        <div className={`relative w-full h-full overflow-hidden rounded-xl border transition-all duration-500 shadow-xl ${
                          theme === "dark" ? "border-zinc-800" : "border-stone-200"
                        }`}>
                          <img
                            src={featuredSong.cover}
                            alt={`${featuredSong.title} cover`}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover grayscale brightness-95 group-hover:grayscale-0 transition-all duration-700 group-hover:scale-102"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                          <div className="absolute bottom-4 left-4 right-4 text-left">
                            <span className="text-[9px] font-mono bg-sorside-red px-2 py-0.5 text-white rounded">
                              {featuredSong.year} TERBARU
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Descriptions & Player CTAs */}
                    <div className="lg:col-span-7 space-y-6">
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono tracking-[0.2em] text-sorside-red uppercase font-bold">
                          RILISAN TERBARU
                        </span>
                        <h2 className="text-2xl md:text-4xl font-display font-extrabold tracking-tight uppercase">
                          {featuredSong.title}
                        </h2>
                        <p className="text-xs font-mono text-stone-500">
                          {featuredSong.type} • {featuredSong.year} • sorside Records
                        </p>
                      </div>

                       <div className="prose prose-stone dark:prose-invert max-w-none">
                        <MarkdownRenderer content={featuredSong.story} theme={theme} />
                      </div>

                      <div className="flex flex-wrap items-center gap-4 pt-2">
                        <button
                          onClick={() => handleSongPlayToggle(featuredSong)}
                          className="px-6 py-3 bg-sorside-red hover:bg-red-700 text-white text-xs font-mono uppercase tracking-widest transition-all rounded shadow-md flex items-center gap-2 cursor-pointer group"
                        >
                          {isAudioPlaying && currentSong?.id === featuredSong.id ? (
                            <>
                              <Pause size={12} fill="currentColor" />
                              <span>Pause</span>
                            </>
                          ) : (
                            <>
                              <Play size={12} fill="currentColor" className="ml-0.5" />
                              <span>Play</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleSelectSong(featuredSong)}
                          className={`px-5 py-3 text-xs font-mono uppercase tracking-widest border transition-all rounded flex items-center gap-2 cursor-pointer ${
                            theme === "dark"
                              ? "border-zinc-800 text-gray-300 hover:bg-zinc-900"
                              : "border-stone-300 text-stone-700 hover:bg-stone-50"
                          }`}
                        >
                          <BookOpen size={12} />
                          <span>Baca Cerita</span>
                        </button>

                        <a
                          href={featuredSong.spotifyUrl || "https://open.spotify.com"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`px-5 py-3 text-xs font-mono uppercase tracking-widest border transition-colors flex items-center gap-2 cursor-pointer ${
                            theme === "dark" 
                              ? "border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900" 
                              : "border-stone-300 text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                          }`}
                          id="btn-spotify-featured"
                        >
                          <Radio size={12} />
                          <span>Spotify</span>
                          <ExternalLink size={10} />
                        </a>
                      </div>
                    </div>

                  </div>
                </div>
              </section>
            )}

            {/* 3. DISCOGRAPHY SECTION */}
            <section className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sorside-red/10 pb-4">
                <div className="space-y-1">
                  <h3 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-tight">
                    Diskografi
                  </h3>
                  <p className="text-xs font-mono text-stone-500">
                    Eksplorasi arsip karya sorside yang tulus.
                  </p>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* Search Input */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Cari lagu, album, EP, atau trek..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full sm:w-64 pl-9 pr-8 py-1.5 text-xs font-mono rounded border transition-all ${
                        theme === "dark"
                          ? "bg-zinc-900/40 border-zinc-800 text-white placeholder-zinc-500 focus:border-sorside-red/50 focus:outline-none"
                          : "bg-stone-50 border-stone-200 text-stone-900 placeholder-stone-400 focus:border-sorside-red/50 focus:outline-none"
                      }`}
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" size={12} />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-sorside-red transition-colors cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>

                  {/* Filters */}
                  <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest overflow-x-auto py-1">
                    {(["ALL", "SINGLE", "EP", "ALBUM"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`px-3 py-1.5 transition-all rounded cursor-pointer uppercase shrink-0 ${
                          filter === tab
                            ? "bg-sorside-red text-white font-semibold"
                            : theme === "dark"
                            ? "text-gray-400 hover:text-white bg-zinc-900/50 hover:bg-zinc-900"
                            : "text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Catalog Grid or Empty State */}
              {filteredSongs.length === 0 ? (
                <div className={`text-center py-16 px-4 rounded-2xl border ${
                  theme === "dark" 
                    ? "border-zinc-900 bg-zinc-950/10 text-stone-400" 
                    : "border-stone-200 bg-stone-50/50 text-stone-600"
                }`}>
                  <Disc size={32} className="mx-auto text-stone-500 mb-3 stroke-[1.5]" />
                  <p className="text-sm font-mono mb-2">Tidak ada lagu atau trek yang cocok dengan pencarian Anda.</p>
                  <p className="text-xs text-stone-500 mb-4 font-mono">Coba masukkan kata kunci lain seperti "malam", "sunyi", "neraka", dll.</p>
                  <button 
                    onClick={() => { setSearchQuery(""); setFilter("ALL"); }}
                    className="px-4 py-2 bg-sorside-red hover:bg-red-700 text-white text-[10px] font-mono uppercase tracking-widest rounded transition-all cursor-pointer"
                  >
                    Reset Filter & Pencarian
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  <AnimatePresence mode="popLayout">
                    {filteredSongs.map((song) => (
                      <motion.div
                      layout
                      key={song.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className={`group p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                        theme === "dark" 
                          ? "bg-zinc-950/20 border-zinc-900/60 hover:border-sorside-red/20" 
                          : "bg-white border-stone-200 shadow-sm hover:border-sorside-red/10"
                      }`}
                    >
                      <div className="space-y-4">
                        {/* Artwork */}
                        <div className="relative aspect-square w-full rounded-lg overflow-hidden border border-neutral-800/10 bg-neutral-900">
                          <img
                            src={song.cover}
                            alt={song.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          
                          {/* Inner overlay buttons */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleSongPlayToggle(song)}
                              className="w-12 h-12 rounded-full bg-sorside-red text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg cursor-pointer"
                              title={isAudioPlaying && currentSong?.id === song.id ? "Pause" : `Play ${song.title}`}
                            >
                              {isAudioPlaying && currentSong?.id === song.id ? (
                                <Pause size={16} fill="currentColor" />
                              ) : (
                                <Play size={16} fill="currentColor" className="ml-0.5" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Text */}
                        <div className="space-y-1">
                          <h4 className={`text-base font-serif font-bold group-hover:text-sorside-red transition-colors ${
                            theme === "dark" ? "text-white" : "text-stone-900"
                          }`}>
                            {song.title}
                          </h4>
                          <p className="text-xs font-mono text-stone-500">
                            {song.type} • {song.year}
                          </p>
                        </div>

                        {/* Matching tracks list */}
                        {searchQuery.trim() !== "" && song.tracks && song.tracks.some(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || (t.story && t.story.toLowerCase().includes(searchQuery.toLowerCase())) || (t.lyrics && t.lyrics.toLowerCase().includes(searchQuery.toLowerCase()))) && (
                          <div className={`mt-3 p-3 rounded-xl border space-y-2 text-left ${
                            theme === "dark" ? "bg-zinc-950/60 border-zinc-900 text-zinc-300" : "bg-stone-50 border-stone-200 text-stone-700"
                          }`}>
                            <div className="text-[9px] text-sorside-red font-mono font-bold uppercase tracking-widest flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 bg-sorside-red rounded-full animate-pulse" />
                              Trek yang cocok // Match:
                            </div>
                            <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                              {song.tracks
                                .filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || (t.story && t.story.toLowerCase().includes(searchQuery.toLowerCase())) || (t.lyrics && t.lyrics.toLowerCase().includes(searchQuery.toLowerCase())))
                                .map(t => (
                                  <div 
                                    key={t.id} 
                                    className="flex items-center justify-between gap-2 p-1 rounded hover:bg-sorside-red/10 transition-colors cursor-pointer group/item" 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSelectSong(song);
                                      setActiveTrack(t);
                                    }}
                                    title={`Buka & dengarkan: ${t.title}`}
                                  >
                                    <span className="truncate text-[11px] font-mono group-hover/item:text-sorside-red flex items-center gap-1">
                                      <Disc size={10} className="animate-spin-slow shrink-0 text-stone-500" />
                                      {t.title}
                                    </span>
                                    <span className="text-[9px] text-stone-500 shrink-0 font-mono">{t.duration}</span>
                                  </div>
                                ))
                              }
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Card actions */}
                      <div className="flex items-center justify-between pt-6 border-t border-stone-500/5 mt-6">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleSongPlayToggle(song)}
                            className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 hover:text-sorside-red transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            {isAudioPlaying && currentSong?.id === song.id ? (
                              <>
                                <Pause size={10} fill="currentColor" />
                                <span>Pause</span>
                              </>
                            ) : (
                              <>
                                <Play size={10} fill="currentColor" className="ml-0.5" />
                                <span>Play</span>
                              </>
                            )}
                          </button>

                          <a
                            href={song.spotifyUrl || "https://open.spotify.com"}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 hover:text-sorside-red transition-colors flex items-center gap-1 cursor-pointer"
                            title={`Dengarkan ${song.title} di Spotify`}
                          >
                            <Radio size={10} />
                            <span>Spotify</span>
                            <ExternalLink size={8} />
                          </a>
                        </div>

                        <button
                          onClick={() => handleSelectSong(song)}
                          className="text-[10px] font-mono uppercase tracking-widest text-sorside-red font-bold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>Baca Cerita</span>
                          <ChevronRight size={10} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
            </section>
          </motion.div>
        ) : (
          /* 4. SONG / RELEASE DETAIL VIEW */
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-12"
          >
            {/* Back Button */}
            <button
              onClick={() => handleSelectSong(null)}
              className="px-4 py-2 border border-stone-500/10 hover:border-sorside-red text-stone-500 hover:text-sorside-red rounded-lg text-xs font-mono uppercase tracking-widest transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft size={12} />
              <span>Kembali ke Diskografi</span>
            </button>

            {/* Immersive Header Block */}
            <section className={`p-6 md:p-12 rounded-3xl border ${
              theme === "dark" ? "bg-zinc-950/40 border-zinc-900" : "bg-white border-stone-200 shadow-sm"
            }`}>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
                
                {/* Cover Frame */}
                <div className="md:col-span-4 flex justify-center w-full">
                  <div className="relative w-48 md:w-64 aspect-square group">
                    <div className="absolute inset-0 bg-sorside-red/10 rounded-xl blur-md" />
                    <img
                      src={selectedSong.cover}
                      alt={selectedSong.title}
                      referrerPolicy="no-referrer"
                      className="relative z-10 w-full h-full object-cover rounded-xl border border-neutral-800/10 shadow-lg grayscale brightness-95 group-hover:grayscale-0 duration-500 transition-all"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center z-20 transition-opacity duration-300 rounded-xl">
                      <button
                        onClick={() => {
                          if (selectedSong.tracks && selectedSong.tracks.length > 0) {
                            const trackToPlay = activeTrack || selectedSong.tracks[0];
                            onPlaySong(selectedSong, trackToPlay);
                          } else {
                            onPlaySong(selectedSong);
                          }
                        }}
                        className="w-12 h-12 rounded-full bg-sorside-red text-white flex items-center justify-center shadow-lg transform scale-95 group-hover:scale-100 transition-transform cursor-pointer"
                      >
                        <Play size={16} fill="currentColor" className="ml-0.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Cover info */}
                <div className="md:col-span-8 space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight uppercase text-sorside-red">
                      {selectedSong.title}
                    </h2>
                    <p className="text-xs font-mono text-stone-500">
                      {selectedSong.type} • {selectedSong.year}
                    </p>
                  </div>

                  {/* Play CTA inline */}
                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      onClick={() => {
                        if (selectedSong.tracks && selectedSong.tracks.length > 0) {
                          const trackToPlay = activeTrack || selectedSong.tracks[0];
                          const isTrackPlaying = isAudioPlaying && currentSong?.id === selectedSong.id && currentTrack?.id === trackToPlay.id;
                          if (isTrackPlaying) {
                            onPauseSong();
                          } else {
                            onPlaySong(selectedSong, trackToPlay);
                            setActiveTrack(trackToPlay);
                          }
                        } else {
                          handleSongPlayToggle(selectedSong);
                        }
                      }}
                      className="px-6 py-3 bg-sorside-red hover:bg-red-700 text-white text-xs font-mono uppercase tracking-widest rounded-lg transition-all shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      {(() => {
                        const isMainPlaying = isAudioPlaying && currentSong?.id === selectedSong.id && 
                          (!selectedSong.tracks || selectedSong.tracks.length === 0 || (currentTrack && currentTrack.id === (activeTrack?.id || selectedSong.tracks[0].id)));
                        
                        return isMainPlaying ? (
                          <>
                            <Pause size={12} fill="currentColor" />
                            <span>Pause</span>
                          </>
                        ) : (
                          <>
                            <Play size={12} fill="currentColor" className="ml-0.5" />
                            <span>Play</span>
                          </>
                        );
                      })()}
                    </button>

                    <a
                      href={selectedSong.spotifyUrl || "https://open.spotify.com"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-5 py-3 rounded-lg border text-xs font-mono transition-colors flex items-center gap-2 cursor-pointer ${
                        theme === "dark" 
                          ? "border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900" 
                          : "border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                      }`}
                      title={`Dengarkan ${selectedSong.title} di Spotify`}
                    >
                      <Radio size={12} />
                      <span>Spotify</span>
                      <ExternalLink size={10} />
                    </a>
                  </div>
                </div>

              </div>
            </section>

            {/* Content: About, Lyrics, Credits, Journals */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Left Column: About & Lyrics */}
              <div className="lg:col-span-8 space-y-12">
                
                {/* Track List Section */}
                {selectedSong.tracks && selectedSong.tracks.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Disc size={18} className="text-sorside-red animate-spin-slow" />
                      <h3 className={`text-xl font-serif font-semibold ${theme === "dark" ? "text-white" : "text-stone-900"}`}>
                        Daftar Trek / Track List
                      </h3>
                    </div>
                    <div className={`border rounded-2xl overflow-hidden divide-y ${
                      theme === "dark" 
                        ? "bg-zinc-950/20 border-zinc-900 divide-zinc-900" 
                        : "bg-white border-stone-200 divide-stone-200 shadow-sm"
                    }`}>
                      {selectedSong.tracks.map((track) => {
                        const isTrackPlaying = isAudioPlaying && currentSong?.id === selectedSong.id && currentTrack?.id === track.id;
                        const isTrackViewed = activeTrack?.id === track.id;
                        
                        return (
                          <div 
                            key={track.id}
                            className={`p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group ${
                              isTrackViewed 
                                ? theme === "dark" ? "bg-zinc-900/40" : "bg-stone-100/50"
                                : theme === "dark" ? "hover:bg-zinc-900/10" : "hover:bg-stone-50"
                            }`}
                            onClick={() => setActiveTrack(track)}
                          >
                            <div className="flex items-center gap-3">
                              {/* Track Play/Pause Icon Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isTrackPlaying) {
                                    onPauseSong();
                                  } else {
                                    onPlaySong(selectedSong, track);
                                    setActiveTrack(track);
                                  }
                                }}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                  isTrackPlaying
                                    ? "bg-sorside-red text-white"
                                    : "bg-stone-500/10 text-stone-400 group-hover:bg-sorside-red group-hover:text-white"
                                }`}
                              >
                                {isTrackPlaying ? (
                                  <Pause size={10} fill="currentColor" />
                                ) : (
                                  <Play size={10} fill="currentColor" className="ml-0.5" />
                                )}
                              </button>

                              <div className="text-left">
                                <h4 className={`text-sm font-serif font-bold ${
                                  isTrackPlaying ? "text-sorside-red" : theme === "dark" ? "text-zinc-200" : "text-stone-900"
                                }`}>
                                  {track.title}
                                </h4>
                                {track.story && (
                                  <p className="text-[11px] font-sans font-light text-stone-500 max-w-md line-clamp-1">
                                    {track.story}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-4 self-end sm:self-auto">
                              {isTrackPlaying && (
                                <div className="flex items-center gap-1">
                                  <span className="text-[9px] font-mono tracking-widest text-sorside-red uppercase font-semibold">
                                    BERDENDANG
                                  </span>
                                  {/* Wave mini anim */}
                                  <div className="h-3 flex items-end gap-[2px] w-4">
                                    <span className="w-[2px] bg-sorside-red rounded-t animate-pulse" style={{ height: "40%" }} />
                                    <span className="w-[2px] bg-sorside-red rounded-t animate-pulse" style={{ height: "80%", animationDelay: "0.1s" }} />
                                    <span className="w-[2px] bg-sorside-red rounded-t animate-pulse" style={{ height: "60%", animationDelay: "0.2s" }} />
                                  </div>
                                </div>
                              )}
                              <span className="text-xs font-mono text-stone-500">
                                {track.duration}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* About Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Disc size={16} className="text-sorside-red" />
                    <h3 className={`text-xl font-serif font-semibold ${theme === "dark" ? "text-white" : "text-stone-900"}`}>
                      {selectedSong.tracks && selectedSong.tracks.length > 0 ? "Tentang Rilisan Ini" : "Tentang Lagu Ini"}
                    </h3>
                  </div>
                  <p className={`font-serif text-sm md:text-base leading-relaxed tracking-wide ${
                    theme === "dark" ? "text-gray-300" : "text-stone-700"
                  }`}>
                    {selectedSong.about}
                  </p>
                </div>

                {/* Track Details Section */}
                {activeTrack && selectedSong.tracks && selectedSong.tracks.length > 0 && (
                  <div className={`p-5 rounded-2xl border border-dashed space-y-3 ${
                    theme === "dark"
                      ? "bg-zinc-950/40 border-sorside-red/20"
                      : "bg-stone-50 border-sorside-red/20 shadow-sm"
                  }`}>
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-sorside-red" />
                      <h3 className={`text-sm font-mono uppercase tracking-wider font-bold ${
                        theme === "dark" ? "text-zinc-200" : "text-stone-800"
                      }`}>
                        Tentang Trek: {activeTrack.title.replace(/^\d+\.\s*/, '')}
                      </h3>
                    </div>
                     <div className="prose prose-stone dark:prose-invert max-w-none">
                      <MarkdownRenderer content={activeTrack.story || "Trek instrumental tanpa catatan rilis tambahan."} theme={theme} />
                    </div>
                  </div>
                )}

                {/* Lyrics Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Mic size={16} className="text-sorside-red" />
                    <h3 className={`text-xl font-serif font-semibold ${theme === "dark" ? "text-white" : "text-stone-900"}`}>
                      {activeTrack ? `Lirik / Catatan: ${activeTrack.title.replace(/^\d+\.\s*/, '')}` : "Lirik"}
                    </h3>
                  </div>
                  <div className={`p-6 md:p-8 rounded-2xl border font-serif whitespace-pre-line leading-relaxed tracking-wide text-sm md:text-base bg-opacity-30 ${
                    theme === "dark" 
                      ? "bg-zinc-950/60 border-zinc-900 text-gray-200" 
                      : "bg-stone-50 border-stone-200 text-stone-800 shadow-sm"
                  }`}>
                    {activeTrack ? (activeTrack.lyrics || "[Trek Instrumental - Tanpa Lirik]") : selectedSong.lyrics}
                  </div>
                </div>

              </div>

              {/* Right Column: Credits & Related Journal */}
              <div className="lg:col-span-4 space-y-8">
                
                {/* Credits Card */}
                <div className={`p-6 rounded-2xl border space-y-6 ${
                  theme === "dark" ? "bg-zinc-950/30 border-zinc-900/80" : "bg-white border-stone-200/80 shadow-sm"
                }`}>
                  <h4 className={`text-xs font-mono uppercase tracking-[0.2em] text-sorside-red font-bold`}>
                    KREDIT LAGU
                  </h4>

                  <div className="space-y-4 font-mono text-xs">
                    <div className="space-y-1 border-b border-stone-500/5 pb-2">
                      <span className="text-stone-500 uppercase text-[9px] tracking-wider">Ditulis Oleh</span>
                      <p className={theme === "dark" ? "text-gray-200" : "text-stone-950"}>
                        {selectedSong.credits.writtenBy}
                      </p>
                    </div>

                    <div className="space-y-1 border-b border-stone-500/5 pb-2">
                      <span className="text-stone-500 uppercase text-[9px] tracking-wider">Diproduseri Oleh</span>
                      <p className={theme === "dark" ? "text-gray-200" : "text-stone-950"}>
                        {selectedSong.credits.producedBy}
                      </p>
                    </div>

                    <div className="space-y-1 border-b border-stone-500/5 pb-2">
                      <span className="text-stone-500 uppercase text-[9px] tracking-wider">Direkam Di</span>
                      <p className={theme === "dark" ? "text-gray-200" : "text-stone-950"}>
                        {selectedSong.credits.recordedAt}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-stone-500 uppercase text-[9px] tracking-wider">Tanggal Rilis</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Calendar size={10} className="text-sorside-red" />
                        <p className={theme === "dark" ? "text-gray-200" : "text-stone-950"}>
                          {selectedSong.credits.releasedDate}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Related Journal Card */}
                <div className={`p-6 rounded-2xl border space-y-4 ${
                  theme === "dark" ? "bg-zinc-950/30 border-zinc-900/80 animate-pulse-slow" : "bg-stone-50/50 border-stone-200"
                }`}>
                  <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-sorside-red font-bold">
                    Jurnal Terkait
                  </span>
                  
                  <div className="space-y-3">
                    <h5 className={`text-sm font-serif font-semibold leading-snug ${theme === "dark" ? "text-white" : "text-stone-900"}`}>
                      {selectedSong.relatedJournal}
                    </h5>
                    <p className="text-[11px] text-stone-500 leading-normal">
                      Baca catatan harian dibalik layar lagu ini di halaman The Side untuk memahami emosi terdalamnya.
                    </p>
                    <button
                      onClick={() => onOpenJournal(selectedSong.relatedJournal)}
                      className="text-[10px] font-mono uppercase tracking-widest text-sorside-red font-bold hover:underline flex items-center gap-1 cursor-pointer pt-1"
                    >
                      <span>Baca Jurnal</span>
                      <ChevronRight size={10} />
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
