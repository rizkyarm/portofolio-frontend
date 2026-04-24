import { useState, useEffect } from 'react';
import {
  Mail, MailOpen, Trash2, Search, X,
  CheckCircle, AlertCircle, Clock,
  ChevronLeft, ChevronRight, RefreshCw,
  MessageSquare, Reply
} from 'lucide-react';
import api from '../../services/api';
import { useDarkMode } from '../../context/DarkModeContext';

/* ── Toast ── */
function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [toast, onClose]);
  
  if (!toast) return null;
  const ok = toast.type === 'success';
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-white text-sm font-semibold transition-all ${ok ? 'bg-emerald-500' : 'bg-red-500'}`}>
      {ok ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      {toast.message}
      <button onClick={onClose} className="ml-1 opacity-70 hover:opacity-100">
        <X size={14} />
      </button>
    </div>
  );
}

/* ── Delete Modal ── */
function DeleteModal({ message, onConfirm, onCancel, loading, isDarkMode }) {
  if (!message) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`rounded-3xl p-6 w-full max-w-sm shadow-2xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${isDarkMode ? 'bg-red-500/10' : 'bg-red-50'}`}>
          <Trash2 size={22} className="text-red-500" />
        </div>
        <h3 className={`font-sora font-bold text-center mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Hapus Pesan?
        </h3>
        <p className={`text-sm text-center mb-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Pesan dari <strong className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>{message.name}</strong> akan dihapus permanen.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} disabled={loading}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl border transition-colors disabled:opacity-50 ${isDarkMode ? 'border-gray-700 bg-gray-700 text-gray-300 hover:bg-gray-600' : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>
            Batal
          </button>
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {loading
              ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <Trash2 size={14} />}
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Message Detail Panel ── */
function MessageDetail({ message, onClose, onMarkRead, onDelete, isDarkMode }) {
  if (!message) return null;
  const initials = message.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const colors   = ['#6c5ce7','#e84393','#00b894','#f39c12','#0984e3'];
  const color    = colors[message.id % colors.length] || '#6c5ce7';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className={`rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg shadow-2xl border overflow-hidden ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>

        {/* Header */}
        <div className={`flex items-center gap-3 px-6 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{ background: color }}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className={`font-sora font-bold text-sm truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {message.name}
            </div>
            <div className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {message.email}
            </div>
          </div>
          <button onClick={onClose}
            className={`w-8 h-8 flex items-center justify-center rounded-xl transition-colors ${isDarkMode ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' : 'bg-gray-50 text-gray-500 hover:bg-gray-200'}`}>
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {message.subject && (
            <div className="mb-4">
              <div className={`text-xs font-semibold uppercase tracking-widest mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Subjek
              </div>
              <div className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                {message.subject}
              </div>
            </div>
          )}

          <div className="mb-4">
            <div className={`text-xs font-semibold uppercase tracking-widest mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Pesan
            </div>
            <div className={`rounded-2xl p-4 text-sm leading-relaxed ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-slate-50 text-slate-700'}`}>
              {message.body}
            </div>
          </div>

          {/* Meta */}
          <div className={`flex flex-wrap items-center gap-3 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            <div className="flex items-center gap-1.5">
              <Clock size={12} />
              {message.created_at}
            </div>
            {message.is_read && (
              <div className="flex items-center gap-1.5 text-emerald-500">
                <CheckCircle size={12} />
                Sudah dibaca
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-6 pb-6">
          <a
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${message.email}&su=Re: ${message.subject || 'Pesan dari Portfolio'}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-brand-purple text-white text-sm font-semibold rounded-xl transition-all hover:bg-purple-700 shadow-lg shadow-purple-500/20"
          >
            <Reply size={15} />
            Balas via Gmail
          </a>
          {!message.is_read && (
            <button onClick={() => onMarkRead(message)}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl border transition-colors ${isDarkMode ? 'border-gray-700 bg-gray-700 text-gray-300 hover:bg-gray-600' : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>
              <MailOpen size={15} />
            </button>
          )}
          <button onClick={() => onDelete(message)}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-colors ${isDarkMode ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-red-50 text-red-500 hover:bg-red-100'}`}>
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

const PER_PAGE = 10;

/* ── Main Component ── */
export default function MessagesAdmin() {
  const { isDarkMode } = useDarkMode();
  
  const [messages,   setMessages]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [filter,     setFilter]     = useState('all');
  const [page,       setPage]       = useState(1);
  const [selected,   setSelected]   = useState(null);
  const [delTarget,  setDelTarget]  = useState(null);
  const [delLoading, setDelLoading] = useState(false);
  const [toast,      setToast]      = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMessages = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res  = await api.get('/admin/messages');
      const data = res.data.data || res.data || [];
      setMessages(data.length > 0 ? data : []) ;
    } catch {
      setMessages([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);
  useEffect(() => { setPage(1); }, [search, filter]);

  /* Filter */
  const filtered = messages.filter(m => {
    const q = search.toLowerCase();
    const matchSearch = !search ||
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      (m.subject || '').toLowerCase().includes(q) ||
      m.body.toLowerCase().includes(q);
    const matchFilter =
      filter === 'all'    ? true :
      filter === 'unread' ? !m.is_read :
      filter === 'read'   ? m.is_read : true;
    return matchSearch && matchFilter;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const unreadCount = messages.filter(m => !m.is_read).length;

  const handleMarkRead = async (message) => {
    if (message.is_read) return;
    try {
      await api.put(`/admin/messages/${message.id}/read`);
      setMessages(prev => prev.map(m => m.id === message.id ? { ...m, is_read: true } : m));
      if (selected?.id === message.id) {
        setSelected(prev => ({ ...prev, is_read: true }));
      }
    } catch {
      setToast({ type: 'error', message: 'Gagal menandai pesan.' });
    }
  };

  const handleMarkAllRead = async () => {
    const unread = messages.filter(m => !m.is_read);
    try {
      await Promise.all(unread.map(m => api.put(`/admin/messages/${m.id}/read`)));
      setMessages(prev => prev.map(m => ({ ...m, is_read: true })));
      setToast({ type: 'success', message: 'Semua pesan ditandai sudah dibaca!' });
    } catch {
      setToast({ type: 'error', message: 'Gagal menandai semua pesan.' });
    }
  };

  const handleDelete = async () => {
    if (!delTarget) return;
    setDelLoading(true);
    try {
      await api.delete(`/admin/messages/${delTarget.id}`);
      setMessages(prev => prev.filter(m => m.id !== delTarget.id));
      if (selected?.id === delTarget.id) setSelected(null);
      setToast({ type: 'success', message: 'Pesan berhasil dihapus!' });
    } catch {
      setToast({ type: 'error', message: 'Gagal menghapus pesan.' });
    } finally {
      setDelLoading(false);
      setDelTarget(null);
    }
  };

  const handleOpenMessage = (message) => {
    setSelected(message);
    handleMarkRead(message);
  };

  const colors = ['#6c5ce7','#e84393','#00b894','#f39c12','#0984e3'];
  const getColor = (id) => colors[id % colors.length];

  return (
    <div className={`p-6 md:p-8 max-w-full mx-auto h-full ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className={`font-sora font-bold text-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Messages
          </h1>
          <p className={`text-sm mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {loading ? '...' : `${messages.length} total · `}
            {!loading && unreadCount > 0 && (
              <span className="font-semibold text-red-400">{unreadCount} belum dibaca</span>
            )}
            {!loading && unreadCount === 0 && (
              <span className="text-emerald-500 font-semibold">Semua terbaca ✓</span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {unreadCount > 0 && (
            <button onClick={handleMarkAllRead}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl border transition-colors ${isDarkMode ? 'border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}>
              <CheckCircle size={13} />
              Tandai Semua Dibaca
            </button>
          )}
          <button onClick={() => fetchMessages(true)} disabled={refreshing}
            className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-all hover:scale-105 disabled:opacity-50 ${isDarkMode ? 'border-gray-700 bg-gray-800 text-gray-300' : 'border-gray-200 bg-white text-gray-600'}`}>
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Pesan',   value: messages.length, color: 'text-brand-purple', bg: isDarkMode ? 'bg-brand-purple/20' : 'bg-brand-purple/10' },
          { label: 'Belum Dibaca',  value: unreadCount,     color: 'text-red-500',      bg: isDarkMode ? 'bg-red-500/20' : 'bg-red-50' },
          { label: 'Sudah Dibaca',  value: messages.length - unreadCount, color: 'text-emerald-500', bg: isDarkMode ? 'bg-emerald-500/20' : 'bg-emerald-50' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl border p-4 transition-all hover:shadow-md ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <div className="flex items-center justify-between mb-1">
              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{s.label}</span>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${s.bg}`}>
                <MessageSquare size={13} className={s.color} />
              </div>
            </div>
            <div className={`font-sora font-bold text-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {loading ? '—' : s.value}
            </div>
          </div>
        ))}
      </div>

      {/* ── Search + Filter ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          <input
            type="text"
            placeholder="Cari pengirim, email, atau isi pesan..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm outline-none transition-all ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-brand-purple' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-brand-purple'}`}
          />
          {search && (
            <button onClick={() => setSearch('')}
              className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}>
              <X size={14} />
            </button>
          )}
        </div>

        <div className={`flex gap-1 p-1 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-slate-50 border border-gray-100'}`}>
          {[
            { key: 'all',    label: 'Semua' },
            { key: 'unread', label: `Belum (${unreadCount})` },
            { key: 'read',   label: 'Dibaca' },
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                filter === f.key 
                  ? (isDarkMode ? 'bg-gray-700 text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm border border-gray-200')
                  : (isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700')
              }`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Message List ── */}
      <div className={`rounded-2xl border overflow-hidden ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>

        {loading ? (
          <div className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-4 p-5">
                <div className={`w-10 h-10 rounded-full animate-pulse flex-shrink-0 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`} />
                <div className="flex-1">
                  <div className={`h-4 rounded-lg animate-pulse mb-2 w-2/5 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`} />
                  <div className={`h-3 rounded animate-pulse mb-1.5 w-3/4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`} />
                  <div className={`h-3 rounded animate-pulse w-1/2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`} />
                </div>
              </div>
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <Mail size={24} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
            </div>
            <p className={`font-semibold mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {search ? 'Pesan tidak ditemukan' : 'Belum ada pesan masuk'}
            </p>
            <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              {search ? 'Coba kata kunci lain' : 'Pesan dari form contact akan muncul di sini'}
            </p>
          </div>
        ) : (
          <div>
            {paginated.map((msg, i) => {
              const color    = getColor(msg.id || i);
              const initials = msg.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
              return (
                <div
                  key={msg.id}
                  onClick={() => handleOpenMessage(msg)}
                  className={`flex items-start gap-4 px-5 py-4 cursor-pointer transition-colors border-b last:border-0 group ${
                    !msg.is_read 
                      ? (isDarkMode ? 'bg-brand-purple/10 border-gray-700 hover:bg-gray-700' : 'bg-brand-purple/5 border-gray-100 hover:bg-slate-50')
                      : (isDarkMode ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-100 hover:bg-gray-50')
                  }`}
                >
                  <div className="flex-shrink-0 mt-1.5">
                    <div className={`w-2 h-2 rounded-full ${!msg.is_read ? 'bg-brand-purple' : 'bg-transparent'}`} />
                  </div>

                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ background: color }}>
                    {initials}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className={`text-sm truncate ${!msg.is_read ? 'font-bold' : 'font-medium'} ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                        {msg.name}
                      </span>
                      <span className={`text-xs flex-shrink-0 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {msg.created_at}
                      </span>
                    </div>
                    <div className={`text-xs truncate mb-0.5 ${!msg.is_read ? 'font-semibold' : ''} ${!msg.is_read ? (isDarkMode ? 'text-gray-300' : 'text-gray-800') : (isDarkMode ? 'text-gray-500' : 'text-gray-500')}`}>
                      {msg.subject || '(Tanpa subjek)'}
                    </div>
                    <div className={`text-xs truncate ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {msg.body}
                    </div>
                  </div>

                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    {!msg.is_read && (
                      <button
                        onClick={e => { e.stopPropagation(); handleMarkRead(msg); }}
                        className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${isDarkMode ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                        title="Tandai dibaca"
                      >
                        <MailOpen size={12} />
                      </button>
                    )}
                    <button
                      onClick={e => { e.stopPropagation(); setDelTarget(msg); }}
                      className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${isDarkMode ? 'text-red-400 hover:bg-red-500/20' : 'hover:bg-red-100 text-red-500'}`}
                      title="Hapus"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Pagination ── */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} dari {filtered.length}
          </p>
          <div className="flex gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-colors disabled:opacity-40 ${isDarkMode ? 'border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700' : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'}`}>
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1;
              if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) return (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                    page === p 
                      ? 'bg-brand-purple text-white border-transparent' 
                      : (isDarkMode ? 'border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700' : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50')
                  } border`}>
                  {p}
                </button>
              );
              if (Math.abs(p - page) === 2) return (
                <span key={p} className={`text-xs px-1 flex items-center ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`}>…</span>
              );
              return null;
            })}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-colors disabled:opacity-40 ${isDarkMode ? 'border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700' : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'}`}>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ── Modals ── */}
      {selected && (
        <MessageDetail
          message={selected}
          onClose={() => setSelected(null)}
          onMarkRead={handleMarkRead}
          onDelete={m => { setSelected(null); setDelTarget(m); }}
          isDarkMode={isDarkMode}
        />
      )}
      <DeleteModal
        message={delTarget}
        onConfirm={handleDelete}
        onCancel={() => setDelTarget(null)}
        loading={delLoading}
        isDarkMode={isDarkMode}
      />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

