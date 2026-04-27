import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDarkMode } from '../context/DarkModeContext';
import api from '../services/api';

const categoryColors = {
  website: 'from-indigo-500 to-green-600',
  android: 'from-blue-500 to-cyan-600',
  video:   'from-slate-700 to-slate-900',
  design:  'from-amber-400 to-orange-500',
};

const categoryLabel = {
  website: 'Website Project',
  android: 'Android App Project',
  video:   'Video Editing Project',
  design:  'Design Project',
};

export default function Projects() {
  const { isDarkMode } = useDarkMode();
  const [projects, setProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/projects')
      .then((res) => setProjects(res.data.data || res.data))
      .catch(() => setProjects(dummyProjects))
      .finally(() => setLoading(false));
  }, []);

  const filtered = projects.filter((p) => {
    const matchCategory = activeFilter === 'all' || p.category === activeFilter;
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className={`min-h-screen ${
      isDarkMode ? 'bg-gray-900' : 'bg-white'
    }`}>

      {/* ── HERO SECTION ── */}
      <section className={`py-20 ${
        isDarkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-green-50 via-white to-blue-50'
      }`}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h1 className={`font-sora font-bold text-5xl md:text-6xl mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              My Projects
            </h1>
            <p className={`text-lg leading-relaxed max-w-2xl mx-auto ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              A collection of work I've done across web development, mobile apps, 
              video editing, and UI/UX design. Explore my portfolio and see what I can do.
            </p>
          </div>
        </div>
      </section>

      {/* ── PROJECTS GRID SECTION ── */}
      <section className={`max-w-6xl mx-auto px-6 py-16 ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      }`}>
        <div className="mb-10">
          <h2 className={`font-sora font-bold text-3xl mb-8 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>All Projects</h2>

          {/* Search bar */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full px-6 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                  : 'border-gray-200 text-gray-700 placeholder-gray-400'
              }`}
            />
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All' },
              { key: 'website', label: 'Websites' },
              { key: 'android', label: 'Android Apps' },
              { key: 'video', label: 'Video' },
              { key: 'design', label: 'Design' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === tab.key
                    ? 'bg-gray-900 text-white'
                    : isDarkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className={`mb-6 text-sm ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Showing <span className={`font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>{filtered.length}</span> project{filtered.length !== 1 ? 's' : ''}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={`rounded-2xl h-96 animate-pulse ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
              }`} />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} isDarkMode={isDarkMode} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className={`text-2xl font-semibold mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>No projects found</h3>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Try adjusting your filter or search query</p>
          </div>
        )}
      </section>

    </div>
  );
}

/* ── Project Card Component ── */
function ProjectCard({ project, isDarkMode }) {
  return (
    <Link to={`/projects/${project.slug}`}>
      <div className={`rounded-2xl border overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer h-full flex flex-col ${
        isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-green-500' : 'bg-white border-gray-100'
      }`}>

        {/* Thumbnail */}
        <div className={`h-48 bg-gradient-to-br ${categoryColors[project.category] || 'from-gray-400 to-gray-600'} flex items-center justify-center relative overflow-hidden`}>
          {project.thumbnail ? (
            <img
              src={project.thumbnail}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <span className="font-sora font-bold text-white text-3xl opacity-70">
              {project.title.substring(0, 2).toUpperCase()}
            </span>
          )}
          {project.category === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
              <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                <span className="text-2xl">▶</span>
              </div>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col flex-grow">
          
          {/* Category badge */}
          <div className="inline-flex items-center mb-3">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              project.category === 'website' ? isDarkMode ? 'bg-indigo-900/40 text-indigo-300' : 'bg-green-100 text-green-700' :
              project.category === 'android' ? isDarkMode ? 'bg-fuchsia-900/40 text-blue-300' : 'bg-blue-100 text-blue-700' :
              project.category === 'video' ? isDarkMode ? 'bg-slate-700 text-slate-200' : 'bg-slate-200 text-slate-700' :
              isDarkMode ? 'bg-amber-900/40 text-amber-300' : 'bg-amber-100 text-amber-700'
            }`}>
              {categoryLabel[project.category] || project.category}
            </span>
          </div>

          {/* Title */}
          <h3 className={`font-sora font-bold text-lg mb-2 line-clamp-2 group-hover:text-green-500 transition-colors ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {project.title}
          </h3>

          {/* Description */}
          <p className={`text-sm leading-relaxed mb-4 flex-grow line-clamp-3 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {project.short_description || project.description?.substring(0, 100) + '...'}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(project.tags || []).slice(0, 3).map((tag) => (
              <span
                key={tag}
                className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {tag}
              </span>
            ))}
            {project.tags && project.tags.length > 3 && (
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
              }`}>
                +{project.tags.length - 3}
              </span>
            )}
          </div>

          {/* Footer — view link */}
          <div className={`flex items-center justify-between pt-4 border-t transition-colors ${
            isDarkMode ? 'border-gray-700 group-hover:border-green-500' : 'border-gray-100 group-hover:border-green-500'
          }`}>
            <span className="text-sm font-semibold text-green-500 group-hover:text-green-600">
              View Details
            </span>
            <span className="text-lg group-hover:translate-x-1 transition-transform">↗</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ── Dummy Projects Data ── */
const dummyProjects = [
];
