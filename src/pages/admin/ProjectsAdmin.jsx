import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, Search, Filter, Edit2, Trash2,
  Eye, ChevronLeft, ChevronRight, FolderOpen,
  AlertCircle, CheckCircle, X, ExternalLink,
  ArrowUpDown, MoreVertical,
} from 'lucide-react';
import api from '../../services/api';
import { useDarkMode } from '../../context/DarkModeContext';

/* ── Config ── */
const CATEGORIES = [
  { key: 'all',     label: 'Semua' },
  { key: 'website', label: 'Website' },
  { key: 'android', label: 'Android' },
  { key: 'video',   label: 'Video' },
  { key: 'design',  label: 'Design' },
];

const STATUSES = [
  { key: 'all',   label: 'Semua Status' },
  { key: 'live',  label: 'Live' },
  { key: 'draft', label: 'Draft' },
];

const categoryStyle = {
  website: 'bg-indigo-100 text-indigo-700',
  android: 'bg-fuchsia-100 text-fuchsia-700',
  video:   'bg-slate-100 text-slate-700',
  design:  'bg-amber-100 text-amber-700',
};

const statusStyle = {
  live:  'bg-green-100 text-green-700',
  draft: 'bg-yellow-100 text-yellow-700',
};

const PER_PAGE = 8;

/* ── Toast ── */
function Toast({ toast, onClose, isDarkMode }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  if (!toast) return null;
  const isSuccess = toast.type === 'success';
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-white text-sm font-semibold transition-all ${isSuccess ? 'bg-green-500' : 'bg-red-500'}`}>
      {isSuccess
        ? <CheckCircle size={16} />
        : <AlertCircle size={16} />}
      {toast.message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
        <X size={14} />
      </button>
    </div>
  );
}

/* ── Delete Confirm Modal ── */
function DeleteModal({ project, onConfirm, onCancel, loading, isDarkMode }) {
  if (!project) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 w-full max-w-sm shadow-2xl`}>
        <div className={`w-12 h-12 ${isDarkMode ? 'bg-red-500/10' : 'bg-red-50'} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
          <Trash2 size={20} className="text-red-500" />
        </div>
        <h3 className={`font-sora font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} text-center mb-2`}>
          Hapus Project?
        </h3>
        <p className="text-gray-400 text-sm text-center mb-1">
          Kamu akan menghapus:
        </p>
        <p className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'} text-center text-sm mb-5 px-4 truncate`}>
          "{project.title}"
        </p>
        <p className="text-xs text-red-400 text-center mb-6">
          Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className={`flex-1 py-2.5 border text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 ${isDarkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-700' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Trash2 size={14} />
            )}
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Row Actions Dropdown ── */
function RowActions({ project, onDelete, isDarkMode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${isDarkMode ? 'text-gray-500 hover:bg-gray-700 hover:text-gray-200' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
      >
        <MoreVertical size={15} />
      </button>
      {open && (
        <div className={`absolute right-0 top-full mt-1 rounded-xl border shadow-xl z-20 overflow-hidden w-40 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <Link
            to={`/projects/${project.slug}`}
            target="_blank"
            className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-50'}`}
            onClick={() => setOpen(false)}
          >
            <Eye size={13} />
            Lihat di Site
          </Link>
          <Link
            to={`/admin/projects/${project.id}/edit`}
            className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-50'}`}
            onClick={() => setOpen(false)}
          >
            <Edit2 size={13} />
            Edit
          </Link>
          {project.demo_url && (
            
            <a
              href={project.demo_url}
              target="_blank"
              rel="noreferrer"
              className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setOpen(false)}
            >
              <ExternalLink size={13} />
              Live Demo
            </a>
          )}
          <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-50'}`} />
          <button
            onClick={() => { setOpen(false); onDelete(project); }}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${isDarkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-500 hover:bg-red-50'}`}
          >
            <Trash2 size={13} />
            Hapus
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Skeleton Row ── */
function SkeletonRow({ isDarkMode }) {
  return (
    <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-50'}`}>
      {[1,2,3,4,5,6].map(i => (
        <td key={i} className="px-5 py-4">
          <div className={`h-4 animate-pulse rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} style={{ width: `${60 + i * 10}%` }} />
        </td>
      ))}
    </tr>
  );
}

/* ── Main Component ── */
export default function ProjectsAdmin() {
  const { isDarkMode } = useDarkMode();
  const [projects,  setProjects]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [stsFilter, setStsFilter] = useState('all');
  const [sortBy,    setSortBy]    = useState('created_at');
  const [sortDir,   setSortDir]   = useState('desc');
  const [page,      setPage]      = useState(1);
  const [delTarget, setDelTarget] = useState(null);
  const [delLoading,setDelLoading]= useState(false);
  const [toast,     setToast]     = useState(null);

  /* Fetch projects */
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res  = await api.get('/projects');
      const data = res.data.data || res.data || [];
      setProjects(data);
    } catch {
      setProjects(dummyProjects);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  useEffect(() => { setPage(1); }, [search, catFilter, stsFilter]);

  /* Filter + sort */
  const filtered = projects
    .filter((p) => {
      const matchSearch = !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        (p.tags || []).some(t => t.toLowerCase().includes(search.toLowerCase()));
      const matchCat = catFilter === 'all' || p.category === catFilter;
      const matchSts = stsFilter === 'all' || p.status === stsFilter;
      return matchSearch && matchCat && matchSts;
    })
    .sort((a, b) => {
      let valA = a[sortBy] || '';
      let valB = b[sortBy] || '';
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  /* Pagination */
  const totalPages  = Math.ceil(filtered.length / PER_PAGE);
  const paginated   = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  /* Sort toggle */
  const toggleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('asc'); }
  };

  /* Delete */
  const handleDelete = async () => {
    if (!delTarget) return;
    setDelLoading(true);
    try {
      await api.delete(`/admin/projects/${delTarget.id}`);
      setProjects(prev => prev.filter(p => p.id !== delTarget.id));
      setToast({ type: 'success', message: 'Project berhasil dihapus!' });
    } catch {
      setToast({ type: 'error', message: 'Gagal menghapus project.' });
    } finally {
      setDelLoading(false);
      setDelTarget(null);
    }
  };

  /* Toggle status live/draft */
  const toggleStatus = async (project) => {
    const newStatus = project.status === 'live' ? 'draft' : 'live';
    try {
      await api.put(`/admin/projects/${project.id}`, { status: newStatus });
      setProjects(prev =>
        prev.map(p => p.id === project.id ? { ...p, status: newStatus } : p)
      );
      setToast({ type: 'success', message: `Status diubah ke ${newStatus}!` });
    } catch {
      setToast({ type: 'error', message: 'Gagal mengubah status.' });
    }
  };

  const SortIcon = ({ col }) => (
    <ArrowUpDown
      size={12}
      className={`ml-1 inline transition-colors ${sortBy === col ? 'text-brand-purple' : 'text-gray-300'}`}
    />
  );

  return (
    <div className={`p-6 md:p-8 max-w-full mx-auto h-full ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className={`font-sora font-bold text-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Projects</h1>
          <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mt-0.5`}>
            {loading ? '...' : `${filtered.length} project ditemukan`}
          </p>
        </div>
        <Link
          to="/admin/projects/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-purple text-white text-sm font-semibold rounded-xl hover:bg-purple-700 transition-colors self-start sm:self-auto"
        >
          <Plus size={16} />
          Tambah Project
        </Link>
      </div>

      {/* ── Filters ── */}
      <div className={`rounded-2xl border p-4 mb-5 flex flex-col md:flex-row gap-3 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>

        {/* Search */}
        <div className="relative flex-1">
          <Search size={15} className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
          <input
            type="text"
            placeholder="Cari project atau teknologi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl outline-none focus:ring-2 transition-all ${isDarkMode ? 'bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:border-brand-purple focus:ring-brand-purple/20' : 'border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-brand-purple focus:ring-brand-purple/10'}`}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category filter */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCatFilter(cat.key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                catFilter === cat.key
                  ? 'bg-brand-navy text-white border-brand-navy'
                  : isDarkMode ? 'bg-gray-700 text-gray-300 border-gray-600 hover:border-gray-500' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <select
          value={stsFilter}
          onChange={(e) => setStsFilter(e.target.value)}
          className={`px-3.5 py-2.5 text-sm rounded-xl outline-none focus:border-brand-purple cursor-pointer transition-all ${isDarkMode ? 'bg-gray-700 border border-gray-600 text-gray-200 focus:ring-2 focus:ring-brand-purple/20' : 'border border-gray-200 bg-white text-gray-600 focus:border-brand-purple'}`}
        >
          {STATUSES.map(s => (
            <option key={s.key} value={s.key}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* ── Table ── */}
      <div className={`rounded-2xl border overflow-hidden ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>

        {/* Active filters summary */}
        {(search || catFilter !== 'all' || stsFilter !== 'all') && (
          <div className={`px-5 py-3 border-b flex items-center gap-2 text-xs ${isDarkMode ? 'bg-gray-700/50 border-gray-700 text-brand-purple' : 'bg-brand-pale/30 border-brand-pale text-brand-purple'}`}>
            <Filter size={12} className="text-brand-purple" />
            <span className="font-medium">Filter aktif:</span>
            {search && (
              <span className={`px-2 py-0.5 rounded-full border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-white border-brand-pale text-gray-600'}`}>
                "{search}"
              </span>
            )}
            {catFilter !== 'all' && (
              <span className={`px-2 py-0.5 rounded-full border capitalize ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-white border-brand-pale text-gray-600'}`}>
                {catFilter}
              </span>
            )}
            {stsFilter !== 'all' && (
              <span className={`px-2 py-0.5 rounded-full border capitalize ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-white border-brand-pale text-gray-600'}`}>
                {stsFilter}
              </span>
            )}
            <button
              onClick={() => { setSearch(''); setCatFilter('all'); setStsFilter('all'); }}
              className={`ml-auto font-semibold transition-colors ${isDarkMode ? 'text-brand-purple hover:text-purple-400' : 'text-brand-purple hover:text-purple-700'}`}
            >
              Reset
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${isDarkMode ? 'border-gray-700 bg-gray-700/50' : 'border-gray-100 bg-gray-50/50'}`}>
                <th
                  className={`text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wide cursor-pointer transition-colors ${isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                  onClick={() => toggleSort('title')}
                >
                  Project <SortIcon col="title" />
                </th>
                <th className={`text-left px-3 py-3.5 text-xs font-semibold uppercase tracking-wide hidden md:table-cell ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  Kategori
                </th>
                <th className={`text-left px-3 py-3.5 text-xs font-semibold uppercase tracking-wide hidden lg:table-cell ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  Teknologi
                </th>
                <th
                  className={`text-left px-3 py-3.5 text-xs font-semibold uppercase tracking-wide cursor-pointer transition-colors ${isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                  onClick={() => toggleSort('status')}
                >
                  Status <SortIcon col="status" />
                </th>
                <th
                  className={`text-left px-3 py-3.5 text-xs font-semibold uppercase tracking-wide hidden sm:table-cell cursor-pointer transition-colors ${isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                  onClick={() => toggleSort('created_at')}
                >
                  Tanggal <SortIcon col="created_at" />
                </th>
                <th className={`text-right px-5 py-3.5 text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} isDarkMode={isDarkMode} />)
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <FolderOpen size={24} className={isDarkMode ? 'text-gray-600' : 'text-gray-300'} />
                      </div>
                      <p className={`text-sm font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {search || catFilter !== 'all' || stsFilter !== 'all'
                          ? 'Tidak ada project yang cocok'
                          : 'Belum ada project'}
                      </p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {search || catFilter !== 'all'
                          ? 'Coba ubah filter pencarian'
                          : 'Tambahkan project pertama kamu'}
                      </p>
                      {!search && catFilter === 'all' && (
                        <Link
                          to="/admin/projects/create"
                          className="mt-1 inline-flex items-center gap-1.5 px-4 py-2 bg-brand-purple text-white text-xs font-semibold rounded-xl"
                        >
                          <Plus size={13} />
                          Tambah Project
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((project) => (
                  <tr
                    key={project.id}
                    className={`border-b last:border-0 transition-colors ${isDarkMode ? 'border-gray-700 hover:bg-gray-700/30' : 'border-gray-50 hover:bg-gray-50/40'}`}
                  >
                    {/* Title */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {/* Thumbnail mini */}
                        <div className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-white text-xs font-bold bg-gradient-to-br ${
                          project.category === 'website' ? 'from-indigo-400 to-purple-500' :
                          project.category === 'android' ? 'from-fuchsia-400 to-purple-500' :
                          project.category === 'video'   ? 'from-slate-500 to-slate-700' :
                          'from-amber-400 to-orange-500'
                        }`}>
                          {project.title?.charAt(0)}
                        </div>
                        <div>
                          <div className={`font-semibold text-sm max-w-[180px] truncate ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                            {project.title}
                          </div>
                          <div className={`text-xs max-w-[180px] truncate ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            {project.short_description || '—'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-3 py-4 hidden md:table-cell">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${isDarkMode && project.category in categoryStyle ? 'opacity-75' : ''} ${categoryStyle[project.category] || (isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600')}`}>
                        {project.category}
                      </span>
                    </td>

                    {/* Tags */}
                    <td className="px-3 py-4 hidden lg:table-cell">
                      <div className="flex gap-1 flex-wrap max-w-[180px]">
                        {(project.tags || []).slice(0, 2).map(tag => (
                          <span key={tag} className={`text-xs px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                            {tag}
                          </span>
                        ))}
                        {(project.tags || []).length > 2 && (
                          <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            +{project.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status toggle */}
                    <td className="px-3 py-4">
                      <button
                        onClick={() => toggleStatus(project)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize cursor-pointer hover:opacity-80 transition-opacity ${isDarkMode && project.status in statusStyle ? 'opacity-75' : ''} ${statusStyle[project.status] || (isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600')}`}
                        title="Klik untuk toggle status"
                      >
                        {project.status}
                      </button>
                    </td>

                    {/* Date */}
                    <td className="px-3 py-4 hidden sm:table-cell">
                      <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {project.created_at || '—'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/admin/projects/${project.id}/edit`}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${isDarkMode ? 'text-gray-500 hover:bg-gray-700 hover:text-indigo-400' : 'text-gray-400 hover:bg-indigo-50 hover:text-indigo-600'}`}
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </Link>
                        <button
                          onClick={() => setDelTarget(project)}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${isDarkMode ? 'text-gray-500 hover:bg-gray-700 hover:text-red-400' : 'text-gray-400 hover:bg-red-50 hover:text-red-500'}`}
                          title="Hapus"
                        >
                          <Trash2 size={14} />
                        </button>
                        <RowActions
                          project={project}
                          onDelete={setDelTarget}
                          isDarkMode={isDarkMode}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        {!loading && totalPages > 1 && (
          <div className={`flex items-center justify-between px-5 py-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Menampilkan {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} dari {filtered.length} project
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${isDarkMode ? 'border-gray-700 text-gray-500 hover:bg-gray-700' : 'border-gray-200 text-gray-400 hover:bg-gray-50'}`}
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => {
                const p = i + 1;
                if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) {
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                        page === p
                          ? 'bg-brand-purple text-white'
                          : isDarkMode ? 'border border-gray-700 text-gray-400 hover:bg-gray-700' : 'border border-gray-200 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </button>
                  );
                }
                if (Math.abs(p - page) === 2) {
                  return <span key={p} className={`text-xs px-1 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`}>…</span>;
                }
                return null;
              })}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${isDarkMode ? 'border-gray-700 text-gray-500 hover:bg-gray-700' : 'border-gray-200 text-gray-400 hover:bg-gray-50'}`}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Modals & Toast ── */}
      <DeleteModal
        project={delTarget}
        onConfirm={handleDelete}
        onCancel={() => setDelTarget(null)}
        loading={delLoading}
        isDarkMode={isDarkMode}
      />
      <Toast
        toast={toast}
        onClose={() => setToast(null)}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}

/* ── Dummy data ── */
const dummyProjects = [];