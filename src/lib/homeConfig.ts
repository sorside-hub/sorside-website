import { JournalArticle, ContactMessage, Song } from '../types';
import { JOURNAL_DATA } from '../data/journalData';
import { SONGS_DATA } from '../data/musicData';

export interface JournalCategory {
  id: string; // e.g. "STORY"
  label: string; // e.g. "Cerita"
}

export interface HomeConfig {
  descriptionQuote: string;
  descriptionDetail: string;
  posterImageUrl: string;
  posterLabel: string;
  posterQuote: string;
  latestReleaseSongId: string;
  fromTheSideSource: string; // e.g. "journal_id" or "about_section_id"
  fromTheSideTitleCustom?: string;
  fromTheSideTextCustom?: string;
  
  // Manifesto configs
  manifestoTitle?: string;
  manifestoQuote?: string;
  manifestoText?: string;
  
  // About Page configs
  aboutTitlePrefix?: string;
  aboutHeroSubtitle?: string;
  aboutHeroDescription?: string;
  aboutSection1Title?: string;
  aboutSection1Text1?: string;
  aboutSection1Text2?: string;
  aboutSection2Title?: string;
  aboutSection2Text1?: string;
  aboutSection2Quote?: string;
  aboutSection2Text2?: string;
  aboutSection3Title?: string;
  aboutSection3Text1?: string;
  aboutSection3Text2?: string;
  aboutSection4Title?: string;
  aboutSection4Text1?: string;
  aboutSection4Bullet1?: string;
  aboutSection4Bullet2?: string;
  aboutSection4Bullet3?: string;
  aboutSection4Text2?: string;
  aboutSection5Title?: string;
  aboutSection5Tagline?: string;
  aboutSection5Text1?: string;
  aboutSection5Text2?: string;
  aboutSection5CoverUrl?: string;
  aboutManifestoQuote?: string;

  // The Side Page configs
  theSideTitlePrefix?: string;
  theSideSubtitle?: string;
  theSideDescription?: string;
  theSideFeaturedId?: string;

  // Contact Page configs
  contactSubtitle?: string;
  contactQuote?: string;
  contactDescription?: string;
  contactEmail?: string;
  contactInstagram?: string;
  contactTiktok?: string;
  contactYoutube?: string;
  contactSpotify?: string;
  contactAppleMusic?: string;
  contactManagementName?: string;
  contactManagementResponseTime?: string;

  // Music Page configs
  musicSubtitle?: string;
  musicTitlePrefix?: string;
  featuredReleaseId?: string;
}

export interface JourneyPoint {
  id: string;
  year: string;
  title: string;
  description: string;
  order: number;
  isDrawerOnly?: boolean;
  phaseLabel?: string;
}

export const DEFAULT_HOME_CONFIG: HomeConfig = {
  descriptionQuote: "Setiap orang punya sisi lain. Sisi yang hadir ketika dunia mulai sunyi",
  descriptionDetail: "Di siang hari, kita belajar terlihat kuat, menjalani peran, dan menghadapi dunia. Namun ketika malam datang dan semuanya menjadi tenang, kita kembali bertemu dengan diri sendiri, bersama segala mimpi, keraguan, lelah, dan cerita yang tersimpan.",
  posterImageUrl: "/images/pages/artist_bedroom.jpg",
  posterLabel: "Sisi Kamar — Sunyi",
  posterQuote: "Terbangun ketika seluruh bumi terlelap. Menangkap sisa-sisa melodi batin.",
  latestReleaseSongId: "skenario-25",
  fromTheSideSource: "journal_kenapa-buat-musik-setelah-kerja",
  
  // Manifesto defaults
  manifestoTitle: "sorside bukan hanya sekadar musik.",
  manifestoQuote: "Ini adalah sisi lain dari seseorang yang tetap mengejar mimpi setelah dunia selesai menuntut.",
  manifestoText: "Ketika siang hari dipakai untuk mengais materi demi memenuhi ekspektasi sosial, malam hari adalah tempat kejujuran dipulangkan. sorside lahir sebagai jurnal batin di sela-sela lelahnya rutinitas harian.",
  
  // About Page defaults
  aboutTitlePrefix: "SISI SEJARAH // ARSIP",
  aboutHeroSubtitle: "Lebih dari sekadar musik.",
  aboutHeroDescription: "Inilah kisah di balik sorside. Sekelebat pandang ke dalam sudut sunyi kamar tidur di mana pemikiran sepertiga malam bersalin rupa menjadi gelombang analog yang hangat.",
  aboutSection1Title: "Apa itu sorside?",
  aboutSection1Text1: "sorside bukanlah sekadar proyek musik komersial yang mengejar tangga lagu populer atau algoritma streaming. Ia lahir sebagai ruang pelarian mandiri—sebuah suaka batiniah di mana emosi yang tersumbat selama jam kerja harian dapat diurai menjadi gelombang nada yang jujur.",
  aboutSection1Text2: "Ketika siang hari dihabiskan untuk memenuhi ekspektasi sosial dan tuntutan profesionalitas, sorside adalah tempat untuk pulang ke diri sendiri. Musik ini dibuat sebagai teman kontemplasi bagi jiwa-jiwa komuter, pekerja shift malam, dan siapa saja yang merasa terasing di bawah hiruk-pikuk kehidupan modern.",
  aboutSection2Title: "Kenapa bernama \"sorside\"?",
  aboutSection2Text1: "Nama sorside adalah hibrida emosional. Ia memadukan kata \"sor\"—yang diambil dari bahasa lokal yang merepresentasikan rasa suka mendalam, ketertarikan, atau frekuensi batin yang bergetar—dengan kata bahasa Inggris \"side\" yang berarti sisi.",
  aboutSection2Quote: "sorside adalah sisi lain dari diri kita yang paling jujur. Sisi yang kita sukai, kita pelihara secara diam-diam, namun sering kali harus dikubur demi menjalani rutinitas harian.",
  aboutSection2Text2: "Memilih nama sorside adalah pengingat konstan untuk selalu menyisakan ruang bagi sisi kreatif kita agar tetap bernapas, terlepas dari seberapa bising dan menuntutnya dunia luar.",
  aboutSection3Title: "Visi Kami",
  aboutSection3Text1: "Visi artistik sorside tidak diukur dengan angka statistik, jumlah pengikut media sosial, atau target komersialitas industri. Visi proyek ini adalah membangun jembatan empati melalui suara.",
  aboutSection3Text2: "sorside ingin menciptakan musik yang berfungsi layaknya liner notes pada piringan hitam tua atau halaman jurnal pribadi yang berserakan—intim, bertekstur, dan penuh refleksi batin. Tujuan akhirnya sederhana: menemani pendengar melewati malam-malam sepi mereka, memberi tahu mereka bahwa ada orang lain di belahan bumi lain yang merasakan getaran batin yang sama di pukul dua fajar.",
  aboutSection4Title: "Karakter Suara",
  aboutSection4Text1: "Lanskap musikal sorside berada di persimpangan Atmospheric Alternative Rock, Cinematic Shoegaze, dan sentuhan hangat Bedroom Pop. Karakter suaranya ditandai oleh:",
  aboutSection4Bullet1: "Deep Ambient Synths: Lapisan melodi synth yang melayang lambat, menciptakan dimensi ruang batin yang luas namun intim.",
  aboutSection4Bullet2: "Raw Acoustic Guitars: Petikan gitar akustik yang sengaja direkam apa adanya, mempertahankan derit jari dan dinamika emosi alami.",
  aboutSection4Bullet3: "Tape Saturation & Noise: Penggunaan tekstur grain, tape hiss, dan derau analog untuk memberikan kesan usang yang emosional.",
  aboutSection4Text2: "Pengaruh utama sorside terbentang dari melodi-melodi kontemplatif indie modern, estetika jurnal piringan hitam, hingga bebunyian malam hari yang tulus.",
  aboutSection5Title: "Di Balik sorside",
  aboutSection5Tagline: "Satu manusia mandiri merajut rasa di sela-sela shift kehidupan harian.",
  aboutSection5Text1: "Proyek ini diinisiasi dan dijalankan sepenuhnya oleh seorang kreator independen yang menetap di Surabaya. Lahir dari kebutuhan mutlak untuk tetap waras di tengah tuntutan hidup yang mekanis.",
  aboutSection5Text2: "Segala proses penulisan lagu, perekaman instrumen, hingga perancangan visual ini dilakukan di sebuah studio kamar tidur sederhana berukuran 3x3 meter—biasanya diselesaikan antara pukul sepuluh malam hingga pukul tiga pagi, sesaat setelah tanggung jawab pekerjaan harian selesai dipenuhi.",
  aboutSection5CoverUrl: "/images/pages/artist_bedroom.jpg",
  aboutManifestoQuote: "Sebab bermimpi bukanlah tentang menaklukkan fajar, melainkan keberanian untuk tetap terjaga di tengah malam yang paling sunyi.",

  // The Side Page defaults
  theSideTitlePrefix: "SISI JURNAL // PROSES KREATIF",
  theSideSubtitle: "Cerita, batin, dan sisa-sisa malam di balik sorside.",
  theSideDescription: "Jika rilisan musik adalah hasil akhirnya, halaman ini merekam proses pencarian batin di sela-sela rutinitas yang monoton.",
  theSideFeaturedId: "kenapa-buat-musik-setelah-kerja",

  // Contact Page defaults
  contactSubtitle: "SISI HUBUNGAN // CHANNELS",
  contactQuote: "Mari saling terhubung.",
  contactDescription: "Entah itu ajakan kolaborasi, obrolan santai, atau sekadar menyapa dan berbagi cerita. Setiap hubungan selalu dimulai dari satu sapaan tulus.",
  contactEmail: "sorside.raw@gmail.com",
  contactInstagram: "https://www.instagram.com/sor.side",
  contactTiktok: "https://www.tiktok.com/@sor.side",
  contactYoutube: "https://youtube.com/@sorside",
  contactSpotify: "https://spotify.com",
  contactAppleMusic: "https://music.apple.com",
  contactManagementName: "sorside Collective",
  contactManagementResponseTime: "Waktu tanggapan: 24-48 jam.",

  // Music Page defaults
  musicTitlePrefix: "SISI SUARA // ARCHIVES",
  musicSubtitle: "Kumpulan bebunyian, cerita, dan sisa-sisa ingatan dari sudut kamar sorside.",
  featuredReleaseId: "skenario-25"
};

export const DEFAULT_JOURNEY_POINTS: JourneyPoint[] = [
  {
    id: "journey-1",
    year: "2025",
    title: "Awal Mula sorside",
    description: "Menulis dan merilis lagu-lagu pertama di sela-sela shift kerja malam. Mengumpulkan frekuensi-frekuensi sunyi untuk diproses di kamar tidur ukuran 3x3 meter.",
    order: 1,
    isDrawerOnly: false,
    phaseLabel: "FASE 1 // 2025 (PRESENT)"
  },
  {
    id: "journey-2",
    year: "2028",
    title: "The Bedroom Live Session",
    description: "Merekam video pertunjukan langsung intim berskala kecil langsung dari dalam kamar tidur, lengkap dengan audio mentah dan penjelasan di balik setiap bait lirik.",
    order: 2,
    isDrawerOnly: true,
    phaseLabel: "FASE 2 // 2028 (UPCOMING)"
  },
  {
    id: "journey-3",
    year: "2030",
    title: "Babak Besar Pertama",
    description: "Merilis album penuh fisik (piringan hitam/vinyl) pertama yang merangkum semua pertanyaan batin yang sempat tertunda sepanjang dekade perjuangan harian.",
    order: 3,
    isDrawerOnly: false,
    phaseLabel: "FASE 3 // 2030 (FUTURE)"
  }
];

const LOCAL_STORAGE_CONFIG_KEY = "sorside_home_config";
const LOCAL_STORAGE_JOURNEY_KEY = "sorside_journey_points";

// Static JSON Content Loaders (powered by Decap CMS & Vite)
export async function fetchStaticSiteConfig(): Promise<HomeConfig | null> {
  try {
    const res = await fetch('/content/site_config.json');
    if (res.ok) {
      const data = await res.json();
      if (data && data.descriptionQuote) return data as HomeConfig;
    }
  } catch (e) {
    // Ignore fetch error
  }
  return null;
}

export function fetchStaticJourneyPoints(): JourneyPoint[] {
  try {
    const modules = import.meta.glob(['/public/content/journey/*.json', '../../public/content/journey/*.json'], { eager: true });
    const items: JourneyPoint[] = [];
    for (const path in modules) {
      const mod = modules[path] as any;
      const item = mod?.default || mod;
      if (item && item.id) {
        items.push(item as JourneyPoint);
      }
    }
    return items.sort((a, b) => a.order - b.order);
  } catch (e) {
    return [];
  }
}

export function fetchStaticJournals(): JournalArticle[] {
  try {
    const modules = import.meta.glob(['/public/content/journals/*.json', '../../public/content/journals/*.json'], { eager: true });
    const items: JournalArticle[] = [];
    for (const path in modules) {
      const mod = modules[path] as any;
      const item = mod?.default || mod;
      if (item && item.id) {
        items.push(item as JournalArticle);
      }
    }
    return items;
  } catch (e) {
    return [];
  }
}

export async function fetchStaticCategories(): Promise<JournalCategory[] | null> {
  try {
    const res = await fetch('/content/categories.json');
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.items)) return data.items as JournalCategory[];
    }
  } catch (e) {
    // Ignore
  }
  return null;
}

export function fetchStaticSongs(): Song[] {
  try {
    const modules = import.meta.glob(['/public/content/songs/*.json', '../../public/content/songs/*.json'], { eager: true });
    const items: Song[] = [];
    for (const path in modules) {
      const mod = modules[path] as any;
      const item = mod?.default || mod;
      if (item && item.id) {
        items.push(item as Song);
      }
    }
    return items;
  } catch (e) {
    return [];
  }
}

export async function loadHomeConfig(): Promise<HomeConfig> {
  // 1. Try loading from static Decap CMS JSON content
  const staticConfig = await fetchStaticSiteConfig();
  if (staticConfig) {
    return staticConfig;
  }

  // 2. Fallback to localStorage
  try {
    const local = localStorage.getItem(LOCAL_STORAGE_CONFIG_KEY);
    if (local) {
      return JSON.parse(local);
    }
  } catch (e) {
    console.error("Local storage read error:", e);
  }

  return DEFAULT_HOME_CONFIG;
}

export async function saveHomeConfig(config: HomeConfig): Promise<boolean> {
  try {
    localStorage.setItem(LOCAL_STORAGE_CONFIG_KEY, JSON.stringify(config));
    return true;
  } catch (e) {
    console.error("Local storage write error:", e);
    return false;
  }
}

export async function loadJourneyPoints(): Promise<JourneyPoint[]> {
  // Try static Decap CMS content
  const staticPoints = fetchStaticJourneyPoints();
  if (staticPoints && staticPoints.length > 0) {
    return staticPoints;
  }

  // Fallback to localStorage
  try {
    const local = localStorage.getItem(LOCAL_STORAGE_JOURNEY_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.sort((a: any, b: any) => a.order - b.order);
      }
    }
  } catch (e) {
    console.error("Local storage read error:", e);
  }

  return staticPoints && staticPoints.length > 0 ? staticPoints : DEFAULT_JOURNEY_POINTS;
}

export async function saveJourneyPoints(points: JourneyPoint[]): Promise<boolean> {
  try {
    localStorage.setItem(LOCAL_STORAGE_JOURNEY_KEY, JSON.stringify(points));
    return true;
  } catch (e) {
    console.error("Local storage write error:", e);
    return false;
  }
}

const LOCAL_STORAGE_JOURNALS_KEY = "sorside_journals";
const LOCAL_STORAGE_CATEGORIES_KEY = "sorside_categories";

export const DEFAULT_CATEGORIES: JournalCategory[] = [];

export async function loadJournals(): Promise<JournalArticle[]> {
  // Primary source: Decap CMS static content
  const staticJournals = fetchStaticJournals();
  if (staticJournals) {
    return staticJournals;
  }
  return [];
}

export async function saveJournals(journals: JournalArticle[]): Promise<boolean> {
  try {
    localStorage.setItem(LOCAL_STORAGE_JOURNALS_KEY, JSON.stringify(journals));
    return true;
  } catch (e) {
    console.error("Local storage write error for journals:", e);
    return false;
  }
}

export async function loadCategories(): Promise<JournalCategory[]> {
  // Primary source: Decap CMS static content
  const staticCategories = await fetchStaticCategories();
  if (staticCategories !== null) {
    return staticCategories;
  }
  return [];
}

export async function saveCategories(categories: JournalCategory[]): Promise<boolean> {
  try {
    localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(categories));
    return true;
  } catch (e) {
    console.error("Local storage write error for categories:", e);
    return false;
  }
}

const LOCAL_STORAGE_MESSAGES_KEY = "sorside_contact_messages";

export async function loadContactMessages(): Promise<ContactMessage[]> {
  try {
    const local = localStorage.getItem(LOCAL_STORAGE_MESSAGES_KEY);
    if (local) {
      return JSON.parse(local).sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
  } catch (e) {
    console.error("Local storage read error for messages:", e);
  }

  return [];
}

export async function saveContactMessages(messages: ContactMessage[]): Promise<boolean> {
  try {
    localStorage.setItem(LOCAL_STORAGE_MESSAGES_KEY, JSON.stringify(messages));
    return true;
  } catch (e) {
    console.error("Local storage write error for messages:", e);
    return false;
  }
}

const LOCAL_STORAGE_SONGS_KEY = "sorside_songs";

export async function loadSongs(): Promise<Song[]> {
  // Primary source: Decap CMS static content
  const staticSongs = fetchStaticSongs();
  if (staticSongs) {
    return staticSongs.sort((a: any, b: any) => b.year - a.year);
  }
  return [];
}

export async function saveSongs(songs: Song[]): Promise<boolean> {
  try {
    localStorage.setItem(LOCAL_STORAGE_SONGS_KEY, JSON.stringify(songs));
    return true;
  } catch (e) {
    console.error("Local storage write error for songs:", e);
    return false;
  }
}


