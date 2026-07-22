export interface Credits {
  writtenBy: string;
  producedBy: string;
  recordedAt: string;
  releasedDate: string;
}

export interface Track {
  id: string;
  title: string;
  duration: string;
  freq1: number;      // Synth Frequency 1
  freq2: number;      // Synth Frequency 2
  filterFreq: number; // Synth Lowpass Filter Cutoff
  lyrics?: string;
  story?: string;
  youtubeUrl?: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  year: number;
  type: "Single" | "EP" | "Album";
  tag: "SINGLE" | "EP" | "ALBUM";
  cover: string;
  story: string;
  about: string;
  lyrics: string;
  credits: Credits;
  relatedJournal: string;
  freq1: number; // For SorsideSynth custom tone
  freq2: number;
  filterFreq: number;
  youtubeUrl?: string;
  spotifyUrl?: string;
  tracks?: Track[];
}

export interface JournalArticle {
  id: string;
  title: string;
  category: "STORY" | "BEHIND THE SONG" | "NOTE";
  categoryLabel: "Cerita" | "Cerita di Balik Lagu" | "Catatan" | "Story" | "Behind the Song" | "Note";
  date: string;
  readTime: string;
  thumbnail: string;
  summary: string;
  content: string;
  inspiredSongId?: string; // id of related song
  inspiredSongTitle?: string; // display name of related song
  inspirationType: "Inspired" | "This story became" | "Note related to" | "Kisah di balik lagu" | "Menginspirasi" | "Catatan terkait";
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  timestamp: string;
  isRead?: boolean;
}


