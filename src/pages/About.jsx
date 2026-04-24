import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, MapPin, Mail, Phone,
  Download, Calendar, Award, Coffee,
} from 'lucide-react';
import api from '../services/api';
import { useDarkMode } from '../context/DarkModeContext';

/* ── Kategori config ── */
const CATEGORIES = [
  { key: 'frontend', label: 'Frontend', color: '#6c5ce7', bg: 'bg-purple-50' },
  { key: 'mobile',   label: 'Mobile',   color: '#e84393', bg: 'bg-pink-50' },
  { key: 'backend',  label: 'Backend',  color: '#00b894', bg: 'bg-emerald-50' },
  { key: 'creative', label: 'Creative', color: '#f39c12', bg: 'bg-amber-50' },
];

/* ── Intersection Observer hook untuk scroll reveal ── */
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

/* ── Data Statis ── */
const experiences = [];

const values = [
  {
    emoji: '🎯',
    title: 'Detail-Oriented',
    desc: 'Setiap pixel punya tujuan. Saya percaya desain yang baik lahir dari perhatian pada hal-hal kecil.',
  },
  {
    emoji: '🚀',
    title: 'Fast Learner',
    desc: 'Teknologi bergerak cepat — saya selalu update dengan tools dan framework terbaru.',
  },
  {
    emoji: '🤝',
    title: 'Collaborative',
    desc: 'Project terbaik lahir dari kolaborasi yang baik. Komunikasi terbuka adalah kunci.',
  },
  {
    emoji: '✨',
    title: 'Quality First',
    desc: 'Tidak ada kompromi untuk kualitas. Setiap deliverable harus melampaui ekspektasi klien.',
  },
];

/* ── Skill Bar Component ── */
function SkillBar({ name, level, color, delay, isDarkMode }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className="mb-3">
      <div className="flex justify-between items-center mb-1.5">
        <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{name}</span>
        <span className={`text-xs font-semibold ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{level}%</span>
      </div>
      <div className={`h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-full overflow-hidden`}>
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: visible ? `${level}%` : '0%',
            background: color,
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
    </div>
  );
}

/* ── Reveal Section Component ── */
function Reveal({ children, className = '', delay = 0 }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.6s ease, transform 0.6s ease`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ── Main Component ── */
export default function About() {
  const { isDarkMode } = useDarkMode();
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ── Ambil Data dari API ── */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [profileRes, skillsRes] = await Promise.all([
          api.get('/profile'),
          api.get('/skills')
        ]);

        const profileData = profileRes.data.data || profileRes.data;
        
        // PERBAIKAN 1: Fallback ke Object {} bukan Array []
        const parsedStats = typeof profileData.stats === 'string' 
          ? JSON.parse(profileData.stats) 
          : (profileData.stats || {});
          
        setProfile({ ...profileData, stats: parsedStats });

        const skillsData = skillsRes.data.data || skillsRes.data || [];
        setSkills(skillsData);

      } catch (error) {
        console.error("Gagal mengambil data dari server:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  
  const names = profile?.name ? profile.name.split(' ') : ['Admin', 'Portfolio'];
  const firstName = names[0];
  const lastName = names.slice(1).join(' ');
  const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();

  const rawStats = profile?.stats || {};
  const displayStats = [
    { icon: Award,    num: `${rawStats.projects || 0}+`,  label: 'Projects Completed' },
    { icon: Coffee,   num: `${rawStats.coffee || 0}+`,    label: 'Cups of Coffee' },
    { icon: Calendar, num: `${rawStats.experience || 0}`, label: 'Years Experience' },
    { icon: Award,    num: `${rawStats.clients || 0}`,    label: 'Happy Clients' },
  ];

  const groupedSkills = CATEGORIES.map(cat => ({
    category: cat.label,
    color: cat.color,
    bg: cat.bg,
    skills: skills.filter(s => s.category === cat.key)
  })).filter(group => group.skills.length > 0);


  return (
    <div className="overflow-x-hidden">

      {/* ══ HERO ══ */}
      <section className={`relative ${isDarkMode ? 'bg-gray-900' : 'bg-brand-navy'} min-h-screen flex items-center overflow-hidden`}>

        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-green-500 opacity-10 blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-72 h-72 rounded-full bg-green-100 opacity-10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-white opacity-5" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Left */}
          <div>
            <div
              className="inline-block text-xs font-semibold text-green-400 uppercase tracking-widest bg-white/10 px-3 py-1.5 rounded-full mb-6"
              style={{ animation: 'fadeInUp 0.6s ease forwards' }}
            >
              About Me
            </div>

            <h1
              className="font-sora font-bold text-white leading-tight mb-6"
              style={{
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                animation: 'fadeInUp 0.6s ease 0.1s forwards',
                opacity: 0,
              }}
            >
              Halo, Saya
              <br />
              <span className="text-green-500">{firstName}</span>
              <br />
              <span className={isDarkMode ? 'text-gray-400' : 'text-white/60'}>{lastName}.</span>
            </h1>

            <p
              className={`${isDarkMode ? 'text-gray-400' : 'text-slate-400'} text-lg leading-relaxed mb-8 max-w-md`}
              style={{ animation: 'fadeInUp 0.6s ease 0.2s forwards', opacity: 0 }}
            >
              {profile?.bio || "Seorang creative developer yang percaya bahwa teknologi dan seni bisa bersatu menciptakan pengalaman digital yang bermakna."}
            </p>

            <div
              className="flex flex-wrap gap-4"
              style={{ animation: 'fadeInUp 0.6s ease 0.3s forwards', opacity: 0 }}
            >
              {profile?.cv_url && (
                <a
                  href={profile.cv_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors"
                >
                  <Download size={16} />
                  Download CV
                </a>
              )}
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
              >
                Hire Me
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Right — profile card */}
          <div
            className="flex justify-center"
            style={{ animation: 'fadeInUp 0.6s ease 0.2s forwards', opacity: 0 }}
          >
            <div className="relative">

              {/* Main card */}
              <div className={`w-72 ${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/5 border-white/10'} backdrop-blur-sm border rounded-3xl p-8 text-center`}>

                {/* Avatar */}
                {profile?.avatar ? (
                  <img 
                    src={profile.avatar} 
                    alt={profile.name} 
                    className="w-24 h-24 rounded-2xl mx-auto mb-5 object-cover" 
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-green-500 to-green-300 mx-auto mb-5 flex items-center justify-center font-sora font-bold text-white text-3xl">
                    {initials}
                  </div>
                )}

                <h3 className="font-sora font-bold text-white text-xl mb-1">
                  {profile?.name}
                </h3>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-slate-400'} text-sm mb-5`}>
                  {profile?.tagline}
                </p>

                {/* Contact */}
                <div className="flex flex-col gap-2.5 text-left">
                  {[
                    { icon: MapPin, text: profile?.location || 'Lokasi belum diset' },
                    { icon: Mail,   text: profile?.email || 'Email belum diset' },
                    { icon: Phone,  text: profile?.phone || 'Telepon belum diset' },
                  ].map((item) => (
                    <div
                      key={item.text}
                      className={`flex items-center gap-3 ${isDarkMode ? 'text-gray-400' : 'text-slate-400'} text-sm`}
                    >
                      <div className={`w-7 h-7 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white/10'} flex items-center justify-center flex-shrink-0`}>
                        <item.icon size={13} className="text-brand-light" />
                      </div>
                      <span className="truncate">{item.text}</span>
                    </div>
                  ))}
                </div>

                {/* Status */}
                <div className="mt-5 flex items-center justify-center gap-2 bg-green-500/10 text-green-400 text-xs font-semibold py-2 px-4 rounded-full">
                  <span className="w-2 h-2 bg-green-400 rounded-full inline-block" />
                  Available for new projects
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className={`w-px h-8 bg-gradient-to-b ${isDarkMode ? 'from-gray-400' : 'from-slate-600'} to-transparent`} />
        </div>
      </section>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ══ STATS ══ */}
      {displayStats.length > 0 && (
        <section className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border-b`}>
          <div className="max-w-6xl mx-auto px-6 py-14">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {displayStats.map((stat, i) => (
                <Reveal key={stat.label + i} delay={i * 80}>
                  <div className="text-center group">
                    <div className={`w-12 h-12 ${isDarkMode ? 'bg-green-900/40' : 'bg-green-100'} rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-green-500 transition-colors`}>
                      <stat.icon size={20} className={`${isDarkMode ? 'text-green-300 group-hover:text-white' : 'text-green-500 group-hover:text-white'} transition-colors`} />
                    </div>
                    <div className={`font-sora font-bold text-3xl ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                      {stat.num}
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{stat.label}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ STORY ══ */}
      <section className={isDarkMode ? 'bg-gray-900' : 'bg-white'}>
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

            {/* Visual side */}
            <Reveal>
              <div className="relative">
                <div className={`aspect-square max-w-sm mx-auto rounded-3xl ${isDarkMode ? 'bg-gradient-to-br from-gray-800 to-gray-700' : 'bg-gradient-to-br from-brand-pale to-brand-green/20'} flex items-center justify-center overflow-hidden`}>
                  <div className="text-center p-8">
                    <div className={`font-sora font-black text-8xl ${isDarkMode ? 'text-gray-700' : 'text-brand-green/20'} mb-4`}>{initials}</div>
                    <div className={`${isDarkMode ? 'text-gray-400' : 'text-brand-green'} font-semibold`}>{profile?.tagline || 'Developer'}</div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className={`absolute top-4 left-4 w-16 h-16 border-2 ${isDarkMode ? 'border-gray-600' : 'border-brand-pale'} rounded-2xl -z-0`} />
              </div>
            </Reveal>
            </div>

          {/* Text side */}
          <div>
            <Reveal>
              <div className="text-xs font-semibold text-brand-green uppercase tracking-widest mb-3">
                My Story
              </div>
              <h2 className={`font-sora font-bold text-4xl ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6 leading-tight`}>
                Dari rasa penasaran
                <br />
                jadi sebuah
                <br />
                <span className="text-brand-green">passion.</span>
              </h2>
            </Reveal>

            <Reveal delay={100}>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} leading-relaxed mb-4`}>
                Perjalanan saya dimulai dari rasa penasaran yang besar terhadap
                bagaimana website dan aplikasi bekerja. 
              </p>
            </Reveal>

            <Reveal delay={150}>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} leading-relaxed mb-8`}>
                Saya percaya bahwa produk digital terbaik lahir dari perpaduan
                antara kode yang bersih, desain yang intuitif, dan pemahaman
                mendalam tentang kebutuhan pengguna.
              </p>
            </Reveal>

            <Reveal delay={250}>
              <div className="flex flex-wrap gap-3">
                {['Problem Solver','Team Player','Fast Learner','Detail-Oriented'].map((t) => (
                  <span
                    key={t}
                    className={`text-sm font-medium px-4 py-1.5 ${isDarkMode ? 'bg-green-900/40 text-green-300' : 'bg-brand-pale text-brand-green'} rounded-full`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ SKILLS ══ */}
      <section className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} py-20`}>
        <div className="max-w-6xl mx-auto px-6">
          <Reveal className="text-center mb-12">
            <div className="text-xs font-semibold text-brand-green uppercase tracking-widest mb-2">
              Tech Stack
            </div>
            <h2 className={`font-sora font-bold text-4xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Skills & Expertise
            </h2>
          </Reveal>

          {groupedSkills.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {groupedSkills.map((group, gi) => (
                <Reveal key={group.category} delay={gi * 80}>
                  <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : `${group.bg} border-white`} rounded-2xl p-6 border`}>
                    <div className="flex items-center gap-3 mb-5">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ background: group.color }}
                      />
                      <span className={`font-sora font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {group.category}
                      </span>
                    </div>
                    {group.skills.map((skill, si) => (
                      <SkillBar
                        key={skill.id || skill.name}
                        name={skill.name}
                        level={skill.level}
                        color={skill.color || group.color} 
                        delay={gi * 80 + si * 60}
                        isDarkMode={isDarkMode}
                      />
                    ))}
                  </div>
                </Reveal>
              ))}
            </div>
          ) : (
            <div className={`text-center py-10 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Belum ada skill yang ditambahkan.
            </div>
          )}
        </div>
      </section>

      {/* ══ EXPERIENCE TIMELINE ══ */}
      <section className={isDarkMode ? 'bg-gray-800' : 'bg-white'}>
        <div className="max-w-6xl mx-auto px-6 py-20">
          <Reveal className="text-center mb-12">
            <div className="text-xs font-semibold text-brand-green uppercase tracking-widest mb-2">
              Journey
            </div>
            <h2 className={`font-sora font-bold text-4xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Perjalanan Karir
            </h2>
          </Reveal>

          <div className="relative max-w-3xl mx-auto">

          {/* Vertical line */}
          <div className={`absolute left-6 md:left-1/2 top-0 bottom-0 w-px ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} -translate-x-1/2`} />

          {experiences.map((exp, i) => {
            const isLeft = i % 2 === 0;
            return (
              <Reveal key={exp.role} delay={i * 100}>
                <div className={`relative flex items-start mb-10 ${
                  isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                } flex-row`}>

                  {/* Timeline dot */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      exp.active
                        ? 'bg-brand-green border-brand-green'
                        : isDarkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
                    }`} />
                  </div>

                  {/* Card */}
                  <div className={`ml-14 md:ml-0 md:w-5/12 ${
                    isLeft ? 'md:mr-auto md:pr-10' : 'md:ml-auto md:pl-10'
                  }`}>
                    <div className={`${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'} rounded-2xl p-5 border ${
                      exp.active && !isDarkMode ? 'border-brand-green shadow-sm' : exp.active && isDarkMode ? 'border-brand-green' : ''
                    } hover:shadow-md transition-shadow`}>

                      {exp.active && (
                        <div className={`inline-flex items-center gap-1.5 ${isDarkMode ? 'bg-green-900/40 text-green-400' : 'bg-green-50 text-green-600'} text-xs font-semibold px-2.5 py-1 rounded-full mb-3`}>
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                          Current
                        </div>
                      )}

                      <div className="text-xs font-semibold text-brand-green mb-1">
                        {exp.year}
                      </div>
                      <h3 className={`font-sora font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-0.5`}>
                        {exp.role}
                      </h3>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-400'} mb-3`}>
                        {exp.company}
                      </div>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} leading-relaxed mb-3`}>
                        {exp.desc}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {exp.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`text-xs px-2.5 py-1 ${isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-500'} rounded-full font-medium`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
        </div>
      </section>

      {/* ══ VALUES ══ */}
      <section className={`${isDarkMode ? 'bg-gray-900' : 'bg-brand-navy'} py-20`}>
        <div className="max-w-6xl mx-auto px-6">
          <Reveal className="text-center mb-12">
            <div className="text-xs font-semibold text-brand-light uppercase tracking-widest mb-2">
              What Drives Me
            </div>
            <h2 className="font-sora font-bold text-4xl text-white">
              Nilai & Prinsip
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 80}>
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white/5 border-white/10 hover:bg-white/10'} backdrop-blur-sm border rounded-2xl p-6 transition-colors group`}>
                  <div className="text-3xl mb-4">{v.emoji}</div>
                  <h3 className="font-sora font-bold text-white mb-2">
                    {v.title}
                  </h3>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-slate-400'} text-sm leading-relaxed`}>
                    {v.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className={isDarkMode ? 'bg-gray-800' : 'bg-white'}>
        <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <Reveal>
          <div className="text-4xl mb-6">👋</div>
          <h2 className={`font-sora font-bold text-4xl ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            Yuk, kita berkolaborasi!
          </h2>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-400'} mb-8 leading-relaxed text-lg`}>
            Saya selalu terbuka untuk peluang baru, project menarik,
            dan obrolan yang seru tentang teknologi & desain.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand-green text-white font-semibold rounded-xl hover:bg-green-700 transition-colors text-lg"
            >
              Kirim Pesan
              <ArrowRight size={18} />
            </Link>
            
            {profile?.cv_url && (
              <a
                href={profile.cv_url}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-2 px-8 py-4 border-2 ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white' : 'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'} font-semibold rounded-xl transition-colors text-lg`}
              >
                <Download size={18} />
                Download CV
              </a>
            )}
          </div>
        </Reveal>
        </div>
      </section>

    </div>
  );
}