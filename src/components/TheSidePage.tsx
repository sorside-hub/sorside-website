import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, 
  ArrowLeft, 
  Play, 
  Pause,
  Calendar, 
  Clock, 
  ChevronRight, 
  ArrowRight,
  Music,
  ChevronLeft
} from "lucide-react";
import { JournalArticle, Song } from "../types";
import { JOURNAL_DATA } from "../data/journalData";
import { JournalCategory, HomeConfig } from "../lib/homeConfig";
import MarkdownRenderer from "./MarkdownRenderer";

interface TheSidePageProps {
  theme: "dark" | "light";
  currentSong: Song | null;
  isAudioPlaying: boolean;
  onPlaySong: (songId: string) => void;
  onPauseSong: () => void;
  // Deep link or initial open article title
  initialArticleTitle?: string | null;
  onClearInitialArticle?: () => void;
  journals?: JournalArticle[];
  categories?: JournalCategory[];
  config?: HomeConfig;
  activeJournalId?: string | null;
  onSelectJournal?: (id: string | null) => void;
}

export default function TheSidePage({
  theme,
  currentSong,
  isAudioPlaying,
  onPlaySong,
  onPauseSong,
  initialArticleTitle,
  onClearInitialArticle,
  journals = [],
  categories = [],
  config,
  activeJournalId,
  onSelectJournal
}: TheSidePageProps) {
  const [filter, setFilter] = useState<string>("ALL");
  const [selectedArticle, setSelectedArticle] = useState<JournalArticle | null>(null);

  const finalJournals = journals;
  const finalCategories = categories;

  // Handle deep linking from music pages
  useEffect(() => {
    if (initialArticleTitle) {
      const match = finalJournals.find(
        (article) => 
          article.title.toLowerCase().includes(initialArticleTitle.toLowerCase()) ||
          initialArticleTitle.toLowerCase().includes(article.title.toLowerCase())
      );
      if (match) {
        if (onSelectJournal) {
          onSelectJournal(match.id);
        } else {
          setSelectedArticle(match);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
      if (onClearInitialArticle) {
        onClearInitialArticle();
      }
    }
  }, [initialArticleTitle, onClearInitialArticle, finalJournals, onSelectJournal]);

  // Sync selectedArticle with activeJournalId prop
  useEffect(() => {
    if (activeJournalId) {
      const match = finalJournals.find(j => j.id === activeJournalId);
      if (match) {
        setSelectedArticle(match);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setSelectedArticle(null);
      }
    } else {
      setSelectedArticle(null);
    }
  }, [activeJournalId, finalJournals]);

  // Filtered articles
  const filteredArticles = finalJournals.filter((article) => {
    if (filter === "ALL") return true;
    return article.category === filter;
  });

  // Featured article (selected via config, otherwise defaults to latest/first story)
  const featuredArticle = finalJournals.find(j => j.id === config?.theSideFeaturedId) || finalJournals[0];

  const handleBackToJournalList = () => {
    if (onSelectJournal) {
      onSelectJournal(null);
    } else {
      setSelectedArticle(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSelectArticle = (article: JournalArticle) => {
    if (onSelectJournal) {
      onSelectJournal(article.id);
    } else {
      setSelectedArticle(article);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-16 md:space-y-24 min-h-screen pb-12">
      <AnimatePresence mode="wait">
        {!selectedArticle ? (
          <motion.div
            key="journal-list"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5 }}
            className="space-y-16 md:space-y-24"
          >
            {/* 1. HERO SECTION */}
            <section className="relative overflow-hidden rounded-3xl border border-sorside-red/10 p-8 md:p-16 flex flex-col justify-between min-h-[35vh] md:min-h-[45vh] bg-stone-950 text-white shadow-2xl">
              {/* Subtle Atmospheric Grid */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(224,36,36,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(224,36,36,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)] pointer-events-none" />

              <div className="space-y-4 max-w-xl z-10 text-left">
                <span className="text-xs font-mono tracking-[0.4em] text-sorside-red uppercase font-semibold">
                  {config?.theSideTitlePrefix || "SISI JURNAL // PROSES KREATIF"}
                </span>
                <h1 className="text-4xl md:text-6xl font-display font-extrabold tracking-tight uppercase">
                  The Side
                </h1>
                <p className="text-lg md:text-2xl font-newsreader text-gray-300 leading-relaxed italic max-w-md">
                  &ldquo;{config?.theSideSubtitle || "Cerita, batin, dan sisa-sisa malam di balik sorside."}&rdquo;
                </p>
                <p className="text-xs font-mono text-stone-500 max-w-sm pt-2 leading-relaxed">
                  {config?.theSideDescription || "Jika rilisan musik adalah hasil akhirnya, halaman ini merekam proses pencarian batin di sela-sela rutinitas yang monoton."}
                </p>
              </div>

              {/* Decorative line */}
              <div className="pt-8 flex items-center gap-6 text-[10px] font-mono uppercase tracking-widest text-zinc-500 z-10">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-sorside-red rounded-full" />
                  <span>Dek Membaca Interaktif</span>
                </div>
                <span>•</span>
                <span>Log Catatan Kamar 3x3</span>
              </div>
            </section>

            {/* 2. FEATURED JOURNAL */}
            {filter === "ALL" && featuredArticle && (
              <section className="space-y-6">
                <div className="flex items-center space-x-2">
                  <span className="h-[1px] w-8 bg-sorside-red" />
                  <span className="text-[10px] font-mono tracking-[0.25em] text-sorside-red uppercase">
                    Jurnal Terbaru
                  </span>
                </div>

                <div className={`p-6 md:p-8 rounded-3xl border transition-all duration-500 relative overflow-hidden group ${
                  theme === "dark" 
                    ? "bg-zinc-950/40 border-zinc-900/80 hover:border-sorside-red/20" 
                    : "bg-white border-stone-200 shadow-sm hover:border-sorside-red/10"
                }`}>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    {/* Left side: Thumbnail */}
                    <div className="lg:col-span-5 relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden border border-neutral-800/15 bg-neutral-900 shadow-lg">
                      <img
                        src={featuredArticle.thumbnail}
                        alt={featuredArticle.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-102 transition-all duration-700"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="text-[9px] font-mono uppercase tracking-wider bg-sorside-red text-white px-2 py-0.5 rounded">
                          {finalCategories.find(c => c.id === featuredArticle.category)?.label || featuredArticle.categoryLabel || featuredArticle.category}
                        </span>
                      </div>
                    </div>

                    {/* Right side: Information */}
                    <div className="lg:col-span-7 space-y-4 text-left">
                      <div className="flex items-center gap-3 text-xs font-mono text-stone-500">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {featuredArticle.date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {featuredArticle.readTime}
                        </span>
                      </div>

                      <h3 className={`text-2xl md:text-3xl font-serif font-bold tracking-tight leading-tight group-hover:text-sorside-red transition-colors ${
                        theme === "dark" ? "text-white" : "text-stone-900"
                      }`}>
                        {featuredArticle.title}
                      </h3>

                      <p className={`font-serif text-sm leading-relaxed tracking-wide ${
                        theme === "dark" ? "text-gray-400" : "text-stone-600"
                      }`}>
                        {featuredArticle.summary}
                      </p>

                      <div className="pt-2">
                        <button
                          onClick={() => handleSelectArticle(featuredArticle)}
                          className="text-xs font-mono uppercase tracking-widest text-sorside-red font-bold hover:underline flex items-center gap-2 group cursor-pointer"
                        >
                          <span>Mulai Membaca</span>
                          <ArrowRight size={12} className="transform group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* 3. STORIES LIST WITH FILTER */}
            <section className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sorside-red/10 pb-4 text-left">
                <div className="space-y-1">
                  <h3 className="text-2xl font-display font-bold uppercase tracking-tight">
                    Semua Cerita
                  </h3>
                  <p className="text-xs font-mono text-stone-500">
                    Kumpulan coretan, dokumentasi lagu, dan pemikiran sorside.
                  </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] tracking-widest">
                  <button
                    key="ALL"
                    onClick={() => setFilter("ALL")}
                    className={`px-3 py-1.5 transition-all rounded cursor-pointer uppercase ${
                      filter === "ALL"
                        ? "bg-sorside-red text-white font-semibold"
                        : theme === "dark"
                        ? "text-gray-400 hover:text-white bg-zinc-900/50 hover:bg-zinc-900"
                        : "text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200"
                    }`}
                  >
                    SEMUA
                  </button>
                  {finalCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setFilter(cat.id)}
                      className={`px-3 py-1.5 transition-all rounded cursor-pointer uppercase ${
                        filter === cat.id
                          ? "bg-sorside-red text-white font-semibold"
                          : theme === "dark"
                          ? "text-gray-400 hover:text-white bg-zinc-900/50 hover:bg-zinc-900"
                          : "text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Journal Grid */}
              {filteredArticles.length === 0 ? (
                <div className="py-16 text-center space-y-3 border border-dashed border-stone-800 rounded-2xl">
                  <BookOpen className="mx-auto text-stone-600" size={32} />
                  <p className="font-mono text-xs text-stone-500 uppercase tracking-widest">
                    Belum ada artikel / catatan
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-left">
                  <AnimatePresence mode="popLayout">
                    {filteredArticles.map((article) => (
                    <motion.div
                      layout
                      key={article.id}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.3 }}
                      className={`group p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                        theme === "dark" 
                          ? "bg-zinc-950/20 border-zinc-900/60 hover:border-sorside-red/20" 
                          : "bg-white border-stone-200 shadow-sm hover:border-sorside-red/10"
                      }`}
                    >
                      <div className="space-y-4">
                        {/* Artwork */}
                        <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-neutral-800/10 bg-neutral-900">
                          <img
                            src={article.thumbnail}
                            alt={article.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-102 transition-all duration-500"
                          />
                          <div className="absolute top-2 left-2">
                            <span className="text-[8px] font-mono uppercase bg-zinc-950/80 text-sorside-red px-2 py-0.5 rounded border border-sorside-red/20">
                              {finalCategories.find(c => c.id === article.category)?.label || article.categoryLabel || article.category}
                            </span>
                          </div>
                        </div>

                        {/* Text */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 text-[10px] font-mono text-stone-500">
                            <span className="flex items-center gap-1">
                              <Calendar size={10} />
                              {article.date}
                            </span>
                            <span>•</span>
                            <span>{article.readTime}</span>
                          </div>

                          <h4 className={`text-lg font-serif font-bold tracking-tight group-hover:text-sorside-red transition-colors leading-snug ${
                            theme === "dark" ? "text-white" : "text-stone-900"
                          }`}>
                            {article.title}
                          </h4>

                          <p className={`font-serif text-xs md:text-sm tracking-wide leading-relaxed line-clamp-2 ${
                            theme === "dark" ? "text-gray-400" : "text-stone-600"
                          }`}>
                            {article.summary}
                          </p>
                        </div>
                      </div>

                      {/* Card Action */}
                      <div className="flex items-center justify-between pt-4 border-t border-stone-500/5 mt-5">
                        {article.inspiredSongTitle && (
                          <span className="text-[9px] font-mono text-sorside-red flex items-center gap-1">
                            <Music size={10} />
                            <span>{article.inspiredSongTitle}</span>
                          </span>
                        )}
                        <button
                          onClick={() => handleSelectArticle(article)}
                          className="text-[10px] font-mono uppercase tracking-widest text-sorside-red font-bold hover:underline flex items-center gap-1 ml-auto cursor-pointer"
                        >
                          <span>Membaca</span>
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
          /* 4. JOURNAL DETAIL VIEW */
          <motion.div
            key="journal-detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-10 max-w-3xl mx-auto text-left"
          >
            {/* Back button */}
            <button
              onClick={handleBackToJournalList}
              className="px-4 py-2 border border-stone-500/10 hover:border-sorside-red text-stone-500 hover:text-sorside-red rounded-lg text-xs font-mono uppercase tracking-widest transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft size={12} />
              <span>Kembali ke Jurnal</span>
            </button>

            {/* Article Header block */}
            <article className="space-y-8">
              <header className="space-y-4">
                <span className="inline-block text-[10px] font-mono uppercase tracking-[0.2em] bg-sorside-red/10 text-sorside-red px-3 py-1 rounded-full border border-sorside-red/20">
                  {finalCategories.find(c => c.id === selectedArticle.category)?.label || selectedArticle.categoryLabel || selectedArticle.category}
                </span>

                <h1 className={`text-2xl md:text-4xl font-editorial font-bold tracking-tight leading-snug ${
                  theme === "dark" ? "text-white" : "text-stone-900"
                }`}>
                  {selectedArticle.title}
                </h1>

                <div className="flex items-center gap-4 text-xs font-mono text-stone-500 border-b border-stone-500/10 pb-4">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {selectedArticle.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {selectedArticle.readTime}
                  </span>
                </div>
              </header>

              {/* Large Cover (Optional) */}
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-neutral-800/15 bg-neutral-900 shadow-md">
                <img
                  src={selectedArticle.thumbnail}
                  alt={selectedArticle.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale brightness-90"
                />
              </div>

              {/* Article Content */}
              <div className={`prose max-w-none space-y-6`}>
                <MarkdownRenderer content={selectedArticle.content} theme={theme} />
              </div>

              {/* Related Song Dynamic Connection Widget */}
              {selectedArticle.inspiredSongId && (
                <div className={`p-6 rounded-2xl border border-sorside-red/10 relative overflow-hidden mt-12 bg-gradient-to-r from-transparent to-sorside-red/5`}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="space-y-2">
                      <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-sorside-red font-bold block">
                        {selectedArticle.inspirationType}
                      </span>
                      <div className="flex items-center gap-2">
                        <Music className="text-sorside-red" size={16} />
                        <h4 className={`text-lg font-serif font-bold ${
                          theme === "dark" ? "text-white" : "text-stone-900"
                        }`}>
                          {selectedArticle.inspiredSongTitle}
                        </h4>
                      </div>
                      <p className="text-xs text-stone-500">
                        Dengarkan representasi melodi yang lahir dari tulisan catatan batin ini.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        if (selectedArticle.inspiredSongId) {
                          onPlaySong(selectedArticle.inspiredSongId);
                        }
                      }}
                      className="px-5 py-3 bg-sorside-red hover:bg-red-700 text-white text-xs font-mono uppercase tracking-widest rounded-lg transition-all shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      {isAudioPlaying && currentSong?.id === selectedArticle.inspiredSongId ? (
                        <>
                          <Pause size={12} fill="currentColor" />
                          <span>Pause Soundscape</span>
                        </>
                      ) : (
                        <>
                          <Play size={12} fill="currentColor" className="ml-0.5" />
                          <span>Dengarkan Lagu</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </article>

            {/* Read More / Pagination Link */}
            <div className="pt-12 border-t border-stone-500/10 flex justify-between items-center">
              <button
                onClick={handleBackToJournalList}
                className="text-xs font-mono uppercase tracking-widest text-stone-500 hover:text-sorside-red flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft size={14} />
                <span>Semua Cerita</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
