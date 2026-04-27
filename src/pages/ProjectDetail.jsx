import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ExternalLink, Play,
  CheckCircle, ChevronRight, Monitor, Smartphone,
  Video, Palette, Calendar, Tag, Layers,
} from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { useDarkMode } from '../context/DarkModeContext';
import api from '../services/api';

/* ── Intersection Observer hook ── */
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
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
        transition: `opacity 0.6s ease, transform 0.6s ease`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ── Config ── */
const categoryConfig = {
  website: {
    label: 'Website Project',
    icon: Monitor,
    gradient: 'from-indigo-500 to-green-500',
    bg: 'bg-indigo-50',
    text: 'text-indigo-600',
    badge: 'bg-indigo-100 text-indigo-700',
  },
  android: {
    label: 'Android App Project',
    icon: Smartphone,
    gradient: 'from-fuchsia-500 to-green-500',
    bg: 'bg-fuchsia-50',
    text: 'text-fuchsia-600',
    badge: 'bg-fuchsia-100 text-fuchsia-700',
  },
  video: {
    label: 'Video Editing Project',
    icon: Video,
    gradient: 'from-slate-600 to-green-500',
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    badge: 'bg-slate-100 text-slate-700',
  },
  design: {
    label: 'Design Project',
    icon: Palette,
    gradient: 'from-amber-400 to-green-500',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    badge: 'bg-amber-100 text-amber-700',
  },
};

const tabs = [
  { key: 'overview',  label: 'Overview' },
  { key: 'features',  label: 'Features' },
  { key: 'stack',     label: 'Tech Stack' },
];

/* ── Dummy fallback data ── */
const dummyProject = {
};

/* ── Skeleton Loader ── */
function SkeletonLoader({ isDarkMode }) {
  return (
    <div className="animate-pulse">
      <div className={`h-64 md:h-80 rounded-none ${
        isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
      }`} />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className={`h-4 rounded w-32 mb-4 ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
        }`} />
        <div className={`h-10 rounded w-2/3 mb-3 ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
        }`} />
        <div className={`h-4 rounded w-1/2 mb-8 ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
        }`} />
        <div className="grid grid-cols-3 gap-4">
          {[1,2,3].map(i => (
            <div key={i} className={`h-20 rounded-2xl ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function ProjectDetail() {
  const { isDarkMode } = useDarkMode();
  const { slug }          = useParams();
  const navigate          = useNavigate();
  const [project, setProject]   = useState(null);
  const [otherProjects, setOtherProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [lightbox, setLightbox] = useState(null);
  const tabRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/projects/${slug}`),
      api.get('/projects')
    ])
      .then(([detailRes, listRes]) => {
        const currentProject = detailRes.data.data || detailRes.data;
        setProject(currentProject);

        const allProjects = listRes.data.data || listRes.data || [];
        const filteredOthers = allProjects
          .filter(p => p.id !== currentProject.id)
          .slice(0, 3);
        
        setOtherProjects(filteredOthers);
      })
      .catch(() => {
        setProject(dummyProject);
        setOtherProjects([]); 
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const scrollToTab = () => {
    tabRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) return <SkeletonLoader isDarkMode={isDarkMode} />;
  if (!project) return (
    <div className={`max-w-xl mx-auto px-6 py-40 text-center ${
      isDarkMode ? 'bg-gray-900' : 'bg-white'
    }`}>
      <div className="text-5xl mb-4">🔍</div>
      <h2 className={`font-sora font-bold text-2xl mb-3 ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        Project tidak ditemukan
      </h2>
      <p className={`mb-6 ${
        isDarkMode ? 'text-gray-400' : 'text-gray-400'
      }`}>
        Project dengan slug "{slug}" tidak ada atau telah dihapus.
      </p>
      <Link
        to="/projects"
        className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl"
      >
        <ArrowLeft size={16} />
        Kembali ke Projects
      </Link>
    </div>
  );

  const config    = categoryConfig[project.category] || categoryConfig.website;
  const CatIcon   = config.icon;
  const features  = project.features  || [];
  const techStack = project.tech_stack || [];
  const tags      = project.tags       || [];
  const images    = project.images     || [];

  return (
    <div className="overflow-x-hidden">

      {/* ══ HERO ══ */}
      <section className={`relative bg-gradient-to-br ${config.gradient} overflow-hidden`}>

        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 -left-10 w-48 h-48 rounded-full bg-black/10 blur-2xl" />
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />
        </div>

        {/* Sticky top bar */}
        <div className="sticky top-16 z-40 bg-black/20 backdrop-blur-md border-b border-white/10">
          <div className="max-w-6xl mx-auto px-6 h-12 flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-white/80 hover:text-white text-sm font-medium transition-colors"
            >
              <ArrowLeft size={15} />
              Back
            </button>
            <div className="w-px h-4 bg-white/20" />
            <div className="flex gap-1 overflow-x-auto scrollbar-none">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => { setActiveTab(tab.key); scrollToTab(); }}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    activeTab === tab.key
                      ? 'bg-white text-gray-900'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-2">
              {project.demo_url && (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white text-gray-900 text-xs font-bold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ExternalLink size={11} />
                  Live Demo
                </a>
              )}
              {project.repo_url && (
                <a
                  href={project.repo_url}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/10 text-white text-xs font-bold rounded-lg hover:bg-white/20 transition-colors border border-white/20"
                >
                  <FaGithub size={11} />
                  Source
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Hero content */}
        <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            {/* Left */}
            <div>
              {/* Breadcrumb */}
              <div
                className="flex items-center gap-1.5 text-white/60 text-xs mb-5"
                style={{ animation: 'fadeUp 0.5s ease forwards' }}
              >
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
                <ChevronRight size={12} />
                <Link to="/projects" className="hover:text-white transition-colors">Projects</Link>
                <ChevronRight size={12} />
                <span className="text-white/90">{project.title}</span>
              </div>

              {/* Category badge */}
              <div
                className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-5 border border-white/20"
                style={{ animation: 'fadeUp 0.5s ease 0.05s forwards', opacity: 0 }}
              >
                <CatIcon size={12} />
                {config.label}
              </div>

              <h1
                className="font-sora font-bold text-white leading-tight mb-4"
                style={{
                  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                  animation: 'fadeUp 0.5s ease 0.1s forwards',
                  opacity: 0,
                }}
              >
                {project.title}
              </h1>

              <p
                className="text-white/75 text-lg leading-relaxed mb-7 max-w-md"
                style={{ animation: 'fadeUp 0.5s ease 0.15s forwards', opacity: 0 }}
              >
                {project.short_description || project.description?.substring(0, 120) + '...'}
              </p>

              {/* Tags */}
              <div
                className="flex flex-wrap gap-2 mb-7"
                style={{ animation: 'fadeUp 0.5s ease 0.2s forwards', opacity: 0 }}
              >
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-semibold px-3 py-1.5 bg-white/15 text-white rounded-full border border-white/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action buttons */}
              <div
                className="flex flex-wrap gap-3"
                style={{ animation: 'fadeUp 0.5s ease 0.25s forwards', opacity: 0 }}
              >
                {project.demo_url && (
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    {project.category === 'video' ? <Play size={16} /> : <ExternalLink size={16} />}
                    {project.category === 'video' ? 'Watch Video' : 'Live Demo'}
                  </a>
                )}
                {project.repo_url && (
                  <a
                    href={project.repo_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors border border-white/20"
                  >
                    <FaGithub size={16} />
                    Source Code
                  </a>
                )}
              </div>
            </div>

            {/* Right — thumbnail / mockup */}
            <div
              className="flex justify-center"
              style={{ animation: 'fadeUp 0.5s ease 0.2s forwards', opacity: 0 }}
            >
              {project.thumbnail ? (
                <div className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="relative w-full max-w-sm">
                  {/* Main screen */}
                  <div className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-3xl p-6 shadow-2xl">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 rounded-full bg-white/40" />
                      <div className="w-3 h-3 rounded-full bg-white/40" />
                      <div className="w-3 h-3 rounded-full bg-white/40" />
                      <div className="flex-1 h-4 bg-white/20 rounded-full mx-2" />
                    </div>
                    <div className="space-y-2.5">
                      <div className="h-5 bg-white/20 rounded-lg w-3/4" />
                      <div className="h-3 bg-white/10 rounded w-full" />
                      <div className="h-3 bg-white/10 rounded w-5/6" />
                      <div className="h-3 bg-white/10 rounded w-4/6" />
                      <div className="grid grid-cols-3 gap-2 mt-4">
                        {[1,2,3].map(i => (
                          <div key={i} className="h-16 bg-white/15 rounded-xl" />
                        ))}
                      </div>
                      <div className="h-3 bg-white/10 rounded w-full" />
                      <div className="h-3 bg-white/10 rounded w-3/4" />
                    </div>
                  </div>
                  {/* Floating badge */}
                  <div className="absolute -bottom-3 -right-3 bg-white rounded-2xl px-4 py-2 shadow-xl">
                    <div className="text-xs font-bold text-gray-900">
                      {project.status === 'live' ? '🟢 Live' : '🟡 Draft'}
                    </div>
                    <div className="text-xs text-gray-400">{project.created_at}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <style>{`
          @keyframes fadeUp {
            from { opacity:0; transform:translateY(20px) }
            to   { opacity:1; transform:translateY(0) }
          }
        `}</style>
      </section>

      {/* ══ TAB CONTENT ══ */}
      <div ref={tabRef} className={`max-w-auto mx-auto px-6 py-16 ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      }`}>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Main content */}
            <div className="lg:col-span-2 flex flex-col gap-10">

              {/* Description */}
              <Reveal>
                <div>
                  <div className="text-xs font-semibold text-green-600 uppercase tracking-widest mb-3">
                    Tentang Project
                  </div>
                  <div className="prose prose-gray max-w-none">
                    {(project.description || '').split('\n\n').map((para, i) => (
                      <p key={i} className={`leading-relaxed mb-4 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {para.trim()}
                      </p>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* Image gallery */}
              {images.length > 0 && (
                <Reveal>
                  <div>
                    <div className="text-xs font-semibold text-green-600 uppercase tracking-widest mb-4">
                      Screenshots
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {images.map((img, i) => (
                        <div
                          key={i}
                          onClick={() => setLightbox(img)}
                          className={`aspect-video rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition-transform border shadow-sm ${
                            isDarkMode ? 'border-gray-700' : 'border-gray-100'
                          }`}
                        >
                          <img
                            src={img}
                            alt={`Screenshot ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              )}

              {/* Quick features preview */}
              {features.length > 0 && (
                <Reveal>
                  <div className={`rounded-3xl p-6 border ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700' 
                      : `${config.bg} border-white`
                  }`}>
                    <div className="text-xs font-semibold text-green-600 uppercase tracking-widest mb-4">
                      Fitur Unggulan
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {features.slice(0, 4).map((feature) => {
                        const name = typeof feature === 'string' ? feature : feature.name;
                        return (
                          <div key={name} className="flex items-start gap-3">
                            <CheckCircle size={15} className={`${isDarkMode ? 'text-green-500' : 'text-green-500'} mt-0.5 flex-shrink-0`} />
                            <span className={`text-sm font-medium ${
                              isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>{name}</span>
                          </div>
                        );
                      })}
                    </div>
                    {features.length > 4 && (
                      <button
                        onClick={() => { setActiveTab('features'); scrollToTab(); }}
                        className={`mt-4 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all ${
                          isDarkMode ? 'text-green-500' : 'text-green-500'
                        }`}
                      >
                        Lihat semua {features.length} fitur
                        <ChevronRight size={14} />
                      </button>
                    )}
                  </div>
                </Reveal>
              )}
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-5">

              {/* Project info card */}
              <Reveal delay={100}>
                <div className={`rounded-3xl p-5 shadow-sm border ${
                  isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                }`}>
                  <div className={`text-xs font-semibold uppercase tracking-widest mb-4 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-400'
                  }`}>
                    Info Project
                  </div>
                  <div className="flex flex-col gap-3">
                    {[
                      {
                        icon: Layers,
                        label: 'Kategori',
                        value: config.label,
                      },
                      {
                        icon: Calendar,
                        label: 'Tanggal',
                        value: project.created_at,
                      },
                      {
                        icon: Tag,
                        label: 'Status',
                        value: project.status === 'live' ? 'Live' : 'Draft',
                        badge: project.status === 'live'
                          ? isDarkMode ? 'bg-green-900/40 text-green-300' : 'bg-green-100 text-green-700'
                          : isDarkMode ? 'bg-yellow-900/40 text-yellow-300' : 'bg-yellow-100 text-yellow-700',
                      },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 ${
                          isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-100'
                        }`}>
                          <item.icon size={14} className={isDarkMode ? 'text-gray-400' : 'text-gray-400'} />
                        </div>
                        <div>
                          <div className={`text-xs ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-400'
                          }`}>{item.label}</div>
                          {item.badge ? (
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.badge}`}>
                              {item.value}
                            </span>
                          ) : (
                            <div className={`text-sm font-semibold ${
                              isDarkMode ? 'text-white' : 'text-gray-700'
                            }`}>
                              {item.value}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* Tech stack preview */}
              {techStack.length > 0 && (
                <Reveal delay={150}>
                  <div className={`rounded-3xl p-5 shadow-sm border ${
                    isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                  }`}>
                    <div className={`text-xs font-semibold uppercase tracking-widest mb-4 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-400'
                    }`}>
                      Tech Stack
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {techStack.slice(0, 6).map((tech) => {
                        const name = typeof tech === 'string' ? tech : tech.name;
                        const color = tech.color || '#6c5ce7';
                        const icon = tech.icon || name?.substring(0, 2).toUpperCase();
                        return (
                          <div
                            key={name}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${
                              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-100'
                            }`}
                          >
                            <div
                              className="w-4 h-4 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                              style={{ background: color, fontSize: '7px' }}
                            >
                              {icon}
                            </div>
                            <span className={`text-xs font-medium ${
                              isDarkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>{name}</span>
                          </div>
                        );
                      })}
                    </div>
                    {techStack.length > 6 && (
                      <button
                        onClick={() => { setActiveTab('stack'); scrollToTab(); }}
                        className="mt-3 text-xs font-semibold text-green-500 flex items-center gap-1"
                      >
                        +{techStack.length - 6} lainnya
                        <ChevronRight size={12} />
                      </button>
                    )}
                  </div>
                </Reveal>
              )}

              {/* CTA card */}
              <Reveal delay={200}>
                <div className={isDarkMode ? 'bg-gray-800 rounded-3xl p-5' : 'bg-brand-navy rounded-3xl p-5'}>
                  <div className="text-white font-sora font-bold mb-2">
                    Tertarik dengan project ini?
                  </div>
                  <p className={`text-xs leading-relaxed mb-4 ${
                    isDarkMode ? 'text-gray-400' : 'text-slate-400'
                  }`}>
                    Saya bisa membangun sesuatu serupa untukmu. Mari diskusi!
                  </p>
                  <Link
                    to="/contact"
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition-colors"
                  >
                    Hubungi Saya
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        )}

        {/* ── FEATURES TAB ── */}
        {activeTab === 'features' && (
          <div>
            <Reveal className="mb-10 text-center">
              <div className="text-xs font-semibold text-green-500 uppercase tracking-widest mb-2">
                Capabilities
              </div>
              <h2 className={`font-sora font-bold text-4xl ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Fitur Utama
              </h2>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {features.map((feature, i) => {
                const name = typeof feature === 'string' ? feature : feature.name;
                const desc = typeof feature === 'object' ? feature.desc : '';
                return (
                  <Reveal key={name} delay={i * 60}>
                    <div className={`rounded-2xl p-5 border hover:shadow-md transition-shadow group ${
                      isDarkMode
                        ? 'bg-gray-800 border-gray-700'
                        : `${config.bg} border-white`
                    }`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm ${
                        isDarkMode ? 'bg-gray-700' : 'bg-white'
                      }`}>
                        <CheckCircle size={18} className={isDarkMode ? 'text-green-500' : 'text-green-500'} />
                      </div>
                      <h3 className={`font-sora font-bold text-sm mb-2 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {name}
                      </h3>
                      {desc && (
                        <p className={`text-xs leading-relaxed ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-400'
                        }`}>{desc}</p>
                      )}
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        )}

        {/* ── STACK TAB ── */}
        {activeTab === 'stack' && (
          <div>
            <Reveal className="mb-10 text-center">
              <div className="text-xs font-semibold text-green-500 uppercase tracking-widest mb-2">
                Built With
              </div>
              <h2 className={`font-sora font-bold text-4xl ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Arsitektur & Teknologi
              </h2>
              <p className={`mt-2 max-w-md mx-auto ${
                isDarkMode ? 'text-gray-400' : 'text-gray-400'
              }`}>
                Stack yang dipilih dengan mempertimbangkan performa,
                skalabilitas, dan developer experience.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
              {techStack.map((tech, i) => {
                const name  = typeof tech === 'string' ? tech : tech.name;
                const role  = tech.role  || '';
                const color = tech.color || '#6c5ce7';
                const icon  = tech.icon  || name?.substring(0, 2).toUpperCase();
                return (
                  <Reveal key={name} delay={i * 50}>
                    <div className={`rounded-2xl p-5 border hover:shadow-md transition-shadow flex items-center gap-4 group ${
                      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                    }`}>
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 group-hover:scale-110 transition-transform"
                        style={{ background: color }}
                      >
                        {icon}
                      </div>
                      <div>
                        <div className={`font-sora font-bold text-sm ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {name}
                        </div>
                        {role && (
                          <div className={`text-xs mt-0.5 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-400'
                          }`}>{role}</div>
                        )}
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>

            {/* Architecture diagram placeholder */}
            <Reveal>
              <div className={`rounded-3xl border p-8 text-center ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'
              }`}>
                <div className={`text-xs font-semibold uppercase tracking-widest mb-6 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-400'
                }`}>
                  Alur Arsitektur
                </div>
                <div className="flex flex-wrap justify-center items-center gap-3">
                  {['User', '→', 'Flutter App', '→', 'Firebase', '→', 'Node.js API', '→', 'Database'].map((item) => (
                    <div key={item}>
                      {item === '→' ? (
                        <span className={`text-lg font-light ${
                          isDarkMode ? 'text-gray-600' : 'text-gray-300'
                        }`}>{item}</span>
                      ) : (
                        <div className={`px-4 py-2 rounded-xl border text-sm font-semibold shadow-sm ${
                          isDarkMode
                            ? 'bg-gray-700 border-gray-600 text-gray-200'
                            : 'bg-white border-gray-200 text-gray-700'
                        }`}>
                          {item}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        )}
      </div>

      {/* ══ OTHER PROJECTS ══ */}
      <section className={`py-16 ${
        isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
      }`}>
        <div className="max-w-6xl mx-auto px-6">
          <Reveal className="flex items-center justify-between mb-8">
            <div>
              <div className="text-xs font-semibold text-green-500 uppercase tracking-widest mb-1">
                More Work
              </div>
              <h2 className={`font-sora font-bold text-2xl ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Project Lainnya
              </h2>
            </div>
            <Link
              to="/projects"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-500 hover:gap-3 transition-all"
            >
              Lihat Semua
              <ChevronRight size={14} />
            </Link>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {otherProjects.map((p, i) => (
              <Reveal key={p.id} delay={i * 80}>
                <Link
                  to={`/projects/${p.slug}`}
                  className={`block rounded-2xl border overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group ${
                    isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                  }`}
                >
                  <div className="h-32 relative overflow-hidden bg-gray-100 dark:bg-gray-700">
                    {p.thumbnail ? (
                      <img 
                        src={p.thumbnail} 
                        alt={p.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      // Fallback 
                      <div className="w-full h-full bg-gradient-to-br from-green-500 to-green-400 flex items-center justify-center">
                        <span className="text-white font-sora font-bold text-2xl">
                          {(p.title || 'P').substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                    )}
                    
                    {/* Badge Kategori */}
                    {p.category && (
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-green-500 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        {p.category}
                      </div>
                    )}
                  </div>

                  {/* Bagian Konten / Teks */}
                  <div className="p-4">
                    <h3 className={`font-sora font-bold text-sm mb-1 group-hover:text-green-500 transition-colors truncate ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {p.title || 'Project Tanpa Judul'}
                    </h3>
                    
                    <div className="flex items-center text-green-500 text-xs font-bold uppercase tracking-wide gap-1 mt-3">
                      Lihat Detail
                      <ChevronRight size={12} className="group-hover:translate-x-1.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}

            {/* Fallback  */}
            {otherProjects.length === 0 && (
              <div className={`col-span-1 sm:col-span-3 text-center py-10 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Belum ada project lain yang dipublikasikan.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className={`max-w-auto mx-auto px-6 py-20 text-center ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      }`}>
        <Reveal>
          <h2 className={`font-sora font-bold text-4xl mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Mau project serupa?
          </h2>
          <p className={`mb-8 leading-relaxed ${
            isDarkMode ? 'text-gray-400' : 'text-gray-400'
          }`}>
            Saya siap membantu mewujudkan ide digitalmu menjadi
            produk yang nyata dan berdampak.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors"
            >
              Diskusi Project
              <ChevronRight size={16} />
            </Link>
            <Link
              to="/projects"
              className={`inline-flex items-center gap-2 px-8 py-4 border-2 font-semibold rounded-xl transition-colors ${
                isDarkMode
                  ? 'border-gray-600 text-gray-300 hover:border-gray-400 hover:text-white'
                  : 'border-gray-200 text-gray-700 hover:border-gray-900'
              }`}
            >
              <ArrowLeft size={16} />
              Semua Projects
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ══ LIGHTBOX ══ */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox}
            alt="Screenshot"
            className="max-w-full max-h-full rounded-2xl shadow-2xl"
          />
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-6 right-6 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors text-xl"
          >
            ✕
          </button>
        </div>
      )}

    </div>
  );
}