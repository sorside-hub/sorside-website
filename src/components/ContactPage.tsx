import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Mail, 
  Instagram, 
  Youtube, 
  Radio, 
  Send, 
  CheckCircle,
  Briefcase,
  Music,
  ArrowRight
} from "lucide-react";
import { HomeConfig } from "../lib/homeConfig";
import { ContactMessage } from "../types";

interface ContactPageProps {
  theme: "dark" | "light";
  config: HomeConfig;
  onSubmitMessage: (message: Omit<ContactMessage, "id" | "timestamp" | "isRead">) => Promise<boolean>;
}

export default function ContactPage({ theme, config, onSubmitMessage }: ContactPageProps) {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;

    if (honeypot) {
      setIsSubmitted(true);
      setFormState({ name: "", email: "", subject: "", message: "" });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await fetch("https://formsubmit.co/ajax/5faaee5641392a959a4438533dc898e0", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: formState.name.trim(),
          email: formState.email.trim(),
          subject: formState.subject.trim() || "Pesan Baru dari Sorside Website",
          message: formState.message.trim(),
          _honey: honeypot,
          _captcha: "false"
        })
      });

      if (response.ok) {
        await onSubmitMessage({
          name: formState.name.trim(),
          email: formState.email.trim(),
          subject: formState.subject.trim() || undefined,
          message: formState.message.trim()
        });
        setIsSubmitted(true);
        setFormState({ name: "", email: "", subject: "", message: "" });
        setHoneypot("");
      } else {
        alert("Gagal mengirim pesan. Silakan coba lagi.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat mengirim pesan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5 }}
      className="space-y-16 md:space-y-24 max-w-4xl mx-auto py-6"
    >
      {/* 1. HERO SECTION */}
      <section className="text-center space-y-3 py-10 md:py-16 relative overflow-hidden rounded-3xl border border-sorside-red/10 bg-stone-950 text-white shadow-2xl px-6">
        {/* Hero Image Accent Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-35 transition-opacity duration-700 pointer-events-none scale-105"
          style={{ backgroundImage: `url('/images/hero-bg.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/50 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(181,5,3,0.1),transparent_70%)] pointer-events-none" />
        
        <div className="relative z-10 space-y-3">
          <span className="text-xs font-mono tracking-[0.4em] text-sorside-red uppercase font-semibold block">
            {config.contactSubtitle || "SISI HUBUNGAN // CHANNELS"}
          </span>
          
          <h1 className="text-4xl md:text-6xl font-display font-extrabold tracking-tight uppercase">
            CONTACT
          </h1>
        </div>
      </section>

      {/* 2. CONTACT INFO & 3. CONTACT FORM */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start border-t border-sorside-red/10 pt-12 text-left">
        
        {/* Left Side: Contact Information */}
        <div className="lg:col-span-5 space-y-10">
          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-display font-bold uppercase tracking-tight">
              Mari Bersua
            </h2>
            <p className="text-xs font-mono text-stone-500">
              Saluran resmi untuk bertukar pikiran.
            </p>
          </div>

          <div className="space-y-6">
            {/* Email Channel */}
            <div className={`p-5 rounded-2xl border transition-all duration-300 ${
              theme === "dark" ? "bg-zinc-950/20 border-zinc-900/60 hover:border-sorside-red/20" : "bg-white border-stone-200/80 shadow-sm hover:border-sorside-red/10"
            }`}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full border border-sorside-red/20 flex items-center justify-center text-sorside-red">
                  <Mail size={16} />
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase text-stone-500 block">EMAIL UTAMA</span>
                  <a 
                    href={`mailto:${config.contactEmail || "sorside.raw@gmail.com"}`} 
                    className={`text-sm font-semibold hover:text-sorside-red transition-colors ${
                      theme === "dark" ? "text-white" : "text-stone-900"
                    }`}
                  >
                    {config.contactEmail || "sorside.raw@gmail.com"}
                  </a>
                </div>
              </div>
            </div>

            {/* Social Channels */}
            <div className={`p-5 rounded-2xl border transition-all duration-300 ${
              theme === "dark" ? "bg-zinc-950/20 border-zinc-900/60" : "bg-white border-stone-200/80 shadow-sm"
            }`}>
              <span className="text-[9px] font-mono uppercase text-stone-500 block mb-4">MEDIA SOSIAL & LAYANAN MUSIK</span>
              
              <div className="grid grid-cols-2 gap-4">
                {config.contactInstagram !== "" && (
                  <a 
                    href={config.contactInstagram || "https://www.instagram.com/sor.side"} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 text-xs font-mono text-stone-500 hover:text-sorside-red transition-colors group"
                  >
                    <Instagram size={14} className="group-hover:scale-110 transition-transform" />
                    <span>Instagram</span>
                  </a>
                )}
                
                {config.contactTiktok !== "" && (
                  <a 
                    href={config.contactTiktok || "https://www.tiktok.com/@sor.side"} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 text-xs font-mono text-stone-500 hover:text-sorside-red transition-colors group"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-3.5 h-3.5 group-hover:scale-110 transition-transform"
                    >
                      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                    </svg>
                    <span>TikTok</span>
                  </a>
                )}

                {config.contactYoutube !== "" && (
                  <a 
                    href={config.contactYoutube || "https://youtube.com/@sorside"} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 text-xs font-mono text-stone-500 hover:text-sorside-red transition-colors group"
                  >
                    <Youtube size={14} className="group-hover:scale-110 transition-transform" />
                    <span>YouTube</span>
                  </a>
                )}

                {config.contactSpotify !== "" && (
                  <a 
                    href={config.contactSpotify || "https://spotify.com"} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 text-xs font-mono text-stone-500 hover:text-sorside-red transition-colors group"
                  >
                    <Radio size={14} className="group-hover:scale-110 transition-transform" />
                    <span>Spotify</span>
                  </a>
                )}

                {config.contactAppleMusic !== "" && (
                  <a 
                    href={config.contactAppleMusic || "https://music.apple.com"} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 text-xs font-mono text-stone-500 hover:text-sorside-red transition-colors group"
                  >
                    <Music size={14} className="group-hover:scale-110 transition-transform" />
                    <span>Apple Music</span>
                  </a>
                )}
              </div>
            </div>



          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div className="lg:col-span-7">
          <div className={`p-6 md:p-8 rounded-3xl border ${
            theme === "dark" ? "bg-zinc-950/40 border-zinc-900/80" : "bg-white border-stone-200 shadow-sm"
          }`}>
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form 
                  key="contact-form"
                  action="https://formsubmit.co/5faaee5641392a959a4438533dc898e0"
                  method="POST"
                  onSubmit={handleSubmit} 
                  className="space-y-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Honeypot field tersembunyi untuk keamanan anti-bot */}
                  <input 
                    type="text" 
                    name="_honey" 
                    value={honeypot} 
                    onChange={(e) => setHoneypot(e.target.value)} 
                    style={{ display: 'none' }} 
                    tabIndex={-1} 
                    autoComplete="off" 
                  />

                  {/* Nonaktifkan reCAPTCHA bawaan FormSubmit */}
                  <input type="hidden" name="_captcha" value="false" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-stone-500 block">Nama *</label>
                      <input 
                        type="text" 
                        name="name"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
                        className={`w-full px-4 py-3 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-sorside-red ${
                          theme === "dark" 
                            ? "bg-zinc-950/50 border-zinc-900 text-white focus:border-sorside-red" 
                            : "bg-stone-50 border-stone-200 text-stone-900 focus:border-sorside-red"
                        }`}
                        placeholder="Nama kamu"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-stone-500 block">Surel *</label>
                      <input 
                        type="email" 
                        name="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
                        className={`w-full px-4 py-3 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-sorside-red ${
                          theme === "dark" 
                            ? "bg-zinc-950/50 border-zinc-900 text-white focus:border-sorside-red" 
                            : "bg-stone-50 border-stone-200 text-stone-900 focus:border-sorside-red"
                        }`}
                        placeholder="surelmu@domain.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-stone-500 block">Subjek</label>
                    <input 
                      type="text" 
                      name="subject"
                      value={formState.subject}
                      onChange={(e) => setFormState(prev => ({ ...prev, subject: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-sorside-red ${
                        theme === "dark" 
                          ? "bg-zinc-950/50 border-zinc-900 text-white focus:border-sorside-red" 
                          : "bg-stone-50 border-stone-200 text-stone-900 focus:border-sorside-red"
                      }`}
                      placeholder="Peluang kolaborasi / Sekadar menyapa"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-stone-500 block">Pesan *</label>
                    <textarea 
                      name="message"
                      required
                      rows={5}
                      value={formState.message}
                      onChange={(e) => setFormState(prev => ({ ...prev, message: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-sorside-red resize-none ${
                        theme === "dark" 
                          ? "bg-zinc-950/50 border-zinc-900 text-white focus:border-sorside-red" 
                          : "bg-stone-50 border-stone-200 text-stone-900 focus:border-sorside-red"
                      }`}
                      placeholder="Tulis pesan atau ceritamu di sini..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-sorside-red hover:bg-red-700 text-white text-xs font-mono uppercase tracking-widest rounded-lg transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Mengirim Pesan...</span>
                      </>
                    ) : (
                      <>
                        <Send size={12} />
                        <span>Kirim Pesan</span>
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.div 
                  key="success"
                  className="py-12 text-center space-y-4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="w-12 h-12 rounded-full bg-sorside-red/10 border border-sorside-red/30 flex items-center justify-center text-sorside-red mx-auto glow-red">
                    <CheckCircle size={22} />
                  </div>
                  <h3 className={`text-lg font-serif font-bold ${theme === "dark" ? "text-white" : "text-stone-900"}`}>
                    Pesan Terkirim
                  </h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
                    Terima kasih telah menyapa sorside. Cerita dan pesan batinmu telah kami simpan di laci kamar bedroom studio kami. Kami akan merespons secepatnya.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-xs font-mono uppercase tracking-widest text-sorside-red font-bold hover:underline cursor-pointer"
                  >
                    Kirim Pesan Lain
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </section>

      {/* 4. CLOSING STATEMENT */}
      <section className="text-center py-12 border-t border-sorside-red/10 space-y-4">
        <p className="text-base md:text-xl font-serif leading-relaxed text-sorside-red">
          &ldquo;Setiap obrolan selalu berawal dari sebuah langkah kecil. Terima kasih telah menyempatkan singgah.&rdquo;
        </p>
        <p className="text-[9px] font-mono tracking-[0.3em] uppercase text-stone-500">
          — SORSIDE CHANNELS
        </p>
      </section>

    </motion.div>
  );
}
