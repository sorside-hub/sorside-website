/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  ArrowRight,
  X,
  Instagram,
  Youtube,
  BookOpen,
  Sparkles,
  Compass,
  Music,
  User,
  GitBranch,
  Mail,
  Heart,
  ChevronRight,
  Menu,
  Radio,
  ExternalLink,
  ShieldCheck,
  SkipBack,
  SkipForward,
  Video,
  VideoOff
} from "lucide-react";

// Generated image assets from image-generation skill
const COVER_ART_URL = "/images/music/singles/skenario_25.png";
const ARTIST_PHOTO_URL = "/images/pages/artist_bedroom.jpg";

import MusicPage from "./components/MusicPage";
import AboutPage from "./components/AboutPage";
import TheSidePage from "./components/TheSidePage";
import ContactPage from "./components/ContactPage";
import MarkdownRenderer from "./components/MarkdownRenderer";
import { Song, JournalArticle, Track, ContactMessage } from "./types";
import { SONGS_DATA } from "./data/musicData";
import { JOURNAL_DATA } from "./data/journalData";
import { 
  loadHomeConfig, 
  saveHomeConfig, 
  loadJourneyPoints, 
  saveJourneyPoints, 
  loadJournals,
  saveJournals,
  loadCategories,
  saveCategories,
  loadContactMessages,
  saveContactMessages,
  loadSongs,
  saveSongs,
  HomeConfig, 
  JourneyPoint,
  JournalCategory,
  DEFAULT_HOME_CONFIG,
  DEFAULT_JOURNEY_POINTS,
  DEFAULT_CATEGORIES
} from "./lib/homeConfig";

// Web Audio API Synthesizer for genuine cinematic atmosphere
class SorsideSynth {
  private ctx: AudioContext | null = null;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private gainNode: GainNode | null = null;
  private lfo: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;
  public isPlaying: boolean = false;

  start(freq1: number = 116.54, freq2: number = 174.61, filterFreq: number = 280) {
    if (this.isPlaying) {
      // Smooth frequency glide transition for zero-latency cross-tracks
      if (this.osc1 && this.osc2 && this.filter && this.ctx) {
        const curTime = this.ctx.currentTime;
        this.osc1.frequency.exponentialRampToValueAtTime(freq1, curTime + 1.2);
        this.osc2.frequency.exponentialRampToValueAtTime(freq2, curTime + 1.2);
        this.filter.frequency.exponentialRampToValueAtTime(filterFreq, curTime + 1.2);
      }
      return;
    }
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      
      this.ctx = new AudioCtx();
      
      // Tri oscillator
      this.osc1 = this.ctx.createOscillator();
      this.osc1.type = "triangle";
      this.osc1.frequency.setValueAtTime(freq1, this.ctx.currentTime);
      
      // Sine oscillator
      this.osc2 = this.ctx.createOscillator();
      this.osc2.type = "sine";
      this.osc2.frequency.setValueAtTime(freq2, this.ctx.currentTime);

      // Lowpass filter to ensure the sound is warm
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = "lowpass";
      this.filter.frequency.setValueAtTime(filterFreq, this.ctx.currentTime);

      // LFO for breathing effect
      this.lfo = this.ctx.createOscillator();
      this.lfo.type = "sine";
      this.lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime);

      this.lfoGain = this.ctx.createGain();
      this.lfoGain.gain.setValueAtTime(80, this.ctx.currentTime);

      // Connect LFO
      this.lfo.connect(this.lfoGain);
      this.lfoGain.connect(this.filter.frequency);

      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
      
      this.osc1.connect(this.filter);
      this.osc2.connect(this.filter);
      this.filter.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);

      this.osc1.start();
      this.osc2.start();
      this.lfo.start();

      // Soft fade-in over 2 seconds
      this.gainNode.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 2.0);
      this.isPlaying = true;
    } catch (e) {
      console.warn("Failed to initialize Sorside Ambient Synth:", e);
    }
  }

  stop() {
    if (!this.isPlaying) return;
    try {
      if (this.gainNode && this.ctx) {
        const curTime = this.ctx.currentTime;
        // Fade-out over 1 second
        this.gainNode.gain.linearRampToValueAtTime(0, curTime + 1.0);
        
        const osc1Ref = this.osc1;
        const osc2Ref = this.osc2;
        const lfoRef = this.lfo;
        const ctxRef = this.ctx;

        setTimeout(() => {
          try {
            osc1Ref?.stop();
            osc2Ref?.stop();
            lfoRef?.stop();
            ctxRef?.close();
          } catch (err) {
            // Safe teardown
          }
        }, 1100);
      }
      this.isPlaying = false;
    } catch (e) {
      console.warn("Error stopping synth:", e);
      this.isPlaying = false;
    }
  }
}

// Utility to parse YouTube video ID from URL
export function getYouTubeId(url?: string): string | null {
  if (!url) return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// Route helpers for hash synchronization
const tabToHash = (tab: "home" | "music" | "about" | "the side" | "contact" | "admin") => {
  if (tab === "the side") return "#the-side";
  if (tab === "admin") return "#dapur-sorside";
  return `#${tab}`;
};

const hashToTab = (hash: string): "home" | "music" | "about" | "the side" | "contact" | "admin" | null => {
  const partBeforeQuery = hash.split("?")[0];
  const cleaned = partBeforeQuery.replace("#", "").toLowerCase();
  if (cleaned === "home") return "home";
  if (cleaned === "music") return "music";
  if (cleaned === "about") return "about";
  if (cleaned === "the-side" || cleaned === "the_side" || cleaned === "the%20side") return "the side";
  if (cleaned === "contact") return "contact";
  if (cleaned === "dapur-sorside") return "admin";
  return null;
};

export default function App() {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [activeTab, setActiveTab] = useState<"home" | "music" | "about" | "the side" | "contact" | "admin">("home");
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [selectedJournalTitle, setSelectedJournalTitle] = useState<string | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showPlayerVideo, setShowPlayerVideo] = useState<boolean>(false);
  const [activeDrawer, setActiveDrawer] = useState<"story" | "featured" | "journey" | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [activeJournalId, setActiveJournalId] = useState<string | null>(null);
  const [activeReleaseId, setActiveReleaseId] = useState<string | null>(null);

  // Live homepage configuration & journey points
  const [homeConfig, setHomeConfig] = useState<HomeConfig>(DEFAULT_HOME_CONFIG);
  const [journeyPoints, setJourneyPoints] = useState<JourneyPoint[]>([]);
  const [journals, setJournals] = useState<JournalArticle[]>([]);
  const [categories, setCategories] = useState<JournalCategory[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [isConfigLoaded, setIsConfigLoaded] = useState<boolean>(false);

  // Load configurations on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [config, points, loadedJournals, loadedCategories, loadedMessages, loadedSongs] = await Promise.all([
          loadHomeConfig(),
          loadJourneyPoints(),
          loadJournals(),
          loadCategories(),
          loadContactMessages(),
          loadSongs()
        ]);
        setHomeConfig(config);
        setJourneyPoints(points || []);
        setContactMessages(loadedMessages || []);
        
        setJournals(loadedJournals || []);
        setCategories(loadedCategories || []);
        setSongs(loadedSongs || []);
      } catch (err) {
        console.error("Error loading sorside homepage config:", err);
      } finally {
        setIsConfigLoaded(true);
      }
    }
    loadData();
  }, []);

  // Dynamic Title & Description for SEO / Social Sharing
  useEffect(() => {
    let title = "Sorside";
    let desc = "Sisi lain dari sorside. Menjelajahi batin, sisa-sisa malam, cerita, dan rilisan musik indie cinematic.";
    
    switch (activeTab) {
      case "home":
        title = "Sorside — Sisi Lain & Rilisan Musik";
        desc = homeConfig?.descriptionDetail || "Rilisan musik, cerita batin, dan sisa-sisa malam di balik sorside.";
        break;
      case "music":
        title = "Rilisan Musik — Sorside";
        desc = "Dengarkan trek sinematik, album, dan narasi instrumental sorside.";
        break;
      case "about":
        title = "Tentang Sorside (About)";
        desc = homeConfig?.aboutSection1Text1 || "Kisah perjalanan, eksplorasi audio, dan manifesto artistik sorside.";
        break;
      case "the side":
        title = "The Side — Jurnal & Catatan Batin Sorside";
        desc = "Kumpulan coretan, dokumentasi lagu, dan pemikiran sorside di sela rutinitas.";
        break;
      case "contact":
        title = "Hubungi Sorside (Contact)";
        desc = "Mari terhubung, berkolaborasi, atau sekadar berbagi cerita.";
        break;
      case "admin":
        title = "Dapur Sorside (Admin)";
        desc = "Sistem manajemen konten dan rilisan sorside.";
        break;
    }
    
    document.title = title;
    
    // Update or create meta description dynamically
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', desc);

    // Update Open Graph tags for beautiful social previews
    const ogTags = {
      'og:title': title,
      'og:description': desc,
      'og:type': 'website',
      'og:url': window.location.href,
      'og:image': '/images/pages/artist_bedroom.jpg'
    };

    Object.entries(ogTags).forEach(([property, content]) => {
      let element = document.querySelector(`meta[property="${property}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', property);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    });
  }, [activeTab, homeConfig]);

  // Compute dynamic latest release song and featured side article
  const latestRelease = songs.find(s => s.id === homeConfig.latestReleaseSongId) || songs[0];

  const getFeaturedSideContent = () => {
    const source = homeConfig.fromTheSideSource;
    if (source === "custom") {
      return {
        title: homeConfig.fromTheSideTitleCustom || "Cerita Pilihan",
        content: homeConfig.fromTheSideTextCustom || "Isi cerita custom...",
        category: "CUSTOM // FEATURED",
        date: "SORSIDE"
      };
    }
    
    if (source.startsWith("journal_")) {
      const journalId = source.replace("journal_", "");
      const matched = journals.find(j => j.id === journalId);
      if (matched) {
        return {
          title: matched.title,
          content: matched.summary || matched.content,
          category: `${matched.categoryLabel.toUpperCase()}`,
          date: matched.date
        };
      }
    }

    if (source.startsWith("about_")) {
      const aboutKey = source.replace("about_", "");
      if (aboutKey === "apa_itu") {
        return {
          title: "Apa itu sorside?",
          content: "sorside bukanlah sekadar proyek musik komersial yang mengejar tangga lagu populer atau algoritma streaming. Ia lahir sebagai ruang pelarian mandiri—sebuah suaka batiniah di mana emosi yang tersumbat...",
          category: "ABOUT // VISI",
          date: "ARSIP"
        };
      }
      if (aboutKey === "kenapa_nama") {
        return {
          title: "Kenapa bernama 'sorside'?",
          content: "Nama sorside adalah hibrida emosional. Ia memadukan kata 'sor'—yang diambil dari bahasa lokal yang merepresentasikan rasa suka mendalam, ketertarikan, atau frekuensi batin—dengan kata bahasa Inggris 'side'.",
          category: "ABOUT // ARTI",
          date: "ARSIP"
        };
      }
      if (aboutKey === "visi") {
        return {
          title: "Visi Kami",
          content: "Visi artistik sorside tidak diukur dengan angka statistik, jumlah pengikut media sosial, atau target komersialitas industri. Visi proyek ini adalah membangun jembatan empati melalui suara.",
          category: "ABOUT // FILOSOFI",
          date: "ARSIP"
        };
      }
      if (aboutKey === "karakter") {
        return {
          title: "Karakter Suara",
          content: "Lanskap musikal sorside berada di persimpangan Atmospheric Alternative Rock, Cinematic Shoegaze, dan sentuhan hangat Bedroom Pop. Karakter suaranya ditandai oleh deep ambient synths dan raw acoustic guitars.",
          category: "ABOUT // ESTETIKA",
          date: "ARSIP"
        };
      }
      if (aboutKey === "di_balik") {
        return {
          title: "Di Balik sorside",
          content: "Proyek ini diinisiasi dan dijalankan sepenuhnya oleh seorang kreator independen yang menetap di Surabaya. Lahir dari kebutuhan mutlak untuk tetap waras di tengah tuntutan hidup yang mekanis.",
          category: "ABOUT // KREATOR",
          date: "ARSIP"
        };
      }
    }

    return {
      title: "Kenapa aku masih membuat musik setelah pulang kerja?",
      content: "Pukul 5 sore. Pekerjaan kantor selesai, tapi hidup yang sesungguhnya baru saja dimulai. Di sela-sela rasa lelah yang menggerogoti fisik...",
      category: "01 // JOURNAL ENTRY",
      date: "Juli 2025"
    };
  };

  const featuredSide = getFeaturedSideContent();
  
  // Custom upcoming page overlay message state
  const [comingSoonMessage, setComingSoonMessage] = useState<{
    title: string;
    description: string;
    quote: string;
  } | null>(null);

  const synthRef = useRef<SorsideSynth | null>(null);
  const progressIntervalRef = useRef<any>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Synchronize route hash on load and back/forward browser navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const path = window.location.pathname;
      const search = window.location.search;

      if (
        path.toLowerCase().includes("dapur-sorside") ||
        search.toLowerCase().includes("dapur-sorside") ||
        hash.toLowerCase().includes("dapur-sorside")
      ) {
        setActiveTab("admin");
        return;
      }

      const tab = hashToTab(hash);
      if (tab) {
        setActiveTab(tab);
        
        const queryPart = hash.split("?")[1] || "";
        const params = new URLSearchParams(queryPart);

        if (tab === "the side") {
          const journalId = params.get("journal") || params.get("jurnal");
          setActiveJournalId(journalId);
        } else {
          setActiveJournalId(null);
        }

        if (tab === "music") {
          const releaseId = params.get("release") || params.get("song");
          setActiveReleaseId(releaseId);
        } else {
          setActiveReleaseId(null);
        }
      } else if (!hash) {
        setActiveTab("home");
        setActiveJournalId(null);
        setActiveReleaseId(null);
      }
    };

    // Initialize state from URL hash on mount
    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handleHashChange);
    };
  }, []);

  // Dynamically update document/browser tab title based on active tab
  useEffect(() => {
    document.title = `sorside-${activeTab}`;
  }, [activeTab]);

  // Synchronize YouTube Iframe Playback (Play/Pause)
  useEffect(() => {
    const sendPlaybackCommand = () => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        const command = isAudioPlaying ? "playVideo" : "pauseVideo";
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: "command", func: command, args: "" }),
          "*"
        );
      }
    };

    // Send command immediately
    sendPlaybackCommand();

    // Send after delay to ensure iframe is fully loaded and can receive JS API commands
    const timer1 = setTimeout(sendPlaybackCommand, 500);
    const timer2 = setTimeout(sendPlaybackCommand, 1200);
    const timer3 = setTimeout(sendPlaybackCommand, 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isAudioPlaying, currentSong, currentTrack]);

  // Synchronize YouTube Iframe Mute State
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const command = isMuted ? "mute" : "unMute";
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: "command", func: command, args: "" }),
        "*"
      );
    }
  }, [isMuted, currentSong, currentTrack]);

  // Initialize synth class
  useEffect(() => {
    synthRef.current = new SorsideSynth();
    return () => {
      if (synthRef.current) {
        synthRef.current.stop();
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // Theme effect (add dark or light style class for smooth transitions)
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  // Audio simulation player logic with dynamic frequencies
  useEffect(() => {
    if (isAudioPlaying) {
      // Only trigger the custom ambient synthesizer when on the Home page (Demo Soundscape)
      const isSoundscapeDemo = activeTab === "home";
      if (synthRef.current && !isMuted && isSoundscapeDemo) {
        const f1 = currentTrack?.freq1 ?? currentSong?.freq1 ?? 116.54;
        const f2 = currentTrack?.freq2 ?? currentSong?.freq2 ?? 174.61;
        const filterFreq = currentTrack?.filterFreq ?? currentSong?.filterFreq ?? 280;
        synthRef.current.start(f1, f2, filterFreq);
      }
      progressIntervalRef.current = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            handlePauseAudio();
            return 0;
          }
          return prev + 0.4; // Slowly increment progress
        });
      }, 200);
    } else {
      if (synthRef.current) {
        synthRef.current.stop();
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isAudioPlaying, isMuted, currentSong, currentTrack, activeTab]);

  const handlePlayAudio = () => {
    setIsAudioPlaying(true);
  };

  const handlePauseAudio = () => {
    setIsAudioPlaying(false);
  };

  const handlePlayLatestRelease = () => {
    if (!latestRelease) return;
    if (currentSong?.id !== latestRelease.id) {
      setCurrentSong(latestRelease);
      if (latestRelease.tracks && latestRelease.tracks.length > 0) {
        setCurrentTrack(latestRelease.tracks[0]);
      } else {
        setCurrentTrack(null);
      }
      setIsAudioPlaying(true);
    } else {
      if (isAudioPlaying) {
        setIsAudioPlaying(false);
      } else {
        setIsAudioPlaying(true);
      }
    }
  };

  const handleToggleMute = () => {
    if (!isMuted) {
      setIsMuted(true);
      if (synthRef.current) {
        synthRef.current.stop();
      }
    } else {
      setIsMuted(false);
      if (isAudioPlaying && synthRef.current) {
        const f1 = currentTrack?.freq1 ?? currentSong?.freq1 ?? 116.54;
        const f2 = currentTrack?.freq2 ?? currentSong?.freq2 ?? 174.61;
        const filterFreq = currentTrack?.filterFreq ?? currentSong?.filterFreq ?? 280;
        synthRef.current.start(f1, f2, filterFreq);
      }
    }
  };

  const handleNext = () => {
    if (!currentSong) return;
    
    // If the current song has tracks, try to advance to the next track
    if (currentSong.tracks && currentSong.tracks.length > 0) {
      const currentIndex = currentTrack 
        ? currentSong.tracks.findIndex(t => t.id === currentTrack.id) 
        : -1;
        
      if (currentIndex < currentSong.tracks.length - 1) {
        setCurrentTrack(currentSong.tracks[currentIndex + 1]);
        setIsAudioPlaying(true);
        return;
      }
    }
    
    // Otherwise, go to the next song in songs
    const songsList = songs;
    if (songsList.length === 0) return;
    const currentSongIndex = songsList.findIndex(s => s.id === currentSong.id);
    const nextSongIndex = (currentSongIndex + 1) % songsList.length;
    const nextSong = songsList[nextSongIndex];
    
    setCurrentSong(nextSong);
    if (nextSong.tracks && nextSong.tracks.length > 0) {
      setCurrentTrack(nextSong.tracks[0]);
    } else {
      setCurrentTrack(null);
    }
    setIsAudioPlaying(true);
  };

  const handlePrev = () => {
    if (!currentSong) return;
    
    // If the current song has tracks, try to go to the previous track
    if (currentSong.tracks && currentSong.tracks.length > 0 && currentTrack) {
      const currentIndex = currentSong.tracks.findIndex(t => t.id === currentTrack.id);
      if (currentIndex > 0) {
        setCurrentTrack(currentSong.tracks[currentIndex - 1]);
        setIsAudioPlaying(true);
        return;
      }
    }
    
    // Otherwise, go to the previous song in songs
    const songsList = songs;
    if (songsList.length === 0) return;
    const currentSongIndex = songsList.findIndex(s => s.id === currentSong.id);
    const prevSongIndex = (currentSongIndex - 1 + songsList.length) % songsList.length;
    const prevSong = songsList[prevSongIndex];
    
    setCurrentSong(prevSong);
    if (prevSong.tracks && prevSong.tracks.length > 0) {
      setCurrentTrack(prevSong.tracks[prevSong.tracks.length - 1]);
    } else {
      setCurrentTrack(null);
    }
    setIsAudioPlaying(true);
  };

  // Convert progress bar percentage to simulated time format (total 3:45)
  const getSimulatedTime = (progressPercent: number) => {
    const totalSeconds = 225; // 3 minutes 45 seconds
    const currentSeconds = Math.floor((progressPercent / 100) * totalSeconds);
    const mins = Math.floor(currentSeconds / 60);
    const secs = currentSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle clicking navigation tabs
  const handleTabClick = (tab: "home" | "music" | "about" | "the side" | "contact" | "admin") => {
    window.location.hash = tabToHash(tab);
    setActiveTab(tab); // Set state immediately for smooth UI transition
    setComingSoonMessage(null);
    setIsMobileMenuOpen(false);
  };

  // Scroll smooth helper for homepage buttons
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      id="sorside-app"
      className={`min-h-screen relative font-sans transition-colors duration-1000 overflow-x-hidden ${
        theme === "dark"
          ? "bg-charcoal-dark text-gray-200"
          : "bg-linen-light text-stone-800"
      }`}
    >
      {/* Animated Film Grain Overlay */}
      <div className={`noise-bg ${theme === "light" ? "noise-bg-light" : ""}`} />

      {/* Atmospheric Glowing Light Accents */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-sorside-red/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[60vh] left-0 w-[35vw] h-[35vw] bg-sorside-red/5 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* HEADER NAVIGATION */}
      {activeTab !== "admin" && (
        <header className={`fixed top-0 left-0 right-0 z-40 backdrop-blur-md border-b transition-all duration-500 border-sorside-red/10 px-4 py-3 md:px-12 md:py-4 ${
          theme === "dark" ? "bg-charcoal-dark/85" : "bg-linen-light/85"
        }`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            
            {/* Logo SORSIDE */}
            <button
              onClick={() => handleTabClick("home")}
              className="flex items-center space-x-1 group cursor-pointer"
              id="brand-logo"
            >
              <span className={`text-2xl font-bold font-dashley transition-colors duration-500 ${theme === "dark" ? "text-white" : "text-stone-900"}`}>
                sor
              </span>
              <span className="text-2xl font-bold font-dashley text-sorside-red transform group-hover:scale-105 transition-transform">
                side
              </span>
              <span className="w-1.5 h-1.5 bg-sorside-red rounded-full self-end mb-1 ml-0.5 animate-pulse" />
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8 text-xs font-mono tracking-widest uppercase">
              {(["home", "music", "about", "the side", "contact"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`transition-all duration-300 relative py-1 px-2 cursor-pointer ${
                    activeTab === tab
                      ? "text-sorside-red font-semibold"
                      : theme === "dark"
                      ? "text-gray-400 hover:text-white"
                      : "text-stone-500 hover:text-stone-950"
                  }`}
                  id={`nav-${tab.replace(" ", "-")}`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.span
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-sorside-red"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </nav>

            {/* Right Header Actions: Theme & Status */}
            <div className="flex items-center space-x-2 md:space-x-4">
              
              {/* Theme Toggle Button */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={`p-2.5 rounded-full border transition-all duration-300 cursor-pointer ${
                  theme === "dark"
                    ? "border-zinc-800 text-yellow-400 hover:bg-zinc-900 hover:text-yellow-300 glow-red"
                    : "border-stone-200 text-stone-600 hover:bg-stone-100 hover:text-stone-950"
                }`}
                title={theme === "dark" ? "Switch to Hopeful Light Mode" : "Switch to Cinematic Dark Mode"}
                id="theme-toggle-btn"
              >
                {theme === "dark" ? (
                  <Sun size={15} className="animate-spin-slow" />
                ) : (
                  <Moon size={15} />
                )}
              </button>
              
              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`md:hidden p-2.5 rounded-full border transition-all duration-300 cursor-pointer ${
                  theme === "dark"
                    ? "border-zinc-800 text-gray-300 hover:bg-zinc-900"
                    : "border-stone-200 text-stone-600 hover:bg-stone-100"
                }`}
                title="Menu"
                id="mobile-menu-toggle-btn"
              >
                {isMobileMenuOpen ? (
                  <X size={15} />
                ) : (
                  <Menu size={15} />
                )}
              </button>
              
              {/* Live Visualizer Status (If audio playing) */}
              <AnimatePresence>
                {isAudioPlaying && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="hidden sm:flex items-center space-x-2 bg-sorside-red/10 border border-sorside-red/20 px-3 py-1 rounded-full text-[10px] font-mono tracking-widest text-sorside-red"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-sorside-red animate-ping" />
                    <span>PLAYING</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Dropdown Navigation */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="md:hidden overflow-hidden border-t border-sorside-red/10 mt-3 pt-3"
                id="mobile-menu-container"
              >
                <nav className="flex flex-col space-y-3 py-2 font-mono text-xs tracking-widest uppercase">
                  {(["home", "music", "about", "the side", "contact"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => handleTabClick(tab)}
                      className={`transition-all duration-300 py-2 px-3 rounded text-left cursor-pointer ${
                        activeTab === tab
                          ? "text-sorside-red font-bold bg-sorside-red/5"
                          : theme === "dark"
                          ? "text-gray-400 hover:text-white"
                          : "text-stone-500 hover:text-stone-950"
                      }`}
                      id={`mobile-nav-${tab.replace(" ", "-")}`}
                    >
                      <span className="flex items-center justify-between">
                        <span>{tab}</span>
                        {activeTab === tab && <span className="w-1.5 h-1.5 bg-sorside-red rounded-full animate-pulse" />}
                      </span>
                    </button>
                  ))}
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </header>
      )}

      {/* MAIN LAYOUT GATEWAY */}
      <main className={`relative z-10 max-w-7xl mx-auto px-6 pb-8 md:px-12 md:pb-16 ${activeTab === "admin" ? "pt-10 md:pt-12" : "pt-24 md:pt-32"}`} id="main-content-gateway">
        
        {/* COMING SOON ATMOSPHERIC OVERLAY (If non-home page selected) */}
        <AnimatePresence mode="wait">
          {comingSoonMessage && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="min-h-[60vh] flex flex-col justify-center items-center text-center max-w-2xl mx-auto py-12"
              id="coming-soon-panel"
            >
              <div className="w-12 h-12 rounded-full border border-sorside-red/30 flex items-center justify-center mb-6 text-sorside-red glow-red-strong">
                {activeTab === "music" && <Music size={18} />}
                {activeTab === "about" && <User size={18} />}
                {activeTab === "the side" && <GitBranch size={18} />}
                {activeTab === "contact" && <Mail size={18} />}
              </div>
              
              <span className="text-xs font-mono tracking-[0.25em] text-sorside-red uppercase mb-3">
                {comingSoonMessage.title}
              </span>
              
              <h2 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight uppercase mb-6">
                Sisi ini sedang bersiap...
              </h2>
              
              <p className={`text-sm leading-relaxed mb-8 ${theme === "dark" ? "text-gray-400" : "text-stone-600"}`}>
                {comingSoonMessage.description}
              </p>

              <div className={`p-6 border-l border-sorside-red bg-opacity-30 rounded-r-xl max-w-lg mb-10 ${
                theme === "dark" ? "bg-zinc-900/50" : "bg-stone-100"
              }`}>
                <p className="font-serif text-base leading-relaxed text-sorside-red">
                  {comingSoonMessage.quote}
                </p>
                <p className="text-[10px] font-mono tracking-widest text-right mt-2 text-stone-500">
                  — SORSIDE
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => handleTabClick("home")}
                  className="px-6 py-2.5 bg-sorside-red text-white text-xs font-mono uppercase tracking-widest hover:bg-red-700 transition-all rounded shadow-lg flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Kembali ke Sisi Utama</span>
                  <ArrowRight size={12} className="transform group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className={`px-6 py-2.5 text-xs font-mono uppercase tracking-widest border transition-all rounded flex items-center justify-center gap-2 cursor-pointer ${
                    theme === "dark"
                      ? "border-zinc-800 text-gray-300 hover:bg-zinc-900"
                      : "border-stone-300 text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  <Sparkles size={12} />
                  <span>Lihat Refleksi Lain</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HOME PAGE SORSIDE */}
        {activeTab === "home" && (
          <div id="home-view" className="space-y-24 md:space-y-36">
            
            {/* HERO SECTION */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[70vh] relative z-10" id="hero-section">
              
              {/* Left Column (Hero copy and CTAs) */}
              <div className="lg:col-span-7 flex flex-col justify-center space-y-8 order-2 lg:order-1">
                <div className="space-y-4">
                  
                  <h1 className="text-6xl md:text-8xl font-black tracking-tighter">
                    <span className={`font-dashley ${theme === "dark" ? "text-white" : "text-stone-900"}`}>sor</span>
                    <span className="text-sorside-red font-dashley">side</span>
                  </h1>
                  
                  <p className="text-base md:text-xl font-serif italic text-sorside-red leading-relaxed tracking-wide max-w-lg">
                    &ldquo;{homeConfig.descriptionQuote === "Suara dari sisi yang masih bertahan." ? "Setiap orang punya sisi lain. Sisi yang hadir ketika dunia mulai sunyi" : homeConfig.descriptionQuote}&rdquo;
                  </p>
                </div>

                <p className="text-xs font-mono text-stone-500 max-w-sm pt-2 leading-relaxed">
                  {homeConfig.descriptionDetail}
                </p>

                {/* Call To Actions */}
                <div className="flex flex-wrap gap-4 pt-4">
                  <button
                    onClick={() => scrollToSection("what-is-sorside")}
                    className="px-6 py-3 bg-sorside-red text-white text-xs font-mono uppercase tracking-widest hover:bg-red-700 transition-all rounded shadow-md flex items-center gap-2 group cursor-pointer"
                    id="btn-explore"
                  >
                    <Compass size={13} />
                    <span>Jelajahi sorside</span>
                    <ArrowRight size={12} className="transform group-hover:translate-x-1 transition-transform" />
                  </button>
                  
                  <button
                    onClick={() => scrollToSection("latest-release")}
                    className={`px-6 py-3 text-xs font-mono uppercase tracking-widest border transition-all rounded flex items-center gap-2 cursor-pointer ${
                      theme === "dark"
                        ? "border-zinc-800 text-gray-300 hover:bg-zinc-900/80 hover:text-white"
                        : "border-stone-300 text-stone-700 hover:bg-stone-50"
                    }`}
                    id="btn-listen-latest"
                  >
                    <Music size={13} />
                    <span>Dengar Rilisan Terbaru</span>
                  </button>
                </div>

                {/* Ambient Status Subtitle */}
                <div className="pt-6 flex items-center space-x-6 text-[10px] font-mono tracking-wider text-stone-500">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 bg-sorside-red rounded-full animate-pulse" />
                    <span>Est. 2025</span>
                  </div>
                  <div>•</div>
                  <div>Surabaya, ID</div>
                </div>
              </div>

              {/* Right Column (Hero Visual Artwork) */}
              <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center">
                <div className="relative w-full max-w-sm md:max-w-md aspect-[3/4] group">
                  
                  {/* Decorative glowing red outline behind the image */}
                  <div className="absolute inset-0 border border-sorside-red/30 rounded-2xl transform translate-x-4 translate-y-4 transition-transform group-hover:translate-x-2 group-hover:translate-y-2 pointer-events-none z-0" />
                  
                  {/* Glowing back-shadow light effect */}
                  <div className="absolute -inset-1.5 bg-gradient-to-t from-sorside-red/20 to-transparent rounded-2xl blur-xl opacity-80 pointer-events-none z-0" />
                  
                  {/* Main Portrait Frame with film grain texture */}
                  <div className={`relative w-full h-full overflow-hidden rounded-2xl border transition-all duration-700 glow-red ${
                    theme === "dark" ? "border-zinc-800 bg-zinc-950" : "border-stone-200 bg-stone-100"
                  }`}>
                    <img
                      src={homeConfig.posterImageUrl}
                      alt="Artistic sorside portrait silhouette with moody lighting"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 transition-all duration-1000 scale-102 hover:scale-105"
                      id="hero-artist-img"
                    />
                    
                    {/* Artistic red color grading filter overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-dark/90 via-sorside-red/10 to-transparent mix-blend-multiply opacity-60 pointer-events-none" />
                    
                    {/* Floating quote details */}
                    <div className="absolute bottom-6 left-6 right-6 text-left space-y-1 bg-charcoal-dark/70 backdrop-blur-sm p-4 rounded-lg border border-sorside-red/20">
                      <p className="text-[10px] font-mono tracking-widest text-sorside-red uppercase font-semibold">
                        {homeConfig.posterLabel}
                      </p>
                      <p className="text-xs font-serif text-white/95 leading-normal">
                        &ldquo;{homeConfig.posterQuote}&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </section>

            {/* LATEST RELEASE SECTION */}
            {latestRelease && (
              <section className="scroll-mt-24 py-12 border-y border-sorside-red/10 relative" id="latest-release">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  
                  {/* Left: Cover Art Image */}
                  <div className="lg:col-span-5 flex justify-center">
                    <div className="relative w-72 md:w-80 aspect-square group">
                      <div className="absolute inset-0 bg-sorside-red rounded-lg blur-lg opacity-25 group-hover:opacity-40 transition-opacity" />
                      
                      <div className={`relative w-full h-full overflow-hidden rounded-lg border-2 transition-transform duration-500 hover:scale-102 cursor-pointer ${
                        theme === "dark" ? "border-zinc-800" : "border-stone-200"
                      }`}>
                        <img
                          src={latestRelease.cover}
                          alt={`${latestRelease.title} sorside Cover Album`}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:rotate-1"
                          id="latest-release-cover"
                        />
                        {/* Dark overlay for vintage feel */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-sorside-red/15 to-transparent mix-blend-color-burn" />
                      </div>

                      <div className="absolute -bottom-3 -right-3 w-12 h-12 rounded-full bg-sorside-red text-white flex items-center justify-center shadow-lg pointer-events-none font-mono text-[9px] uppercase tracking-wider text-center font-bold">
                        {latestRelease.year}
                      </div>
                    </div>
                  </div>

                  {/* Right: Content details and mini player */}
                  <div className="lg:col-span-7 space-y-6">
                    
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono tracking-[0.25em] text-sorside-red uppercase">
                        Rilisan Terbaru
                      </span>
                      <h2 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight uppercase">
                        {latestRelease.title}
                      </h2>
                      <p className="text-xs font-mono tracking-widest text-stone-500">
                        Released: {latestRelease.credits?.releasedDate || `Juli 19, ${latestRelease.year}`} • {latestRelease.type}
                      </p>
                    </div>

                    <div className="prose prose-stone dark:prose-invert max-w-none">
                      <MarkdownRenderer content={latestRelease.story} theme={theme} />
                    </div>

                    {/* MERGED INTERACTIVE MUSIC CONTROLS */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      
                      <button
                        onClick={handlePlayLatestRelease}
                        className="px-6 py-3 bg-sorside-red hover:bg-red-700 text-white text-xs font-mono uppercase tracking-widest transition-all rounded shadow-md flex items-center gap-2 cursor-pointer group"
                        id="play-pause-btn"
                      >
                        {isAudioPlaying && currentSong?.id === latestRelease.id ? (
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
                        onClick={() => setActiveDrawer("story")}
                        className={`px-5 py-3 border text-xs font-mono uppercase tracking-widest transition-all rounded flex items-center gap-2 cursor-pointer ${
                          theme === "dark"
                            ? "bg-zinc-900 border-zinc-800 text-white hover:bg-zinc-800"
                            : "border-stone-300 text-stone-700 hover:bg-stone-50"
                        }`}
                        id="btn-read-story"
                      >
                        <BookOpen size={12} />
                        <span>Baca Cerita</span>
                      </button>

                      <a
                        href={latestRelease.spotifyUrl || "https://open.spotify.com"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`px-5 py-3 rounded border text-xs font-mono transition-colors flex items-center gap-2 cursor-pointer ${
                          theme === "dark" 
                            ? "border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900" 
                            : "border-stone-300 text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                        }`}
                        id="btn-spotify"
                      >
                        <Radio size={12} />
                        <span>Spotify</span>
                        <ExternalLink size={10} />
                      </a>

                      <button
                        onClick={() => handleTabClick("music")}
                        className={`px-5 py-3 rounded border text-xs font-mono uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer ${
                          theme === "dark"
                            ? "bg-sorside-red/10 border-sorside-red/30 text-sorside-red hover:bg-sorside-red/20"
                            : "bg-sorside-red/5 border-sorside-red/20 text-sorside-red hover:bg-sorside-red/10"
                        }`}
                        id="btn-go-to-music"
                      >
                        <Music size={12} />
                        <span>Semua Rilisan</span>
                        <ArrowRight size={12} />
                      </button>

                    </div>

                  </div>

                </div>

              </section>
            )}

            {/* WHAT IS SORSIDE SECTION */}
            <section className="scroll-mt-24 py-12 max-w-4xl mx-auto" id="what-is-sorside">
              
              <div className="text-center space-y-8">
                
                <div className="inline-flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-sorside-red" />
                  <span className="text-xs font-mono tracking-[0.25em] text-sorside-red uppercase">
                    The Manifesto
                  </span>
                </div>

                <div className="space-y-6">
                  <h3 className="text-2xl md:text-4xl font-display font-extrabold leading-snug tracking-tight uppercase">
                    {homeConfig.manifestoTitle || "sorside bukan hanya sekadar musik."}
                  </h3>
                  
                  <p className={`text-base md:text-xl font-serif leading-relaxed max-w-3xl mx-auto ${
                    theme === "dark" ? "text-gray-300" : "text-stone-700"
                  }`}>
                    &ldquo;{homeConfig.manifestoQuote || "Ini adalah sisi lain dari seseorang yang tetap mengejar mimpi setelah dunia selesai menuntut."}&rdquo;
                  </p>
                </div>

                <p className={`font-serif text-sm md:text-base leading-relaxed tracking-wide max-w-xl mx-auto ${
                  theme === "dark" ? "text-gray-400" : "text-stone-600"
                }`}>
                  {homeConfig.manifestoText || "Ketika siang hari dipakai untuk mengais materi demi memenuhi ekspektasi sosial, malam hari adalah tempat kejujuran dipulangkan. sorside lahir sebagai jurnal batin di sela-sela lelahnya rutinitas harian."}
                </p>

                <button
                  onClick={() => handleTabClick("about")}
                  className="px-6 py-3 bg-transparent border border-sorside-red text-sorside-red hover:bg-sorside-red hover:text-white text-xs font-mono uppercase tracking-widest transition-all rounded inline-flex items-center gap-2 group cursor-pointer"
                >
                  <span>Jelajahi sorside</span>
                  <ChevronRight size={12} className="transform group-hover:translate-x-1 transition-transform" />
                </button>

              </div>

            </section>

            {/* FEATURED STORY SECTION */}
            <section className="py-12 border-t border-sorside-red/10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center" id="featured-story">
              
              <div className="md:col-span-4 space-y-4">
                <span className="text-[10px] font-mono tracking-[0.25em] text-sorside-red uppercase block">
                  Jurnal Pilihan
                </span>
                <h3 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight uppercase">
                  FROM THE SIDE
                </h3>
                <p className={`text-xs leading-relaxed ${theme === "dark" ? "text-gray-400" : "text-stone-600"}`}>
                  Catatan harian, refleksi, dan liner notes dari sudut studio rekaman kamar tidur.
                </p>
              </div>

              <div className={`md:col-span-8 p-6 md:p-8 rounded-2xl border transition-all hover:border-sorside-red/30 ${
                theme === "dark" ? "bg-zinc-950/40 border-zinc-900" : "bg-white border-stone-200 shadow-sm"
              }`}>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-xs font-mono text-stone-500">
                    <span className="text-sorside-red">{featuredSide.category}</span>
                    <span>•</span>
                    <span>{featuredSide.date}</span>
                  </div>
                  
                  <h4 className={`text-xl md:text-2xl font-serif font-bold hover:text-sorside-red transition-colors cursor-pointer ${
                    theme === "dark" ? "text-white" : "text-stone-900"
                  }`} onClick={() => setActiveDrawer("featured")}>
                    {featuredSide.title}
                  </h4>

                  <p className={`font-serif text-sm leading-relaxed tracking-wide ${theme === "dark" ? "text-gray-400" : "text-stone-600"}`}>
                    {featuredSide.content.length > 250 ? `${featuredSide.content.slice(0, 250)}...` : featuredSide.content}
                  </p>

                  <button
                    onClick={() => setActiveDrawer("featured")}
                    className="text-xs font-mono uppercase tracking-widest text-sorside-red hover:underline flex items-center space-x-1.5 pt-2 group cursor-pointer"
                  >
                    <span>Baca selengkapnya</span>
                    <ArrowRight size={12} className="transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

            </section>

            {/* JOURNEY PREVIEW (TEASER) */}
            <section className="py-12 border-t border-sorside-red/10 space-y-12" id="journey-preview">
              
              <div className="text-center space-y-2">
                <span className="text-[10px] font-mono tracking-[0.25em] text-sorside-red uppercase block">
                  Kronik Perjalanan
                </span>
                <h3 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight uppercase">
                  THE JOURNEY
                </h3>
                <p className="text-xs font-mono text-stone-500 max-w-sm mx-auto">
                  Rencana babak perjalanan sorside menembus batas waktu.
                </p>
              </div>

              {/* Teaser timeline timeline */}
              <div className="max-w-3xl mx-auto relative pl-6 border-l border-sorside-red/20 space-y-12">
                {journeyPoints.filter(p => !p.isDrawerOnly).map((point, index) => (
                  <div key={point.id} className="relative">
                    {/* Bullet */}
                    <span className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-4 transition-colors ${
                      index === 0
                        ? "bg-sorside-red border-charcoal-dark glow-red-strong"
                        : theme === "dark" ? "bg-zinc-800 border-zinc-950" : "bg-stone-300 border-white"
                    }`} />
                    
                    <div className="space-y-2 text-left">
                      <span className={`text-xl font-bold font-mono ${index === 0 ? "text-sorside-red" : "text-stone-400"}`}>
                        {point.year}
                      </span>
                      <h4 className={`text-lg font-serif font-semibold ${theme === "dark" ? "text-white" : "text-stone-900"}`}>
                        {point.title}
                      </h4>
                      <p className={`text-sm leading-relaxed ${theme === "dark" ? "text-gray-400" : "text-stone-600"}`}>
                        {point.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* View Story Button */}
              <div className="text-center pt-4">
                <button
                  onClick={() => setActiveDrawer("journey")}
                  className="px-6 py-2.5 bg-transparent border border-stone-500/20 hover:border-sorside-red text-stone-500 hover:text-sorside-red text-xs font-mono uppercase tracking-widest transition-all rounded inline-flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles size={12} />
                  <span>Lihat Cerita Perjalanan Lengkap</span>
                </button>
              </div>

            </section>

          </div>
        )}

        {/* MUSIC PAGE */}
        {activeTab === "music" && (
          <MusicPage
            theme={theme}
            currentSong={currentSong}
            currentTrack={currentTrack}
            isAudioPlaying={isAudioPlaying}
            songs={songs}
            config={homeConfig}
            onPlaySong={(song, track) => {
              setCurrentSong(song);
              setCurrentTrack(track || null);
              setIsAudioPlaying(true);
            }}
            onPauseSong={() => {
              setIsAudioPlaying(false);
            }}
            onOpenJournal={(title) => {
              const matchedJournal = journals.find(
                (article) => 
                  article.title.toLowerCase().includes(title.toLowerCase()) ||
                  title.toLowerCase().includes(article.title.toLowerCase())
              );
              if (matchedJournal) {
                window.location.hash = `#the-side?journal=${matchedJournal.id}`;
              } else {
                setSelectedJournalTitle(title);
                handleTabClick("the side");
              }
            }}
            activeReleaseId={activeReleaseId}
            onSelectRelease={(id) => {
              window.location.hash = id ? "#music?release=" + id : "#music";
            }}
          />
        )}

        {/* ABOUT PAGE */}
        {activeTab === "about" && (
          <AboutPage
            theme={theme}
            onTabClick={handleTabClick}
            config={homeConfig}
          />
        )}

        {/* THE SIDE PAGE */}
        {activeTab === "the side" && (
          <TheSidePage
            theme={theme}
            currentSong={currentSong}
            isAudioPlaying={isAudioPlaying}
            onPlaySong={(songId) => {
              const matched = songs.find(s => s.id === songId);
              if (matched) {
                setCurrentSong(matched);
                setIsAudioPlaying(true);
              }
            }}
            onPauseSong={() => {
              setIsAudioPlaying(false);
            }}
            initialArticleTitle={selectedJournalTitle}
            onClearInitialArticle={() => {
              setSelectedJournalTitle(null);
            }}
            journals={journals}
            categories={categories}
            config={homeConfig}
            activeJournalId={activeJournalId}
            onSelectJournal={(id) => {
              window.location.hash = id ? "#the-side?journal=" + id : "#the-side";
            }}
          />
        )}

        {/* CONTACT PAGE */}
        {activeTab === "contact" && (
          <ContactPage
            theme={theme}
            config={homeConfig}
            onSubmitMessage={async (msg) => {
              const newMessage: ContactMessage = {
                ...msg,
                id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                timestamp: new Date().toISOString(),
                isRead: false
              };
              const updated = [newMessage, ...contactMessages];
              const success = await saveContactMessages(updated);
              if (success) {
                setContactMessages(updated);
              }
              return success;
            }}
          />
        )}

        {/* DECAP CMS GATEWAY */}
        {activeTab === "admin" && (
          <div className="max-w-2xl mx-auto py-16 px-6 text-center space-y-6">
            <div className="inline-flex p-4 rounded-2xl bg-sorside-red/10 text-sorside-red border border-sorside-red/20 mb-2">
              <ShieldCheck size={36} />
            </div>
            <h1 className="text-2xl md:text-3xl font-dashley uppercase tracking-wide">
              Decap CMS Admin Gateway
            </h1>
            <p className="text-sm font-sans text-stone-400 max-w-lg mx-auto">
              Sistem Content Management telah dialihkan sepenuhnya ke <strong className="text-white">Decap CMS (Git-Based)</strong>. Semua konten dikelola dan langsung tersimpan secara otomatis di repository GitHub Anda.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/admin/index.html"
                className="w-full sm:w-auto px-6 py-3 bg-sorside-red hover:bg-red-700 text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <span>Buka Dashboard Decap CMS (/admin/)</span>
                <ExternalLink size={14} />
              </a>
              <button
                type="button"
                onClick={() => setActiveTab("home")}
                className="w-full sm:w-auto px-6 py-3 bg-stone-800 hover:bg-stone-700 text-stone-300 font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-stone-700"
              >
                Kembali ke Beranda
              </button>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="border-t transition-colors duration-500 border-sorside-red/10 bg-transparent py-12 px-6 md:px-12 relative z-10 mt-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Footer Logo & Copyright */}
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-1">
              <span className={`text-lg font-bold font-dashley ${theme === "dark" ? "text-white" : "text-stone-900"}`}>
                sor
              </span>
              <span className="text-lg font-bold font-dashley text-sorside-red">
                side
              </span>
              <span className="w-1 h-1 bg-sorside-red rounded-full" />
            </div>
            <p className="text-[10px] font-mono tracking-wider text-stone-500">
              © 2025 sorside. Ruang kecil untuk bertahan tetap waras.
            </p>
          </div>

          {/* Socials / Links */}
          <div className="flex flex-col items-center md:items-end space-y-4">
            <div className="flex items-center flex-wrap justify-center gap-x-6 gap-y-2">
              <a
                href="https://www.instagram.com/sor.side"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-500 hover:text-sorside-red transition-colors flex items-center space-x-1.5 text-xs font-mono tracking-widest"
              >
                <Instagram size={14} />
                <span>Instagram</span>
              </a>
              <a
                href="https://www.tiktok.com/@sor.side"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-500 hover:text-sorside-red transition-colors flex items-center space-x-1.5 text-xs font-mono tracking-widest"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-3.5 h-3.5"
                >
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
                <span>TikTok</span>
              </a>
              <a
                href="https://youtube.com/@sorside"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-500 hover:text-sorside-red transition-colors flex items-center space-x-1.5 text-xs font-mono tracking-widest"
              >
                <Youtube size={14} />
                <span>YouTube</span>
              </a>
              <a
                href="https://spotify.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-500 hover:text-sorside-red transition-colors flex items-center space-x-1.5 text-xs font-mono tracking-widest"
              >
                <Music size={14} />
                <span>Spotify</span>
              </a>
            </div>
          </div>

        </div>
      </footer>

      {/* FULL STORIES DIALOG OVERLAY (DRAWER) */}
      <AnimatePresence>
        {activeDrawer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex justify-end"
          >
            {/* Click outside to close */}
            <div className="absolute inset-0" onClick={() => setActiveDrawer(null)} />

            {/* Content sheet */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`w-full max-w-lg md:max-w-xl h-full relative z-10 flex flex-col p-8 md:p-12 overflow-y-auto ${
                theme === "dark" ? "bg-zinc-950 text-gray-200" : "bg-white text-stone-800"
              }`}
            >
              
              {/* Close Button */}
              <button
                onClick={() => setActiveDrawer(null)}
                className={`absolute top-6 right-6 p-2 rounded-full border transition-colors cursor-pointer ${
                  theme === "dark"
                    ? "border-zinc-800 hover:bg-zinc-900 text-gray-400 hover:text-white"
                    : "border-stone-200 hover:bg-stone-100 text-stone-600 hover:text-stone-950"
                }`}
                title="Close drawer"
              >
                <X size={16} />
              </button>

              {/* STORY 1: LATEST RELEASE STORY */}
              {activeDrawer === "story" && latestRelease && (
                <div className="space-y-8 pr-2">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono tracking-[0.25em] text-sorside-red uppercase block">
                      Cerita di Balik Lagu
                    </span>
                    <h3 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight uppercase">
                      {latestRelease.title}
                    </h3>
                    <p className="text-xs font-mono text-stone-500">
                      sorside • Liner Notes • Released {latestRelease.credits?.releasedDate || latestRelease.year}
                    </p>
                  </div>

                  <div className="border-l border-sorside-red/30 pl-4 py-2 bg-sorside-red/5 rounded-r prose prose-stone dark:prose-invert">
                    <MarkdownRenderer content={latestRelease.story} theme={theme} />
                  </div>

                  <div className={`space-y-4 font-serif text-sm md:text-base leading-relaxed tracking-wide ${theme === "dark" ? "text-gray-300" : "text-stone-700"}`}>
                    <div className="prose prose-stone dark:prose-invert max-w-none">
                      <MarkdownRenderer content={latestRelease.about} theme={theme} />
                    </div>
                    
                    {latestRelease.lyrics && (
                      <>
                        <h4 className="text-base font-serif font-bold text-sorside-red pt-4">
                          Lirik &amp; Bait (Lyrics)
                        </h4>
                        <div className="font-serif whitespace-pre-line p-5 border rounded bg-opacity-30 space-y-2 leading-relaxed tracking-wide text-xs md:text-sm bg-neutral-900/50 border-sorside-red/10">
                          {latestRelease.lyrics}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* STORY 2: FEATURED JOURNAL */}
              {activeDrawer === "featured" && (
                <div className="space-y-8 pr-2">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono tracking-[0.25em] text-sorside-red uppercase block">
                      {featuredSide.category}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight uppercase leading-tight">
                      {featuredSide.title}
                    </h3>
                    <p className="text-xs font-mono text-stone-500">
                      Ditulis oleh sorside • {featuredSide.date}
                    </p>
                  </div>

                  <div className={`space-y-5 font-serif text-sm md:text-base leading-relaxed tracking-wide ${theme === "dark" ? "text-gray-300" : "text-stone-700"}`}>
                    <div className="whitespace-pre-line">
                      {featuredSide.content}
                    </div>
                  </div>
                </div>
              )}

              {/* STORY 3: JOURNEY TIMELINE STORY */}
              {activeDrawer === "journey" && (
                <div className="space-y-8 pr-2">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono tracking-[0.25em] text-sorside-red uppercase block">
                      Kronik Lengkap
                    </span>
                    <h3 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight uppercase">
                      Perjalanan sorside
                    </h3>
                    <p className="text-xs font-mono text-stone-500">
                      Peta perjuangan &amp; visi masa depan sorside
                    </p>
                  </div>

                  <div className="space-y-6 relative pl-4 border-l border-sorside-red/20 py-2">
                    {journeyPoints.map((point) => (
                      <div key={point.id} className="space-y-1 text-left">
                        <span className="text-xs font-mono text-sorside-red font-bold">{point.phaseLabel || `MILESTONE // ${point.year}`}</span>
                        <h4 className={`text-base font-serif font-bold ${theme === "dark" ? "text-white" : "text-stone-900"}`}>
                          {point.title}
                        </h4>
                        <p className={`text-xs leading-relaxed ${theme === "dark" ? "text-gray-400" : "text-stone-600"}`}>
                          {point.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. FLOATING MINIMAL PLAYER */}
      <AnimatePresence>
        {currentSong && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-6 left-6 right-6 md:left-auto md:right-12 md:w-96 z-50 shadow-2xl rounded-2xl overflow-hidden border border-sorside-red/20 backdrop-blur-lg bg-stone-950/95 text-white flex flex-col glow-red"
            id="floating-player"
          >
            {/* Top Area: Persistent YouTube Player Container */}
            {(() => {
              const activeYoutubeUrl = currentTrack?.youtubeUrl || currentSong?.youtubeUrl;
              const activeYoutubeId = getYouTubeId(activeYoutubeUrl);
              
              if (!activeYoutubeId) return null;
              
              return (
                <div 
                  className={showPlayerVideo ? "relative w-full aspect-video bg-black overflow-hidden shadow-inner" : "hidden w-0 h-0"}
                >
                  <iframe
                    ref={iframeRef}
                    src={`https://www.youtube.com/embed/${activeYoutubeId}?enablejsapi=1&mute=${isMuted ? 1 : 0}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full"
                  />
                  {!isAudioPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center group bg-black/90">
                      <img
                        src={currentSong.cover}
                        alt={currentSong.title}
                        className="absolute inset-0 w-full h-full object-cover blur-sm opacity-40 grayscale"
                      />
                      <img
                        src={currentSong.cover}
                        alt={currentSong.title}
                        className="relative z-10 w-24 h-24 object-cover rounded-md shadow-md border border-white/10"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                        <button
                          onClick={handlePlayAudio}
                          className="w-12 h-12 rounded-full bg-sorside-red text-white flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform cursor-pointer"
                        >
                          <Play size={16} fill="currentColor" className="ml-0.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Bottom Area: Compact Controls & Info in a Single Row */}
            <div className="p-3.5 flex items-center justify-between gap-3 bg-stone-950">
              {/* Left: Info */}
              <div className="flex-1 min-w-0 text-left">
                {currentTrack ? (
                  <>
                    <h4 className="text-xs font-serif font-bold text-zinc-100 truncate" title={currentTrack.title}>
                      {currentTrack.title}
                    </h4>
                    <p className="text-[9px] font-mono text-zinc-400 truncate mt-0.5" title={currentSong.title}>
                      {currentSong.title}
                    </p>
                  </>
                ) : (
                  <>
                    <h4 className="text-xs font-serif font-bold text-zinc-100 truncate" title={currentSong.title}>
                      {currentSong.title}
                    </h4>
                    <p className="text-[9px] font-mono text-zinc-400 truncate mt-0.5">
                      {currentSong.artist ? currentSong.artist.toLowerCase() : "sorside"}
                    </p>
                  </>
                )}
              </div>

              {/* Center: Playback Controls */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={handlePrev}
                  className="p-1.5 rounded-full hover:bg-white/5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  title="Lagu Sebelumnya"
                >
                  <SkipBack size={14} />
                </button>

                <button
                  onClick={isAudioPlaying ? handlePauseAudio : handlePlayAudio}
                  className="w-8.5 h-8.5 rounded-full bg-sorside-red hover:bg-red-700 text-white flex items-center justify-center transition-transform hover:scale-105 cursor-pointer shadow-md shadow-sorside-red/20"
                  title={isAudioPlaying ? "Pause" : "Play"}
                >
                  {isAudioPlaying ? (
                    <Pause size={13} fill="currentColor" />
                  ) : (
                    <Play size={13} fill="currentColor" className="ml-0.5" />
                  )}
                </button>

                <button
                  onClick={handleNext}
                  className="p-1.5 rounded-full hover:bg-white/5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  title="Lagu Selanjutnya"
                >
                  <SkipForward size={14} />
                </button>
              </div>

              {/* Right: Video toggle + Close */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {/* Video Toggle (Icon Only) */}
                <button
                  onClick={() => setShowPlayerVideo(!showPlayerVideo)}
                  className={`p-1.5 rounded-md border transition-colors cursor-pointer ${
                    showPlayerVideo
                      ? "border-sorside-red/30 text-sorside-red bg-sorside-red/10 hover:bg-sorside-red/20"
                      : "border-zinc-850 text-zinc-400 hover:text-white hover:bg-zinc-900"
                  }`}
                  title={showPlayerVideo ? "Sembunyikan Video" : "Tampilkan Video"}
                >
                  {showPlayerVideo ? <Video size={13} /> : <VideoOff size={13} />}
                </button>

                {/* Close X */}
                <button
                  onClick={() => setCurrentSong(null)}
                  className="p-1.5 rounded-md bg-zinc-900/60 text-zinc-400 hover:text-white hover:bg-sorside-red/20 border border-zinc-800 hover:border-sorside-red/45 transition-all cursor-pointer"
                  title="Tutup Player"
                >
                  <X size={13} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
