import { motion } from "motion/react";
import { Sparkles, ShieldAlert, Disc, ArrowRight, Quote } from "lucide-react";
import { HomeConfig, DEFAULT_HOME_CONFIG } from "../lib/homeConfig";

interface AboutPageProps {
  theme: "dark" | "light";
  onTabClick: (tab: "home" | "music" | "about" | "the side" | "contact") => void;
  config?: HomeConfig;
}

export default function AboutPage({ theme, onTabClick, config }: AboutPageProps) {
  const activeConfig = config || DEFAULT_HOME_CONFIG;

  return (
    <motion.div
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
            {activeConfig.aboutTitlePrefix || DEFAULT_HOME_CONFIG.aboutTitlePrefix || "SISI SEJARAH // ARSIP"}
          </span>
          <h1 className="text-4xl md:text-6xl font-display font-extrabold tracking-tight uppercase">
            ABOUT SORSIDE
          </h1>
          <p className="text-base md:text-xl font-serif italic text-sorside-red leading-relaxed max-w-md">
            &ldquo;{activeConfig.aboutHeroSubtitle || DEFAULT_HOME_CONFIG.aboutHeroSubtitle}&rdquo;
          </p>
          <p className="text-xs font-mono text-stone-500 max-w-sm pt-2 leading-relaxed">
            {activeConfig.aboutHeroDescription || DEFAULT_HOME_CONFIG.aboutHeroDescription}
          </p>
        </div>

        {/* Decorative line */}
        <div className="pt-8 flex items-center gap-6 text-[10px] font-mono uppercase tracking-widest text-zinc-500 z-10">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-sorside-red rounded-full" />
            <span>Profil & Filosofi Musik</span>
          </div>
          <span>•</span>
          <span>Proyek Musik Independen</span>
        </div>
      </section>

      {/* CONTENT SECTIONS */}
      <div className="max-w-4xl mx-auto space-y-24 md:space-y-36">
        {/* 2. WHAT IS SORSIDE? */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-t border-sorside-red/10 pt-12">
        <div className="md:col-span-4">
          <h2 className="text-xl md:text-2xl font-display font-bold uppercase tracking-tight">
            {activeConfig.aboutSection1Title || DEFAULT_HOME_CONFIG.aboutSection1Title}
          </h2>
        </div>
        <div className={`md:col-span-8 space-y-6 font-serif text-sm md:text-base leading-relaxed tracking-wide ${
          theme === "dark" ? "text-zinc-300" : "text-stone-700"
        }`}>
          <p>
            {activeConfig.aboutSection1Text1 || DEFAULT_HOME_CONFIG.aboutSection1Text1}
          </p>
          <p>
            {activeConfig.aboutSection1Text2 || DEFAULT_HOME_CONFIG.aboutSection1Text2}
          </p>
        </div>
      </section>

      {/* 3. THE NAME */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-t border-sorside-red/10 pt-12">
        <div className="md:col-span-4">
          <h2 className="text-xl md:text-2xl font-display font-bold uppercase tracking-tight">
            {activeConfig.aboutSection2Title || DEFAULT_HOME_CONFIG.aboutSection2Title}
          </h2>
        </div>
        <div className={`md:col-span-8 space-y-6 font-serif text-sm md:text-base leading-relaxed tracking-wide ${
          theme === "dark" ? "text-zinc-300" : "text-stone-700"
        }`}>
          <p>
            {activeConfig.aboutSection2Text1 || DEFAULT_HOME_CONFIG.aboutSection2Text1}
          </p>
          <p className="text-sorside-red font-serif pl-4 border-l border-sorside-red/30 leading-relaxed text-sm md:text-base">
            &ldquo;{activeConfig.aboutSection2Quote || DEFAULT_HOME_CONFIG.aboutSection2Quote}&rdquo;
          </p>
          <p>
            {activeConfig.aboutSection2Text2 || DEFAULT_HOME_CONFIG.aboutSection2Text2}
          </p>
        </div>
      </section>

      {/* 4. THE VISION */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-t border-sorside-red/10 pt-12">
        <div className="md:col-span-4">
          <h2 className="text-xl md:text-2xl font-display font-bold uppercase tracking-tight">
            {activeConfig.aboutSection3Title || DEFAULT_HOME_CONFIG.aboutSection3Title}
          </h2>
        </div>
        <div className={`md:col-span-8 space-y-6 font-serif text-sm md:text-base leading-relaxed tracking-wide ${
          theme === "dark" ? "text-zinc-300" : "text-stone-700"
        }`}>
          <p>
            {activeConfig.aboutSection3Text1 || DEFAULT_HOME_CONFIG.aboutSection3Text1}
          </p>
          <p>
            {activeConfig.aboutSection3Text2 || DEFAULT_HOME_CONFIG.aboutSection3Text2}
          </p>
        </div>
      </section>

      {/* 5. THE SOUND */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-t border-sorside-red/10 pt-12">
        <div className="md:col-span-4">
          <h2 className="text-xl md:text-2xl font-display font-bold uppercase tracking-tight">
            {activeConfig.aboutSection4Title || DEFAULT_HOME_CONFIG.aboutSection4Title}
          </h2>
        </div>
        <div className={`md:col-span-8 space-y-6 font-serif text-sm md:text-base leading-relaxed tracking-wide ${
          theme === "dark" ? "text-zinc-300" : "text-stone-700"
        }`}>
          <p>
            {activeConfig.aboutSection4Text1 || DEFAULT_HOME_CONFIG.aboutSection4Text1}
          </p>
          <ul className="space-y-3 pl-4 list-none text-xs md:text-sm font-serif">
            <li className="flex items-start gap-2">
              <span className="text-sorside-red mt-1">•</span>
              <span>{activeConfig.aboutSection4Bullet1 || DEFAULT_HOME_CONFIG.aboutSection4Bullet1}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sorside-red mt-1">•</span>
              <span>{activeConfig.aboutSection4Bullet2 || DEFAULT_HOME_CONFIG.aboutSection4Bullet2}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sorside-red mt-1">•</span>
              <span>{activeConfig.aboutSection4Bullet3 || DEFAULT_HOME_CONFIG.aboutSection4Bullet3}</span>
            </li>
          </ul>
          <p className="pt-2">
            {activeConfig.aboutSection4Text2 || DEFAULT_HOME_CONFIG.aboutSection4Text2}
          </p>
        </div>
      </section>

      {/* 6. THE PERSON BEHIND */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-t border-sorside-red/10 pt-12">
        <div className="md:col-span-4 space-y-4">
          <h2 className="text-xl md:text-2xl font-display font-bold uppercase tracking-tight">
            {activeConfig.aboutSection5Title || DEFAULT_HOME_CONFIG.aboutSection5Title}
          </h2>
          <p className={`text-xs font-mono leading-relaxed ${theme === "dark" ? "text-zinc-500" : "text-stone-500"}`}>
            {activeConfig.aboutSection5Tagline || DEFAULT_HOME_CONFIG.aboutSection5Tagline}
          </p>
        </div>

        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
          {/* Portrait Photo */}
          <div className="sm:col-span-5 relative aspect-[3/4] rounded-xl overflow-hidden border border-sorside-red/20 shadow-lg bg-zinc-950">
            <img
              src={activeConfig.aboutSection5CoverUrl || DEFAULT_HOME_CONFIG.aboutSection5CoverUrl}
              alt="The human behind sorside in shadow"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover grayscale brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50" />
          </div>

          {/* Description */}
          <div className={`sm:col-span-7 space-y-4 font-serif text-sm md:text-base leading-relaxed tracking-wide ${
            theme === "dark" ? "text-zinc-300" : "text-stone-700"
          }`}>
            <p>
              {activeConfig.aboutSection5Text1 || DEFAULT_HOME_CONFIG.aboutSection5Text1}
            </p>
            <p>
              {activeConfig.aboutSection5Text2 || DEFAULT_HOME_CONFIG.aboutSection5Text2}
            </p>
          </div>
        </div>
      </section>

      {/* 7. CLOSING MANIFESTO / QUOTE */}
      <section className="text-center py-16 border-t border-sorside-red/10 space-y-8">
        <div className="w-12 h-12 rounded-full border border-sorside-red/30 flex items-center justify-center mx-auto text-sorside-red glow-red-strong">
          <Quote size={18} className="fill-sorside-red" />
        </div>

        <div className="max-w-2xl mx-auto space-y-4">
          <p className="text-base md:text-xl font-serif leading-relaxed text-sorside-red">
            &ldquo;{activeConfig.aboutManifestoQuote || DEFAULT_HOME_CONFIG.aboutManifestoQuote}&rdquo;
          </p>
          <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-stone-500">
            — THE SORSIDE MANIFESTO
          </p>
        </div>

        <div className="pt-4">
          <button
            onClick={() => onTabClick("music")}
            className="px-6 py-2.5 bg-sorside-red text-white text-xs font-mono uppercase tracking-widest hover:bg-red-700 transition-all rounded shadow-md flex items-center justify-center gap-2 mx-auto group cursor-pointer"
          >
            <span>Dengarkan Rilisan sorside</span>
            <ArrowRight size={12} className="transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      </div>
    </motion.div>
  );
}
