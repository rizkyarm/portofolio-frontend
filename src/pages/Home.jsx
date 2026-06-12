import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Download, ChevronDown, Code2, Smartphone, Video, Palette, WifiOff } from 'lucide-react';
import GradientMesh from '../components/animations/GradientMesh';
import TextReveal from '../components/animations/TextReveal';
import SectionHeader from '../components/shared/SectionHeader';
import ProjectCard from '../components/shared/ProjectCard';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Reveal from '../components/animations/Reveal';
import SEO from '../components/shared/SEO';
import useApiCache from '../hooks/useApiCache';

const categories = [
  { key: 'all',     label: 'All Projects', icon: null },
  { key: 'website', label: 'Website',      icon: Code2 },
  { key: 'android', label: 'Android',      icon: Smartphone },
  { key: 'video',   label: 'Video',        icon: Video },
  { key: 'design',  label: 'Design',       icon: Palette },
];

const stats = [
  { number: '24+', label: 'Projects Completed' },
  { number: '3+',  label: 'Years Experience' },
  { number: '18+', label: 'Happy Clients' },
];

export default function Home() {
  const { data: projects = [], loading: projLoading, fromCache: projCache, refetch: refetchProjects } = useApiCache('/projects', { initialValue: [] });
  const { data: skills = [], loading: skillLoading, fromCache: skillCache } = useApiCache('/skills', { initialValue: [] });
  const { data: services = [], loading: svcLoading, fromCache: svcCache } = useApiCache('/services', { initialValue: [] });
  const { data: profile, loading: profLoading, fromCache: profCache } = useApiCache('/profile', {
    transform: (res) => {
      const raw = res.data.data || res.data;
      if (raw?.stats && typeof raw.stats === 'string') {
        try { raw.stats = JSON.parse(raw.stats); } catch { /* keep string */ }
      }
      return raw;
    },
    initialValue: null,
  });

  const [activeCategory, setActiveCategory] = useState('all');
  const loading = projLoading || skillLoading || svcLoading || profLoading;
  const offline = projCache || skillCache || svcCache || profCache;
  const allOffline = offline && !loading;

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  const featuredProjects = filteredProjects.slice(0, 6);
  const profileStats = profile?.stats || {};

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white overflow-hidden">
      <SEO
        title="Home"
        description="Portfolio of Rizki Aditiya Ramadan — Creative Developer & Digital Creator specializing in Web Development, Android Apps, Video Production, and UI/UX Design."
        path="/"
      />

      {allOffline && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-16 left-0 right-0 z-40 flex items-center justify-center gap-2 px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 text-amber-400 text-xs font-medium backdrop-blur-sm"
        >
          <WifiOff size={12} />
          Showing cached data — backend unreachable. Auto-sync when reconnected.
        </motion.div>
      )}

      {/* ═══════════════════════════════════════════════
          HERO SECTION — Cinematic Full-Screen
          ═══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        <GradientMesh />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-8"
          >
            <Badge variant="live" dot>Available for new projects</Badge>
          </motion.div>

          {/* Main heading with text reveal */}
          <div className="mb-6">
            <TextReveal
              text="Creative Developer"
              className="font-sora font-extrabold text-5xl md:text-7xl lg:text-8xl justify-center tracking-tight"
              delay={0.4}
            />
            <TextReveal
              text="& Digital Creator"
              className="font-sora font-extrabold text-5xl md:text-7xl lg:text-8xl justify-center tracking-tight text-gradient-emerald"
              delay={0.8}
            />
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="max-w-xl mx-auto text-slate-400 text-lg md:text-xl mb-10 leading-relaxed"
          >
            I build beautiful digital experiences that combine
            <span className="text-emerald-400"> clean design</span> with
            <span className="text-indigo-400"> powerful functionality</span>.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link to="/projects">
              <Button variant="primary" size="lg" icon={ArrowRight}>
                View My Work
              </Button>
            </Link>
            {profile?.cv_url && (
              <a href={`${API_URL}/storage/${profile.cv_url}`} target="_blank" rel="noreferrer">
                <Button variant="secondary" size="lg" icon={Download}>
                  Download CV
                </Button>
              </a>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.6 }}
            className="flex items-center justify-center gap-6 md:gap-12"
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="font-sora font-bold text-3xl md:text-4xl text-white mb-1">
                  {stat.number}
                </div>
                <div className="text-xs md:text-sm text-slate-500 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] text-slate-600 uppercase tracking-[0.2em]">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-slate-700 flex items-start justify-center p-1.5">
            <div className="w-1 h-2 rounded-full bg-emerald-400 animate-scroll-indicator" />
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════
          FEATURED PROJECTS SECTION
          ═══════════════════════════════════════════════ */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <SectionHeader
              badge="Portfolio"
              title="Featured Projects"
              subtitle="Selected works that showcase my skills in web development, mobile apps, video editing, and UI/UX design."
            />
          </Reveal>

          {/* Category Filter */}
          <Reveal delay={100}>
            <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`
                    inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium
                    transition-all duration-300 cursor-pointer
                    ${activeCategory === cat.key
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10'
                      : 'bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  {cat.icon && <cat.icon size={14} />}
                  {cat.label}
                </button>
              ))}
            </div>
          </Reveal>

          {/* Project Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl bg-white/5 animate-pulse aspect-[16/14]" />
              ))}
            </div>
          ) : featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-slate-500 text-lg">No projects found in this category.</p>
            </div>
          )}

          {/* View all */}
          {projects.length > 6 && (
            <Reveal delay={200}>
              <div className="text-center mt-12">
                <Link to="/projects">
                  <Button variant="secondary" icon={ArrowRight}>
                    View All Projects
                  </Button>
                </Link>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SKILLS SECTION
          ═══════════════════════════════════════════════ */}
      {skills.length > 0 && (
        <section className="relative py-24 px-6 border-t border-white/5">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <SectionHeader
                badge="Skills"
                title="Technologies I Work With"
                subtitle="Tools and technologies that I use daily to build exceptional digital products."
              />
            </Reveal>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {skills.map((skill, i) => (
                <Reveal key={skill.id} delay={i * 50}>
                  <div className="group relative p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all duration-300 text-center card-hover">
                    {skill.icon && (
                      <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                        {skill.icon}
                      </div>
                    )}
                    <h4 className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                      {skill.name}
                    </h4>
                    
                    <div className="mt-3 h-1 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-indigo-500 transition-all duration-1000"
                        style={{ width: `${skill.level || 80}%` }}
                      />
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════
          SERVICES SECTION
          ═══════════════════════════════════════════════ */}
      {services.length > 0 && (
        <section className="relative py-24 px-6 border-t border-white/5">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <SectionHeader
                badge="Services"
                title="What I Can Do For You"
                subtitle="End-to-end digital solutions tailored to bring your vision to life."
              />
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, i) => (
                <Reveal key={service.id} delay={i * 100}>
                  <div className="group relative p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/20 transition-all duration-500 card-hover overflow-hidden">
                    
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10">
                      {service.icon && (
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-2xl mb-5 group-hover:bg-emerald-500/20 transition-colors">
                          {service.icon}
                        </div>
                      )}

                      <h3 className="font-sora font-bold text-xl text-white mb-3 group-hover:text-emerald-400 transition-colors">
                        {service.title}
                      </h3>

                      <p className="text-slate-400 text-sm leading-relaxed mb-5">
                        {service.description}
                      </p>

                      {service.includes && service.includes.length > 0 && (
                        <ul className="space-y-2">
                          {service.includes.slice(0, 4).map((item, j) => (
                            <li key={j} className="flex items-center gap-2 text-xs text-slate-500">
                              <span className="w-1 h-1 rounded-full bg-emerald-400 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}

                      {service.price_range && (
                        <div className="mt-5 pt-5 border-t border-white/5">
                          <span className="text-xs text-slate-500">Starting from</span>
                          <p className="font-sora font-bold text-emerald-400">{service.price_range}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════
          CTA SECTION
          ═══════════════════════════════════════════════ */}
      <section className="relative py-24 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <h2 className="font-sora font-bold text-3xl md:text-5xl text-white mb-6">
              Let's Build Something
              <span className="text-gradient-emerald"> Amazing Together</span>
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-slate-400 text-lg mb-10 max-w-lg mx-auto">
              Have a project in mind? I'd love to hear about it. Let's discuss how we can work together.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact">
                <Button variant="primary" size="lg" icon={ArrowUpRight}>
                  Get In Touch
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="secondary" size="lg">
                  Learn More About Me
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
