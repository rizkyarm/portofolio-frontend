import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail, Phone, MapPin, Send,
  CheckCircle, AlertCircle,
  ArrowRight, Clock, MessageSquare,
} from 'lucide-react';
import api from '../services/api';
import { useDarkMode } from '../context/DarkModeContext';

/* ── Intersection Observer hook ── */
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.12 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, className = '', delay = 0 }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ── Data ── */
const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'rizki@portfolio.com',
    href: 'mailto:rizki@portfolio.com',
    color: '#6c5ce7',
    bg: 'bg-green-50',
    darkBg: 'bg-green-500/20',
  },
  {
    icon: Phone,
    label: 'WhatsApp',
    value: '+62 812 3456 7890',
    href: 'https://wa.me/6281234567890',
    color: '#00b894',
    bg: 'bg-emerald-50',
    darkBg: 'bg-emerald-500/20',
  },
  {
    icon: MapPin,
    label: 'Lokasi',
    value: 'Bandar Lampung, Lampung',
    href: 'https://maps.google.com',
    color: '#e84393',
    bg: 'bg-pink-50',
    darkBg: 'bg-pink-500/20',
  },
  {
    icon: Clock,
    label: 'Jam Kerja',
    value: 'Senin–Jumat, 09.00–18.00',
    href: null,
    color: '#f39c12',
    bg: 'bg-amber-50',
    darkBg: 'bg-amber-500/20',
  },
];

const socials = [];

const services = [
  'Web Development',
  'Android App',
  'UI/UX Design',
  'Video Editing',
  'API Backend',
  'Konsultasi IT',
];

const budgets = [
  '< Rp 1 Juta',
  'Rp 1–5 Juta',
  'Rp 5–15 Juta',
  '> Rp 15 Juta',
  'Diskusi dulu',
];

const faqs = [
  {
    q: 'Berapa lama respons setelah kirim pesan?',
    a: 'Biasanya dalam 24 jam di hari kerja. Untuk urusan mendesak yang memerlukan perbaikan sistem cepat, hubungi via WhatsApp.',
  },
  {
    q: 'Apakah bisa konsultasi teknis gratis dulu?',
    a: 'Ya! Saya menyediakan sesi diskusi awal untuk membahas arsitektur project, tech stack, dan kebutuhan UI/UX Anda.',
  },
  {
    q: 'Apakah bisa kerja remote?',
    a: 'Tentu. Hampir semua project pengembangan web dan aplikasi Android saya kerjakan secara remote dengan komunikasi via Zoom & WhatsApp.',
  },
];

/* ── Input Component ── */
function FormInput({ label, error, children, isDarkMode }) {
  return (
    <div className="flex flex-col">
      <label className={`block text-sm font-semibold mb-1.5 transition-colors ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
        {label}
      </label>
      {children}
      {error && (
        <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1 animate-pulse">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
    </div>
  );
}

/* ── FAQ Accordion Item ── */
function FaqItem({ faq, isDarkMode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
      open 
        ? (isDarkMode ? 'border-green-400 bg-green-900/20 shadow-md' : 'border-green-300 bg-green-50/50 shadow-md')
        : (isDarkMode ? 'border-slate-700 bg-slate-800 hover:border-green-400/50 hover:bg-slate-700/50' : 'border-slate-200 bg-white hover:border-green-200 hover:bg-slate-50')
    }`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left focus:outline-none"
      >
        <span className={`font-bold text-sm sm:text-base pr-4 transition-colors ${
          open 
            ? (isDarkMode ? 'text-green-300' : 'text-green-900') 
            : (isDarkMode ? 'text-slate-200' : 'text-slate-800')
        }`}>
          {faq.q}
        </span>
        <span
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
            open 
              ? 'bg-green-600 text-white rotate-180 shadow-md shadow-green-600/30' 
              : (isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500')
          }`}
        >
          {open ? '−' : '+'}
        </span>
      </button>
      <div 
        className={`px-6 overflow-hidden transition-all duration-500 ease-in-out ${open ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 pb-0 opacity-0'}`}
      >
        <div className={`text-sm sm:text-base leading-relaxed pt-2 border-t ${isDarkMode ? 'text-slate-400 border-green-800/50' : 'text-slate-600 border-green-100/50'}`}>
          {faq.a}
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function Contact() {
  const { isDarkMode } = useDarkMode();
  
  const [form, setForm] = useState({
    name: '', email: '', subject: '', service: '', budget: '', body: '',
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [activeTab, setActiveTab] = useState('form');

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Nama wajib diisi';
    if (!form.email.trim()) e.email = 'Email wajib diisi';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Format email tidak valid';
    if (!form.body.trim()) e.body = 'Pesan wajib diisi';
    else if (form.body.trim().length < 10) e.body = 'Pesan minimal 10 karakter';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setStatus('loading');
    try {
      await api.post('/messages', {
        name: form.name,
        email: form.email,
        subject: form.subject || form.service,
        body: form.body,
      });
      setStatus('success');
      setForm({ name: '', email: '', subject: '', service: '', budget: '', body: '' });
    } catch {
      setStatus('error');
    }
  };

  const inputClass = `w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all duration-300 shadow-sm ${
    isDarkMode 
      ? 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 hover:border-green-400 focus:bg-slate-800 focus:border-green-500 focus:ring-4 focus:ring-green-500/20'
      : 'bg-slate-50/50 border-slate-200 text-slate-800 placeholder-slate-400 hover:border-green-300 focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-600/10'
  }`;

  return (
    <div className={`overflow-x-hidden font-sans transition-colors duration-300 ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>

      {/* ══ HERO ══ */}
      <section className="relative bg-slate-900 overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-green-600/20 blur-[100px]" />
          <div className="absolute bottom-0 -left-16 w-80 h-80 rounded-full bg-blue-500/10 blur-[80px]" />
          <div
            className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-block text-xs font-bold text-green-200 uppercase tracking-widest bg-white/10 px-4 py-2 rounded-full mb-6 backdrop-blur-md border border-white/5 shadow-xl" style={{ animation: 'fadeUp 0.6s ease forwards' }}>
            Mari Berkolaborasi
          </div>
          <h1 className="font-bold text-white leading-tight mb-6 tracking-tight" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', animation: 'fadeUp 0.6s ease 0.1s forwards', opacity: 0 }}>
            Punya project <br /> <span className="text-green-400 bg-clip-text">inovatif</span> di pikiran?
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed" style={{ animation: 'fadeUp 0.6s ease 0.2s forwards', opacity: 0 }}>
            Ceritakan ide sistem atau desain yang ingin Anda bangun. Saya akan merespons dalam 24 jam dengan estimasi teknis, waktu, dan biaya yang transparan.
          </p>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-10" style={{ animation: 'fadeUp 0.6s ease 0.3s forwards', opacity: 0 }}>
            {[ { emoji: '⚡', text: 'Respons < 24 jam' }, { emoji: '🎯', text: 'Konsultasi Teknis' }, { emoji: '🌏', text: 'Remote-ready' } ].map((item) => (
              <div key={item.text} className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-sm text-slate-200 text-sm font-medium px-5 py-2.5 rounded-full border border-white/10 shadow-lg">
                <span>{item.emoji}</span> {item.text}
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes spin360 { to { transform: rotate(360deg); } }
        `}</style>
      </section>

      {/* ══ MAIN CONTENT ══ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">

          {/* ── LEFT — Contact Info ── */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <Reveal>
              <h2 className={`font-bold text-3xl tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Informasi Kontak
              </h2>
              <p className={`text-sm sm:text-base mt-2 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Pilih cara komunikasi yang paling efisien untuk mendiskusikan kebutuhan sistem Anda.
              </p>
            </Reveal>

            <div className="flex flex-col gap-4">
              {contactInfo.map((item, i) => (
                <Reveal key={item.label} delay={i * 80}>
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className={`flex items-center gap-5 p-4 sm:p-5 rounded-2xl border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer ${
                        isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-green-500/50' : 'bg-white border-slate-100 hover:border-green-200'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl ${isDarkMode ? item.darkBg : item.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                        <item.icon size={20} style={{ color: item.color }} />
                      </div>
                      <div className="flex-1">
                        <div className={`text-xs font-bold uppercase tracking-wider mb-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                          {item.label}
                        </div>
                        <div className={`text-sm font-semibold group-hover:text-green-500 transition-colors ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                          {item.value}
                        </div>
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        isDarkMode ? 'bg-slate-800 group-hover:bg-green-900/30' : 'bg-slate-50 group-hover:bg-green-50'
                      }`}>
                        <ArrowRight size={14} className={`transition-colors group-hover:translate-x-0.5 ${isDarkMode ? 'text-slate-500 group-hover:text-green-400' : 'text-slate-300 group-hover:text-green-600'}`} />
                      </div>
                    </a>
                  ) : (
                    <div className={`flex items-center gap-5 p-4 sm:p-5 rounded-2xl border shadow-sm ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                      <div className={`w-12 h-12 rounded-xl ${isDarkMode ? item.darkBg : item.bg} flex items-center justify-center flex-shrink-0`}>
                        <item.icon size={20} style={{ color: item.color }} />
                      </div>
                      <div>
                        <div className={`text-xs font-bold uppercase tracking-wider mb-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                          {item.label}
                        </div>
                        <div className={`text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                          {item.value}
                        </div>
                      </div>
                    </div>
                  )}
                </Reveal>
              ))}
            </div>

            <Reveal delay={250}>
              <div className="bg-slate-900 rounded-2xl p-5 flex items-center gap-4 shadow-xl shadow-slate-900/10 border border-slate-800">
                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center font-bold text-white text-lg shadow-inner">
                    RR
                  </div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse" />
                </div>
                <div>
                  <div className="text-white font-bold text-base">Rizki Aditiya Ramadan</div>
                  <div className="text-emerald-400 text-xs font-semibold mt-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full inline-block shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    Tersedia untuk project baru
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* ── RIGHT — Form ── */}
          <div className="lg:col-span-3">
            <Reveal>
              <div className={`flex gap-2 mb-8 p-1.5 rounded-xl w-fit mx-auto lg:mx-0 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-200/50'}`}>
                {[
                  { key: 'form', label: '✉️  Form Pesan' },
                  { key: 'faq',  label: '💬  Q&A' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                      activeTab === tab.key
                        ? (isDarkMode ? 'bg-slate-700 text-green-300 shadow-sm ring-1 ring-slate-600' : 'bg-white text-green-700 shadow-sm ring-1 ring-slate-200/50')
                        : (isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-700/50' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50')
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </Reveal>

            {/* ── FORM TAB ── */}
            {activeTab === 'form' && (
              <Reveal>
                {status === 'success' ? (
                  <div className={`rounded-3xl border p-8 sm:p-14 text-center transform transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800 shadow-2xl shadow-black/40' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/20'}`}>
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
                      <CheckCircle size={48} className="text-emerald-500" />
                    </div>
                    <h3 className={`font-bold text-3xl mb-4 tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      Pesan Terkirim! 🎉
                    </h3>
                    <p className={`text-base leading-relaxed mb-8 max-w-sm mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Terima kasih sudah menghubungi saya! Saya akan meninjau detail project Anda dan membalas dalam <strong className={isDarkMode ? 'text-slate-200' : 'text-slate-800'}>24 jam</strong>.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <button onClick={() => setStatus('idle')} className="px-8 py-3.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all duration-300 text-sm active:scale-95">
                        Kirim Pesan Lain
                      </button>
                      <Link to="/projects" className={`px-8 py-3.5 border font-bold rounded-xl transition-all duration-300 text-sm active:scale-95 ${isDarkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                        Lihat Portofolio
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className={`rounded-3xl border p-6 sm:p-10 ${isDarkMode ? 'bg-slate-900 border-slate-800 shadow-2xl shadow-black/40' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/20'}`}>
                    <div className="mb-8">
                      <h3 className={`font-bold text-2xl tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        Detail Project
                      </h3>
                      <p className={`text-sm mt-2 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Mohon isi form berikut se-detail mungkin agar arsitektur dan estimasi sesuai dengan kebutuhan.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} noValidate>
                      <div className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <FormInput label="Nama Lengkap *" error={errors.name} isDarkMode={isDarkMode}>
                            <input type="text" placeholder="John Doe" value={form.name} onChange={update('name')} className={`${inputClass} ${errors.name ? 'border-red-400 ring-4 ring-red-400/10 bg-red-50/10' : ''}`} />
                          </FormInput>
                          <FormInput label="Email Profesional *" error={errors.email} isDarkMode={isDarkMode}>
                            <input type="email" placeholder="john@company.com" value={form.email} onChange={update('email')} className={`${inputClass} ${errors.email ? 'border-red-400 ring-4 ring-red-400/10 bg-red-50/10' : ''}`} />
                          </FormInput>
                        </div>

                        <FormInput label="Subjek / Nama Project" isDarkMode={isDarkMode}>
                          <input type="text" placeholder="Misal: Redesign Website Perusahaan" value={form.subject} onChange={update('subject')} className={inputClass} />
                        </FormInput>

                        <FormInput label="Fokus Layanan Utama" isDarkMode={isDarkMode}>
                          <div className="flex flex-wrap gap-2.5 mt-1">
                            {services.map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => setForm((p) => ({ ...p, service: s }))}
                                className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-300 ${
                                  form.service === s
                                    ? 'bg-green-600 text-white border-green-600 shadow-md shadow-green-600/20'
                                    : (isDarkMode ? 'bg-slate-800 text-slate-300 border-slate-700 hover:border-green-500 hover:text-green-300' : 'bg-white text-slate-600 border-slate-200 hover:border-green-400 hover:text-green-700 hover:bg-green-50')
                                }`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </FormInput>

                        <FormInput label="Estimasi Anggaran" isDarkMode={isDarkMode}>
                          <div className="flex flex-wrap gap-2.5 mt-1">
                            {budgets.map((b) => (
                              <button
                                key={b}
                                type="button"
                                onClick={() => setForm((p) => ({ ...p, budget: b }))}
                                className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-300 ${
                                  form.budget === b
                                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20'
                                    : (isDarkMode ? 'bg-slate-800 text-slate-300 border-slate-700 hover:border-emerald-500 hover:text-emerald-300' : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-400 hover:text-emerald-700 hover:bg-emerald-50')
                                }`}
                              >
                                {b}
                              </button>
                            ))}
                          </div>
                        </FormInput>

                        <FormInput label="Deskripsi Project *" error={errors.body} isDarkMode={isDarkMode}>
                          <textarea rows={5} placeholder="Jelaskan kebutuhan fungsionalitas, target pengguna, referensi desain, dan tenggat waktu yang diharapkan..." value={form.body} onChange={update('body')} className={`${inputClass} resize-y min-h-[120px] ${errors.body ? 'border-red-400 ring-4 ring-red-400/10 bg-red-50/10' : ''}`} />
                          <div className={`text-right text-xs font-medium mt-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            {form.body.length} karakter
                          </div>
                        </FormInput>

                        {status === 'error' && (
                          <div className={`flex items-center gap-3 text-sm font-medium px-5 py-4 rounded-xl border shadow-sm animate-pulse ${isDarkMode ? 'bg-red-900/20 text-red-400 border-red-800' : 'bg-red-50 text-red-700 border-red-200'}`}>
                            <AlertCircle size={18} className="flex-shrink-0" />
                            Sistem gagal mengirim pesan. Silakan coba kembali atau hubungi via WhatsApp.
                          </div>
                        )}

                        <button type="submit" disabled={status === 'loading'} className="w-full flex items-center justify-center gap-3 py-4 mt-2 bg-green-600 text-white font-bold text-base rounded-xl hover:bg-green-700 hover:shadow-xl hover:shadow-green-600/20 disabled:opacity-70 disabled:cursor-wait transition-all duration-300 active:scale-[0.98]">
                          {status === 'loading' ? (
                            <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" style={{ animation: 'spin360 0.8s linear infinite' }} /> Memproses...</>
                          ) : (
                            <><Send size={18} /> Kirim Permintaan</>
                          )}
                        </button>

                        <p className={`text-xs text-center font-medium leading-relaxed px-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                          Dengan menekan tombol kirim, Anda menyetujui balasan komunikasi ke alamat email yang dicantumkan.
                        </p>
                      </div>
                    </form>
                  </div>
                )}
              </Reveal>
            )}

            {/* ── FAQ TAB ── */}
            {activeTab === 'faq' && (
              <Reveal>
                <div className={`rounded-3xl border p-6 sm:p-10 ${isDarkMode ? 'bg-slate-900 border-slate-800 shadow-2xl shadow-black/40' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/20'}`}>
                  <div className="mb-8">
                    <h3 className={`font-bold text-2xl tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      Pertanyaan Seputar Layanan
                    </h3>
                    <p className={`text-sm mt-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Informasi umum mengenai teknis kolaborasi dan *workflow*.
                    </p>
                  </div>

                  <div className="flex flex-col gap-4">
                    {faqs.map((faq, i) => (
                      <FaqItem key={i} faq={faq} isDarkMode={isDarkMode} />
                    ))}
                  </div>

                  <div className={`mt-10 rounded-2xl p-6 sm:p-8 text-center border ${isDarkMode ? 'bg-green-900/10 border-green-800' : 'bg-green-50 border-green-100'}`}>
                    <p className={`font-bold text-base mb-4 ${isDarkMode ? 'text-green-300' : 'text-green-900'}`}>
                      Ada pertanyaan spesifik tentang arsitektur sistem Anda?
                    </p>
                    <button onClick={() => setActiveTab('form')} className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/20 transition-all duration-300 active:scale-95">
                      Mulai Diskusi <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* ══ MAP / LOCATION BANNER ══ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <Reveal>
          <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/20 border border-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative h-64 md:h-auto bg-slate-800 overflow-hidden group">
                <div className="absolute inset-0 opacity-20 transition-opacity duration-700 group-hover:opacity-40" style={{ backgroundImage: 'radial-gradient(circle, #8b5cf6 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                  <div className="relative w-full max-w-full h-full md:h-full bg-slate-800 overflow-hidden group rounded-3xl border border-slate-700/50 shadow-2xl">
                    <iframe
                      title="Peta Bandar Lampung"
                      src="https://maps.google.com/maps?q=Bandar%20Lampung,%20Indonesia&t=&z=13&ie=UTF8&iwloc=&output=embed"
                      className="absolute inset-0 w-full h-full border-0 filter grayscale invert contrast-80 opacity-50 group-hover:opacity-80 transition-opacity duration-700 pointer-events-auto"
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>

                    {/* Overlay UI */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-950/60 group-hover:bg-slate-950/20 transition-colors duration-700 pointer-events-none">
                      
                      <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)] group-hover:-translate-y-4 group-hover:scale-110 transition-all duration-500">
                        <MapPin size={28} className="text-slate-950" />
                      </div>
                      
                      <div className="text-center backdrop-blur-md bg-slate-900/70 px-6 py-3 rounded-2xl border border-slate-700/50 shadow-xl group-hover:opacity-0 transition-opacity duration-500">
                        <div className="text-white font-bold text-lg">Bandar Lampung, Indonesia</div>
                        <div className="text-emerald-400 font-mono text-sm mt-1.5 tracking-wider">-5.4297° S, 105.2642° E</div>
                      </div>

                    </div>
                  </div>
                </div>
              <div className="p-8 sm:p-12 flex flex-col justify-center">
                <div className="text-xs font-bold text-green-400 uppercase tracking-widest mb-4">
                  Basis Operasional
                </div>
                <h3 className="font-bold text-white text-3xl mb-4 leading-tight">
                  Bandar Lampung, <br />Lampung 🇮🇩
                </h3>
                <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-8">
                  Berpengalaman menangani implementasi sistem dan desain arsitektur lintas area. Sepenuhnya adaptif untuk pengerjaan jarak jauh secara kolaboratif.
                </p>
                <div className="flex flex-col gap-3">
                  {[ '✅  Adaptif untuk Remote / Hybrid Workflow', '✅  Koordinasi via Meet / Zoom / Discord', '✅  Beroperasi di Zona Waktu WIB (UTC+7)' ].map((item) => (
                    <div key={item} className="text-sm font-medium text-slate-300 flex items-center bg-white/5 w-fit px-4 py-2 rounded-lg border border-white/5">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

    </div>
  );
}