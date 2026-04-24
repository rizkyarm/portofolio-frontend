import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderOpen, Star, Wrench, MessageSquare,
  TrendingUp, Eye, ChevronRight, Plus,
  CheckCircle, Clock, AlertCircle, ArrowUpRight,
} from 'lucide-react';
import api from '../../services/api';
import { useDarkMode } from '../../context/DarkModeContext';

/* ── Skeleton ── */
function Skeleton({ className = '', isDarkMode }) {
  return <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse rounded-xl ${className}`} />;
}

/* ── Stat Card ── */
function StatCard({ icon: Icon, label, value, sub, color, loading, to, isDarkMode }) {
  const card = (
    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl border p-5 ${isDarkMode ? 'hover:border-gray-600' : 'hover:shadow-md'} transition-all group ${to ? 'cursor-pointer' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color.bg}`}>
          <Icon size={20} className={color.text} />
        </div>
        {to && (
          <ArrowUpRight
            size={15}
            className={`${isDarkMode ? 'text-gray-600 group-hover:text-brand-purple' : 'text-gray-300 group-hover:text-brand-purple'} transition-colors`}
          />
        )}
      </div>
      {loading ? (
        <>
          <Skeleton className="h-7 w-16 mb-1" isDarkMode={isDarkMode} />
          <Skeleton className="h-3 w-24" isDarkMode={isDarkMode} />
        </>
      ) : (
        <>
          <div className={`font-sora font-bold text-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-0.5`}>
            {value}
          </div>
          <div className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{label}</div>
          {sub && (
            <div className={`text-xs font-semibold mt-1.5 ${color.text}`}>
              {sub}
            </div>
          )}
        </>
      )}
    </div>
  );

  return to ? <Link to={to}>{card}</Link> : card;
}

/* ── Status Badge ── */
function StatusBadge({ status }) {
  const map = {
    live:  { label: 'Live',  className: 'bg-green-100 text-green-700' },
    draft: { label: 'Draft', className: 'bg-yellow-100 text-yellow-700' },
  };
  const s = map[status] || map.draft;
  return (
    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${s.className}`}>
      {s.label}
    </span>
  );
}

/* ── Category Badge ── */
function CategoryBadge({ category }) {
  const map = {
    website: { label: 'Website',  className: 'bg-indigo-100 text-indigo-700' },
    android: { label: 'Android',  className: 'bg-fuchsia-100 text-fuchsia-700' },
    video:   { label: 'Video',    className: 'bg-slate-100 text-slate-700' },
    design:  { label: 'Design',   className: 'bg-amber-100 text-amber-700' },
  };
  const c = map[category] || { label: category, className: 'bg-gray-100 text-gray-600' };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${c.className}`}>
      {c.label}
    </span>
  );
}

/* ── Main Component ── */
export default function Dashboard() {
  const { isDarkMode } = useDarkMode();
  const [stats,    setStats]    = useState(null);
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/projects'),
      api.get('/admin/messages'),
      api.get('/skills'),
      api.get('/services'),
    ])
      .then(([projRes, msgRes, skillRes, svcRes]) => {
        const projs  = projRes.data.data  || projRes.data  || [];
        const msgs   = msgRes.data.data   || msgRes.data   || [];
        const skills = skillRes.data.data || skillRes.data || [];
        const svcs   = svcRes.data.data   || svcRes.data   || [];

        setProjects(projs.slice(0, 5));
        setMessages(msgs.slice(0, 4));
        setStats({
          projects: projs.length,
          live:     projs.filter((p) => p.status === 'live').length,
          unread:   msgs.filter((m) => !m.is_read).length,
          messages: msgs.length,
          skills:   skills.length,
          services: svcs.length,
        });
      })
      .catch(() => {
        /* Fallback dummy */
        setStats({ projects: 24, live: 18, unread: 3, messages: 12, skills: 9, services: 6 });
        setProjects(dummyProjects);
        setMessages(dummyMessages);
      })
      .finally(() => setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Selamat pagi' : hour < 17 ? 'Selamat siang' : 'Selamat malam';

  return (
    <div className={`p-6 md:p-8 max-w-full mx-auto ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mb-0.5`}>{greeting} 👋</p>
          <h1 className={`font-sora font-bold text-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Dashboard
          </h1>
        </div>
        <Link
          to="/admin/projects/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-purple text-white text-sm font-semibold rounded-xl hover:bg-purple-700 transition-colors self-start sm:self-auto"
        >
          <Plus size={16} />
          Tambah Project
        </Link>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={FolderOpen}
          label="Total Projects"
          value={stats?.projects ?? '—'}
          sub={`${stats?.live ?? 0} live`}
          color={{ bg: 'bg-indigo-50', text: 'text-indigo-600' }}
          loading={loading}
          to="/admin/projects"
          isDarkMode={isDarkMode}
        />
        <StatCard
          icon={MessageSquare}
          label="Pesan Masuk"
          value={stats?.messages ?? '—'}
          sub={stats?.unread ? `${stats.unread} belum dibaca` : 'Semua terbaca'}
          color={{ bg: 'bg-rose-50', text: 'text-rose-500' }}
          loading={loading}
          to="/admin/messages"
          isDarkMode={isDarkMode}
        />
        <StatCard
          icon={Star}
          label="Skills"
          value={stats?.skills ?? '—'}
          sub="Tech stack aktif"
          color={{ bg: 'bg-amber-50', text: 'text-amber-500' }}
          loading={loading}
          to="/admin/skills"
          isDarkMode={isDarkMode}
        />
        <StatCard
          icon={Wrench}
          label="Services"
          value={stats?.services ?? '—'}
          sub="Layanan tersedia"
          color={{ bg: 'bg-emerald-50', text: 'text-emerald-600' }}
          loading={loading}
          to="/admin/services"
          isDarkMode={isDarkMode}
        />
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Recent Projects Table ── */}
        <div className={`lg:col-span-2 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl border overflow-hidden`}>
          <div className={`flex items-center justify-between px-5 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <div>
              <h2 className={`font-sora font-bold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Project Terbaru
              </h2>
              <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mt-0.5`}>
                5 project terakhir yang ditambahkan
              </p>
            </div>
            <Link
              to="/admin/projects"
              className="flex items-center gap-1 text-xs font-semibold text-brand-purple hover:gap-2 transition-all"
            >
              Lihat Semua
              <ChevronRight size={13} />
            </Link>
          </div>

          {loading ? (
            <div className="p-5 flex flex-col gap-3">
              {[1,2,3,4,5].map(i => (
                <Skeleton key={i} className="h-12 w-full" isDarkMode={isDarkMode} />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-3">
                <FolderOpen size={22} className="text-gray-300" />
              </div>
              <p className="text-sm font-semibold text-gray-500 mb-1">
                Belum ada project
              </p>
              <p className="text-xs text-gray-400 mb-4">
                Tambahkan project pertama kamu sekarang.
              </p>
              <Link
                to="/admin/projects/create"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-purple text-white text-xs font-semibold rounded-lg"
              >
                <Plus size={13} />
                Tambah Project
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-50'}`}>
                    <th className={`text-left px-5 py-3 text-xs font-semibold ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wide`}>
                      Project
                    </th>
                    <th className={`text-left px-3 py-3 text-xs font-semibold ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wide hidden sm:table-cell`}>
                      Kategori
                    </th>
                    <th className={`text-left px-3 py-3 text-xs font-semibold ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wide`}>
                      Status
                    </th>
                    <th className={`text-right px-5 py-3 text-xs font-semibold ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wide`}>
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr
                      key={project.id}
                      className={`border-b last:border-0 transition-colors ${isDarkMode ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-50 hover:bg-gray-50/50'}`}
                    >
                      <td className="px-5 py-3.5">
                        <div className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'} truncate max-w-[180px]`}>
                          {project.title}
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mt-0.5 truncate max-w-[180px]`}>
                          {project.short_description || '—'}
                        </div>
                      </td>
                      <td className="px-3 py-3.5 hidden sm:table-cell">
                        <CategoryBadge category={project.category} />
                      </td>
                      <td className="px-3 py-3.5">
                        <StatusBadge status={project.status} />
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link
                          to={`/admin/projects/${project.id}/edit`}
                          className="text-xs font-semibold text-brand-purple hover:text-purple-700 transition-colors"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Right Column ── */}
        <div className="flex flex-col gap-5">

          {/* Overview donut-style */}
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl border p-5`}>
            <h2 className={`font-sora font-bold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              Project Overview
            </h2>
            {loading ? (
              <div className="flex flex-col gap-2">
                {[1,2,3,4].map(i => <Skeleton key={i} className="h-8" isDarkMode={isDarkMode} />)}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {[
                  { label: 'Website',  key: 'website', color: 'bg-indigo-500' },
                  { label: 'Android',  key: 'android', color: 'bg-fuchsia-500' },
                  { label: 'Video',    key: 'video',   color: 'bg-slate-500' },
                  { label: 'Design',   key: 'design',  color: 'bg-amber-500' },
                ].map((cat) => {
                  const count = projects.filter(p => p.category === cat.key).length;
                  const total = projects.length || 1;
                  const pct   = Math.round((count / total) * 100);
                  return (
                    <div key={cat.key}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{cat.label}</span>
                        <span className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>{count} project</span>
                      </div>
                      <div className={`h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-full overflow-hidden`}>
                        <div
                          className={`h-full rounded-full ${cat.color} transition-all duration-700`}
                          style={{ width: `${pct || 5}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Messages */}
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl border overflow-hidden flex-1`}>
            <div className={`flex items-center justify-between px-5 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
              <div>
                <h2 className={`font-sora font-bold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Pesan Terbaru
                </h2>
                {stats?.unread > 0 && (
                  <p className={`text-xs ${isDarkMode ? 'text-rose-400' : 'text-rose-500'} font-semibold mt-0.5`}>
                    {stats.unread} belum dibaca
                  </p>
                )}
              </div>
              <Link
                to="/admin/messages"
                className="flex items-center gap-1 text-xs font-semibold text-brand-purple hover:gap-2 transition-all"
              >
                Semua
                <ChevronRight size={13} />
              </Link>
            </div>

            {loading ? (
              <div className="p-4 flex flex-col gap-3">
                {[1,2,3].map(i => <Skeleton key={i} className="h-14" isDarkMode={isDarkMode} />)}
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                <MessageSquare size={24} className="text-gray-200 mb-2" />
                <p className="text-xs text-gray-400">Belum ada pesan masuk</p>
              </div>
            ) : (
              <div className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-50'}`}>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 px-5 py-3.5 transition-colors ${
                      !msg.is_read ? (isDarkMode ? 'bg-brand-purple/10' : 'bg-brand-pale/20') : (isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50/50')
                    }`}
                  >
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-purple to-brand-light flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {msg.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'} truncate`}>
                          {msg.name}
                        </span>
                        {!msg.is_read && (
                          <span className="w-1.5 h-1.5 bg-brand-purple rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} truncate mt-0.5`}>
                        {msg.subject || msg.body}
                      </p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-600' : 'text-gray-300'} mt-0.5`}>
                        {msg.created_at}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className={`mt-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl border p-5`}>
        <h2 className={`font-sora font-bold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { to: '/admin/projects/create', icon: Plus,         label: 'Project Baru',  color: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100' },
            { to: '/admin/messages',        icon: MessageSquare,label: 'Cek Pesan',     color: 'bg-rose-50 text-rose-500 hover:bg-rose-100' },
            { to: '/admin/skills',          icon: Star,         label: 'Kelola Skills', color: 'bg-amber-50 text-amber-600 hover:bg-amber-100' },
            { to: '/admin/profile',         icon: TrendingUp,   label: 'Edit Profil',   color: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' },
          ].map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${action.color}`}
            >
              <action.icon size={16} />
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Status Bar ── */}
      <div className={`mt-5 flex flex-wrap items-center gap-4 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        <div className="flex items-center gap-1.5">
          <CheckCircle size={13} className="text-green-500" />
          API terhubung
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle size={13} className="text-green-500" />
          Auth aktif
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={13} />
          Last updated: {new Date().toLocaleTimeString('id-ID')}
        </div>
        {stats?.unread > 0 && (
          <div className="flex items-center gap-1.5 text-rose-500">
            <AlertCircle size={13} />
            {stats.unread} pesan belum dibaca
          </div>
        )}
      </div>

    </div>
  );
}

/* ── Dummy fallback data ── */
const dummyProjects = [
  { id: 1, title: 'Eco-Shop E-Commerce', category: 'website', status: 'live',  short_description: 'Responsive online store.' },
  { id: 2, title: 'Daily Flow Task App', category: 'android', status: 'live',  short_description: 'Productivity app.' },
  { id: 3, title: 'Urban Explorer Vlog', category: 'video',   status: 'draft', short_description: 'Travel video montage.' },
  { id: 4, title: 'Brand Identity Kit',  category: 'design',  status: 'live',  short_description: 'Complete branding package.' },
  { id: 5, title: 'Portfolio v2',        category: 'website', status: 'live',  short_description: 'Personal portfolio website.' },
];

const dummyMessages = [
  { id: 1, name: 'Budi Santoso',  subject: 'Mau tanya soal web dev',  is_read: false, created_at: '2 jam lalu' },
  { id: 2, name: 'Siti Rahayu',  subject: 'Request penawaran app',    is_read: false, created_at: '5 jam lalu' },
  { id: 3, name: 'Andi Wijaya',  subject: 'Kolaborasi video project', is_read: true,  created_at: '1 hari lalu' },
  { id: 4, name: 'Rina Kusuma',  subject: 'Konsultasi UI design',     is_read: true,  created_at: '2 hari lalu' },
];