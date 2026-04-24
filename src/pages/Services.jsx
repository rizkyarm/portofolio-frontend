import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Monitor, Smartphone, Video, Palette, Code, Layers } from 'lucide-react';
import { useDarkMode } from '../context/DarkModeContext';
import api from '../services/api';

const iconMap = {
  monitor:    Monitor,
  smartphone: Smartphone,
  video:      Video,
  palette:    Palette,
  code:       Code,
  layers:     Layers,
};

const dummyServices = [];

const processSteps = [
  {
    num: '01',
    title: 'Diskusi & Brief',
    desc: 'Kita mulai dengan diskusi mendalam tentang kebutuhan, tujuan, dan ekspektasi project kamu.',
  },
  {
    num: '02',
    title: 'Proposal & Quote',
    desc: 'Saya kirim proposal detail berisi scope pekerjaan, timeline, dan estimasi biaya yang transparan.',
  },
  {
    num: '03',
    title: 'Design & Development',
    desc: 'Proses pengerjaan dimulai dengan update progress berkala. Kamu bisa review setiap milestone.',
  },
  {
    num: '04',
    title: 'Revisi & Deliver',
    desc: 'Finalisasi berdasarkan feedback, testing menyeluruh, lalu handoff file atau deploy ke production.',
  },
];

export default function Services() {
  const { isDarkMode } = useDarkMode();
  const [services, setServices]   = useState([]);
  const [loading,  setLoading]    = useState(true);

  useEffect(() => {
    api.get('/services')
      .then((res) => {
        const data = res.data.data || res.data;
        setServices(data.length > 0 ? data : dummyServices);
      })
      .catch(() => setServices(dummyServices))
      .finally(() => setLoading(false));
  }, []);

  const displayServices = loading ? [] : services;

  return (
    <div className={isDarkMode ? 'bg-gray-900' : 'bg-white'}>

      {/* ── HERO ── */}
      <section className={`py-20 ${isDarkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-purple-50 via-white to-blue-50'}`}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className={`inline-block text-xs font-semibold text-green-600 uppercase tracking-widest px-3 py-1.5 rounded-full mb-4 ${
            isDarkMode ? 'bg-brand-purple/20' : 'bg-brand-pale'
          }`}>
            What I Offer
          </div>
          <h1 className={`font-sora font-bold text-5xl mb-5 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Services
          </h1>
          <p className={`text-lg max-w-xl mx-auto leading-relaxed ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Dari desain hingga deployment — saya menawarkan solusi digital
            lengkap yang disesuaikan dengan kebutuhan dan budget kamu.
          </p>
        </div>
      </section>

      {/* ── SERVICES GRID ── */}
      <section className={`max-w-6xl mx-auto px-6 py-20 ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      }`}>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={`rounded-2xl h-72 animate-pulse ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
              }`} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayServices.map((service) => {
              const IconComponent = iconMap[service.icon] || Layers;
              const isFeatured    = service.featured || false;
              const includes      = service.includes || [];

              return (
                <div
                  key={service.id}
                  className={`relative rounded-2xl border overflow-hidden hover:shadow-lg transition-all group ${
                    isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-green-800' : 'bg-white border-gray-100'
                  } ${
                    isFeatured
                      ? isDarkMode
                        ? 'ring-2 ring-green-600 ring-offset-2 ring-offset-green-600 border-green-600'
                        : 'border-green-600 ring-2 ring-green-600 ring-offset-2'
                      : ''
                  }`}
                >
                  {/* Featured badge */}
                  {isFeatured && (
                    <div className="absolute top-4 right-4 bg-green-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      Most Popular
                    </div>
                  )}

                  {/* Top gradient bar */}
                  <div className={`h-2 w-full bg-gradient-to-r ${service.color || 'from-green-600 to-green-400'}`} />

                  <div className="p-6">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl ${service.bgLight || 'bg-brand-pale'} flex items-center justify-center mb-4`}>
                      <IconComponent
                        size={22}
                        className={service.textColor || 'text-green-600'}
                      />
                    </div>

                  {/* Title & price */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className={`font-sora font-bold text-lg leading-tight ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {service.title}
                      </h3>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${
                        isDarkMode ? 'text-green-600 bg-green-600/20' : 'text-green-600 bg-green-100'
                      }`}>
                        {service.price_range}
                      </span>
                    </div>

                    {/* Description */}
                    <p className={`text-sm leading-relaxed mb-5 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-400'
                    }`}>
                      {service.description}
                    </p>

                    {/* Includes list */}
                    <ul className="flex flex-col gap-2 mb-6">
                      {includes.slice(0, 5).map((item) => (
                        <li
                          key={item}
                          className={`flex items-center gap-2 text-sm ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}
                        >
                          <CheckCircle
                            size={14}
                            className="text-green-500 flex-shrink-0"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <Link
                      to="/contact"
                      className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        isFeatured
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : isDarkMode
                          ? 'border border-gray-600 text-gray-300 hover:border-green-600 hover:text-green-600'
                          : 'border border-gray-200 text-gray-700 hover:border-green-600 hover:text-green-600'
                      }`}
                    >
                      Discuss Project
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── PROCESS ── */}
      <section className={`py-20 ${
        isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
      }`}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-xs font-semibold text-green-600 uppercase tracking-widest mb-2">
              How It Works
            </div>
            <h2 className={`font-sora font-bold text-4xl ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Cara Kerja Saya
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {processSteps.map((step, idx) => (
              <div key={step.num} className="relative">
                {/* Connector line */}
                {idx < processSteps.length - 1 && (
                  <div className={`hidden md:block absolute top-8 left-full w-full h-px z-0 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`} />
                )}

                <div className={`relative z-10 rounded-2xl p-6 border hover:shadow-md transition-shadow ${
                  isDarkMode 
                    ? 'bg-gray-900 border-gray-700 hover:border-green-800' 
                    : 'bg-white border-gray-100'
                }`}>
                  <div className="font-sora font-bold text-3xl text-green-600 mb-4">
                    {step.num}
                  </div>
                  <h3 className={`font-sora font-bold mb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {step.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-400'
                  }`}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className={`max-w-3xl mx-auto px-6 py-20 ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      }`}>
        <div className="text-center mb-12">
          <div className="text-xs font-semibold text-green-600 uppercase tracking-widest mb-2">
            FAQ
          </div>
          <h2 className={`font-sora font-bold text-4xl ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Pertanyaan Umum
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq) => (
            <FaqItem key={faq.q} faq={faq} isDarkMode={isDarkMode} />
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={isDarkMode ? 'bg-gray-800 py-20' : 'bg-brand-navy py-20'}>
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-sora font-bold text-4xl text-white mb-4">
            Siap memulai project?
          </h2>
          <p className={`mb-8 leading-relaxed ${
            isDarkMode ? 'text-gray-400' : 'text-slate-400'
          }`}>
            Ceritakan kebutuhan kamu dan saya akan balas dalam 24 jam
            dengan estimasi waktu dan biaya yang transparan.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors text-lg"
          >
            Hubungi Saya
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

    </div>
  );
}

/* ── FAQ Item Component ── */
function FaqItem({ faq, isDarkMode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`rounded-2xl border overflow-hidden ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
    }`}>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between p-5 text-left transition-colors ${
          isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
        }`}
      >
        <span className={`font-semibold pr-4 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>{faq.q}</span>
        <span className={`text-xl flex-shrink-0 transition-transform duration-200 ${
          open ? 'rotate-45' : ''
        } text-green-600`}>
          +
        </span>
      </button>
      {open && (
        <div className={`px-5 pb-5 text-sm leading-relaxed border-t pt-4 ${
          isDarkMode 
            ? 'text-gray-400 border-gray-700' 
            : 'text-gray-500 border-gray-50'
        }`}>
          {faq.a}
        </div>
      )}
    </div>
  );
}

const faqs = [
  {
    q: 'Berapa lama waktu pengerjaan satu project?',
    a: 'Tergantung kompleksitas — landing page sederhana 3-7 hari, web app penuh 2-6 minggu, mobile app 4-8 minggu. Timeline detail akan tercantum di proposal.',
  },
  {
    q: 'Apakah tersedia cicilan pembayaran?',
    a: 'Ya, saya menggunakan sistem DP 50% di awal dan 50% setelah project selesai. Untuk project besar bisa dibagi 3 termin.',
  },
  {
    q: 'Apakah ada garansi setelah project selesai?',
    a: 'Tersedia masa garansi bug-free 30 hari setelah delivery. Untuk paket Full-Stack Development sudah termasuk maintenance 3 bulan.',
  },
  {
    q: 'Teknologi apa yang kamu gunakan?',
    a: 'Frontend: React, Tailwind CSS. Mobile: Flutter, Firebase. Backend: Laravel, MySQL, Node.js. Video: Adobe Premiere Pro, After Effects.',
  },
  {
    q: 'Bagaimana cara memulai kerja sama?',
    a: 'Cukup isi form di halaman Contact atau hubungi langsung via WhatsApp/email. Kita akan jadwalkan sesi diskusi gratis 30 menit.',
  },
];