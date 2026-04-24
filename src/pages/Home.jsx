import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useDarkMode } from '../context/DarkModeContext';

const categoryColors = {
  website: 'from-indigo-500 to-purple-600',
  android: 'from-fuchsia-500 to-brand-purple',
  video:   'from-slate-700 to-slate-900',
  design:  'from-amber-400 to-orange-500',
};

const categoryLabel = {
  website: 'Website Project',
  android: 'Android App Project',
  video:   'Video Editing Project',
  design:  'Design Project',
};

const filterTabs = [
  { key: 'all',     label: 'All' },
  { key: 'website', label: 'Websites' },
  { key: 'android', label: 'Android Apps' },
  { key: 'video',   label: 'Video Editing' },
  { key: 'design',  label: 'Design' },
];

const skillCategories = [
  {
    name: 'Frontend',
    skills: [
      { name: 'React',    color: '#61dafb' },
      { name: 'Tailwind', color: '#38bdf8' },
      { name: 'Figma',    color: '#f24e1e' },
    ],
  },
  {
    name: 'Mobile',
    skills: [
      { name: 'Flutter',  color: '#54c5f8' },
      { name: 'Firebase', color: '#f5a623' },
      { name: 'Android',  color: '#3ddc84' },
    ],
  },
  {
    name: 'Backend',
    skills: [
      { name: 'Laravel',  color: '#ff2d20' },
      { name: 'Node.js',  color: '#68a063' },
      { name: 'MySQL',    color: '#4479a1' },
    ],
  },
  {
    name: 'Tools',
    skills: [
      { name: 'Premiere', color: '#9999ff' },
      { name: 'After FX', color: '#9999ff' },
      { name: 'Git',      color: '#f05032' },
    ],
  },
];

export default function Home() {
  const { isDarkMode } = useDarkMode();
  const [projects,      setProjects]      = useState([]);
  const [activeFilter,  setActiveFilter]  = useState('all');
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    api.get('/projects?featured=true')
      .then((res) => setProjects(res.data.data || res.data))
      .catch(()  => setProjects([]))
      .finally(() => setLoadingProjects(false));
  }, []);

  const filtered = activeFilter === 'all'
    ? projects
    : projects.filter((p) => p.category === activeFilter);

  return (
    <div>
      {/* ── HERO SECTION ── */}
      <section className={`${isDarkMode ? 'bg-gray-900' : 'bg-brand-navy'} min-h-screen flex items-center overflow-hidden`}>
        <div className="absolute bottom-0 -left-20 w-72 h-72 rounded-full bg-green-500 opacity-10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-white opacity-5" />
        <div className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Left — text */}
          <div>
            <div className={`inline-flex items-center gap-2 ${isDarkMode ? 'bg-green-900/40 text-green-300' : 'bg-green-100 text-green-600'} text-xs font-semibold px-3 py-1.5 rounded-full mb-6`}>
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Available for work
            </div>

            <h1 className={`font-sora font-bold text-white leading-tight mb-6 text-4xl ${isDarkMode ? 'text-white' : 'text-gray-100'}`}>
              Rizki Aditiya
              <br />
              <span className="text-green-600">Ramadan</span>
            </h1>

            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-lg leading-relaxed mb-8 max-w-md`}>
              Creative Developer, Android App Builder,
              Video Editor & UI/UX Designer — turning ideas
              into polished digital experiences.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1 active:scale-95 group relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 -translate-x-full group-hover:translate-x-full transition-all duration-500"></span>
                <span className="relative z-10">View My Work</span>
                <span className="relative z-10 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              
              <a
                href="/cv.pdf"
                download
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-900 text-gray-900 font-semibold rounded-xl hover:bg-gray-900 hover:text-white transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1 active:scale-95 group relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-gray-900/0 to-gray-900/0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                <span className="relative z-10">Download CV</span>
                <span className="relative z-10 group-hover:translate-y-1 transition-transform">↓</span>
              </a>
            </div>
          </div>

          {/* Right — stats cards */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-4">
              {[
                { num: '24+', label: 'Projects Done' },
                { num: '3',   label: 'Years Exp.' },
                { num: '18',  label: 'Clients' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-800 border-gray-700'} rounded-2xl p-4 border text-center`}
                >
                  <div className={`font-sora font-bold text-2xl ${isDarkMode ? 'text-white' : 'text-white'}`}>
                    {stat.num}
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mt-1 font-medium`}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Service badges */}
            <div className={`${isDarkMode ? 'bg-gray-800' : 'border-gray-700' } rounded-2xl p-5 border`}>
              <div className={`text-xs font-semibold ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-widest mb-3`}>
                What I do
              </div>
              <div className="flex flex-wrap gap-2">
                {['Web Development','Android Apps','UI/UX Design','Video Editing','Laravel API'].map((s) => (
                  <span
                    key={s}
                    className={`text-xs font-medium px-3 py-1.5 ${isDarkMode ? 'bg-green-900/40 text-green-300' : 'bg-green-100 text-green-600'} rounded-full`}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Status card */}
            <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-white/10'} rounded-2xl p-5 flex items-center gap-4`}>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-400 flex items-center justify-center font-sora font-bold text-white text-lg flex-shrink-0">
                RA
              </div>
              <div className="flex-1">
                <div className="text-white font-semibold text-sm">
                  Rizki Aditiya Ramadan
                </div>
                <div className="text-slate-400 text-xs mt-0.5">
                  Open to freelance & full-time roles
                </div>
              </div>
              <div className="w-3 h-3 bg-green-400 rounded-full flex-shrink-0"></div>
            </div>
          </div>

        </div>
      </section>

      {/* ── FEATURED PROJECTS ── */}
      <section className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} max-w-full mx-auto px-6 py-20`}>

        <div className="text-center mb-10">
          <div className="text-xs font-semibold text-green-600 uppercase tracking-widest mb-2">
            My Work
          </div>
          <h2 className={`font-sora font-bold text-4xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Featured Projects
          </h2>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-300 ${
                activeFilter === tab.key
                  ? 'bg-brand-navy text-white border-brand-navy shadow-md scale-105'
                  : `${isDarkMode ? 'bg-gray-800 text-gray-400 border-gray-700 hover:border-green-600 hover:bg-gray-700' : 'bg-white text-gray-500 border-gray-200 hover:border-green-600 hover:bg-gray-50'} hover:shadow-md hover:scale-105 hover:-translate-y-0.5 active:scale-95`
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Projects grid */}
        {loadingProjects ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-2xl h-80 animate-pulse`} />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} isDarkMode={isDarkMode} />
            ))}
          </div>
        ) : (
          /* Fallback  */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dummyProjects.map((project) => (
              <ProjectCard key={project.id} project={project} isDarkMode={isDarkMode} />
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-900 text-gray-900 font-semibold rounded-xl hover:bg-gray-900 hover:text-white transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1 active:scale-95 group relative overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-gray-900/0 to-gray-900/0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
            <span className="relative z-10">See All Projects</span>
            <span className="relative z-10 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </section>

      {/* ── ABOUT + SKILLS ── */}
      <section className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} py-20`}>
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

          {/* About */}
          <div>
            <div className="text-xs font-semibold text-green-600 uppercase tracking-widest mb-2">
              Meet Rizki Aditiya
            </div>
            <h2 className={`font-sora font-bold text-4xl ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-5 leading-tight`}>
              Creative Developer
              <br /> & Digital Creator
            </h2>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} leading-relaxed mb-5`}>
              Passionate about crafting seamless digital experiences —
              from Android apps to editorial video production.
              With 3 years of multi-disciplinary work, I bring ideas
              to life with precision and creativity.
            </p>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} leading-relaxed mb-8`}>
              I specialize in building full-stack web applications with
              Laravel & React, cross-platform mobile apps with Flutter,
              and compelling video content with Adobe Premiere & After Effects.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1 active:scale-95 group relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 -translate-x-full group-hover:translate-x-full transition-all duration-500"></span>
              <span className="relative z-10">More About Me</span>
              <span className="relative z-10 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          {/* Skills grid */}
          <div>
            <div className={`text-xs font-semibold text-green-600 uppercase tracking-widest mb-5`}>
              Tech Skills
            </div>
            <div className="grid grid-cols-2 gap-4">
              {skillCategories.map((cat) => (
                <div
                  key={cat.name}
                  className={`${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'} rounded-2xl p-4 border transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1 cursor-pointer group`}
                >
                  <div className={`text-xs font-semibold ${isDarkMode ? 'text-gray-400 group-hover:text-green-600' : 'text-gray-400 group-hover:text-green-600'} uppercase tracking-widest mb-3 transition-colors duration-300`}>
                    {cat.name}
                  </div>
                  <div className="flex flex-col gap-2">
                    {cat.skills.map((skill) => (
                      <div
                        key={skill.name}
                        className={`flex items-center gap-2 text-sm font-medium ${isDarkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'} transition-all duration-300`}
                      >
                        <div
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-transform duration-300 group-hover:scale-125"
                          style={{ background: skill.color }}
                        />
                        {skill.name}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="bg-brand-navy py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-sora font-bold text-4xl text-white mb-4">
            Have a project in mind?
          </h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Let's build something great together.
            I'm available for freelance projects and full-time opportunities.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all duration-300 text-lg hover:shadow-lg hover:scale-105 hover:-translate-y-1 active:scale-95 group relative overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 -translate-x-full group-hover:translate-x-full transition-all duration-500"></span>
            <span className="relative z-10">Get In Touch</span>
            <span className="relative z-10 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </section>

    </div>
  );
}

/* ── Project Card Component ── */
function ProjectCard({ project, isDarkMode }) {
  return (
    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl border overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 group cursor-pointer`}>

      {/* Thumbnail */}
      <div className={`h-44 bg-gradient-to-br ${categoryColors[project.category] || 'from-gray-400 to-gray-600'} flex items-center justify-center relative overflow-hidden`}>
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <span className="font-sora font-bold text-white text-xl opacity-80 group-hover:scale-125 transition-transform duration-300 origin-center">
            {project.title.substring(0, 2).toUpperCase()}
          </span>
        )}
        {project.category === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-125 transition-transform duration-300">
              <span className="text-xl">▶</span>
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
          {categoryLabel[project.category] || project.category}
        </div>
        <h3 className={`font-sora font-bold ${isDarkMode ? 'text-white group-hover:text-green-600' : 'text-gray-900 group-hover:text-green-600'} mb-3 transition-colors duration-300`}>
          {project.title}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {(project.tags || []).slice(0, 3).map((tag) => (
            <span
              key={tag}
              className={`text-xs px-2.5 py-1 ${isDarkMode ? 'bg-gray-700 text-gray-300 group-hover:bg-green-600/40 group-hover:text-green-300' : 'bg-gray-100 text-gray-500 group-hover:bg-green-100 group-hover:text-green-600'} rounded-full font-medium transition-all duration-300`}
            >
              {tag}
            </span>
          ))}
        </div>

        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-400'} leading-relaxed mb-4`}>
          {project.short_description || project.description?.substring(0, 80) + '...'}
        </p>

        <Link
          to={`/projects/${project.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-600 hover:text-green-700 transition-all duration-300 hover:gap-3 group/link"
        >
          View Details
          <span className="group-hover/link:translate-x-1 transition-transform duration-300">↗</span>
        </Link>
      </div>
    </div>
  );
}

/* ── Dummy projects (fallback saat API kosong) ── */
const dummyProjects = [
  {
    id: 1,
    title: 'Eco-Shop E-Commerce',
    slug: 'eco-shop',
    category: 'website',
    tags: ['React', 'Tailwind CSS', 'UI Design'],
    short_description: 'Responsive online store for sustainable products.',
    thumbnail: null,
  },
  {
    id: 2,
    title: 'Daily Flow Task App',
    slug: 'daily-flow',
    category: 'android',
    tags: ['Flutter', 'Firebase', 'Android API'],
    short_description: 'Intuitive productivity app for personal organization.',
    thumbnail: null,
  },
  {
    id: 3,
    title: 'Urban Explorer Vlog',
    slug: 'urban-explorer',
    category: 'video',
    tags: ['Premiere Pro', 'After Effects', 'Motion Graphics'],
    short_description: 'Dynamic travel video montage with energetic editing.',
    thumbnail: null,
  },
];
