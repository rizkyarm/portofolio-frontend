import { useState, useEffect } from 'react';
import {
  Plus, Edit2, Trash2, Eye, EyeOff,
  CheckCircle, AlertCircle, X, Loader,
  Star, ArrowUpDown,
} from 'lucide-react';
import api from '../../services/api';
import { useDarkMode } from '../../context/DarkModeContext';

/* ── Kategori config ── */
const CATEGORIES = [
  { key: 'frontend', label: 'Frontend', color: '#6c5ce7', bg: 'bg-purple-100 text-purple-700' },
  { key: 'mobile',   label: 'Mobile',   color: '#e84393', bg: 'bg-pink-100 text-pink-700' },
  { key: 'backend',  label: 'Backend',  color: '#00b894', bg: 'bg-emerald-100 text-emerald-700' },
  { key: 'creative', label: 'Creative', color: '#f39c12', bg: 'bg-amber-100 text-amber-700' },
];

const getCatConfig = (key) =>
  CATEGORIES.find(c => c.key === key) || { label: key, color: '#999', bg: 'bg-gray-100 text-gray-600' };

/* ── Toast ── */
function Toast({ toast, onClose, isDarkMode }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  if (!toast) return null;
  const ok = toast.type === 'success';
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-white text-sm font-semibold ${ok ? 'bg-green-500' : 'bg-red-500'}`}>
      {ok ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      {toast.message}
      <button onClick={onClose} className="ml-1 opacity-70 hover:opacity-100">
        <X size={14} />
      </button>
    </div>
  );
}

/* ── Delete Modal ── */
function DeleteModal({ skill, onConfirm, onCancel, loading, isDarkMode }) {
  if (!skill) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 w-full max-w-sm shadow-2xl`}>
        <div className={`w-12 h-12 ${isDarkMode ? 'bg-red-500/10' : 'bg-red-50'} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
          <Trash2 size={20} className="text-red-500" />
        </div>
        <h3 className={`font-sora font-bold text-center mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Hapus Skill?</h3>
        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm text-center mb-5`}>
          Skill <strong className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>{skill.name}</strong> akan dihapus permanen.
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

/* ── Skill Form Modal ── */
function SkillFormModal({ skill, onSave, onClose, saving, isDarkMode }) {
  const [form, setForm] = useState({
    name:       skill?.name       ?? '',
    category:   skill?.category   ?? 'frontend',
    icon:       skill?.icon       ?? '',
    color:      skill?.color      ?? '#6c5ce7',
    level:      skill?.level      ?? 80,
    order:      skill?.order      ?? 0,
    is_visible: skill?.is_visible ?? true,
  });

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox'
      ? e.target.checked
      : e.target.type === 'number'
        ? Number(e.target.value)
        : e.target.value;
    setForm(prev => ({ ...prev, [field]: val }));
  };

  const setDirect = (field, val) =>
    setForm(prev => ({ ...prev, [field]: val }));

  const levelColor = form.level >= 80
    ? '#00b894' : form.level >= 60
    ? '#f39c12' : '#e17055';

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden`}>

        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <div>
            <h3 className={`font-sora font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {skill ? 'Edit Skill' : 'Tambah Skill Baru'}
            </h3>
            <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              {skill ? `Mengedit: ${skill.name}` : 'Isi data skill yang ingin ditambahkan'}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`w-8 h-8 flex items-center justify-center rounded-xl transition-colors ${isDarkMode ? 'text-gray-500 hover:bg-gray-700' : 'text-gray-400 hover:bg-gray-100'}`}
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">

          {/* Name */}
          <div>
            <label className={`block text-sm font-semibold mb-1.5 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Nama Skill <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={set('name')}
              placeholder="cth: React.js, Flutter, Laravel..."
              className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-brand-purple/10 transition-all ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-brand-purple' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-brand-purple'}`}
            />
          </div>

          {/* Category */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Kategori
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setDirect('category', cat.key)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border-2 transition-all ${
                    form.category === cat.key
                      ? 'border-brand-purple bg-brand-pale text-brand-purple'
                      : isDarkMode ? 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500' : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* LEVEL / PERSENTASE */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={`text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Level Keahlian
              </label>
              <div className="flex items-center gap-2">
                <span
                  className="font-sora font-bold text-2xl"
                  style={{ color: levelColor }}
                >
                  {form.level}%
                </span>
                <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {form.level >= 90 ? 'Expert'
                   : form.level >= 75 ? 'Advanced'
                   : form.level >= 60 ? 'Intermediate'
                   : form.level >= 40 ? 'Beginner'
                   : 'Newbie'}
                </span>
              </div>
            </div>

            {/* Slider */}
            <div className="relative mb-2">
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={form.level}
                onChange={set('level')}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${levelColor} 0%, ${levelColor} ${form.level}%, ${isDarkMode ? '#374151' : '#e5e7eb'} ${form.level}%, ${isDarkMode ? '#374151' : '#e5e7eb'} 100%)`,
                }}
              />
            </div>

            {/* Tick marks */}
            <div className={`flex justify-between text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              {[0, 25, 50, 75, 100].map(v => (
                <span key={v}>{v}%</span>
              ))}
            </div>

            {/* Quick select */}
            <div className="flex gap-2 mt-3 flex-wrap">
              {[
                { label: 'Newbie',       val: 20 },
                { label: 'Beginner',     val: 40 },
                { label: 'Intermediate', val: 60 },
                { label: 'Advanced',     val: 80 },
                { label: 'Expert',       val: 95 },
              ].map(opt => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setDirect('level', opt.val)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    form.level === opt.val
                      ? 'border-brand-purple bg-brand-pale text-brand-purple'
                      : isDarkMode ? 'border-gray-600 text-gray-300 hover:border-gray-500' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {opt.label} ({opt.val}%)
                </button>
              ))}
            </div>

            {/* Preview progress bar */}
            <div className={`mt-3 rounded-xl p-3 border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-100'}`}>
              <div className={`flex items-center justify-between text-xs mb-2`}>
                <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {form.name || 'Skill Name'}
                </span>
                <span className="font-bold" style={{ color: levelColor }}>
                  {form.level}%
                </span>
              </div>
              <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${form.level}%`, background: levelColor }}
                />
              </div>
            </div>
          </div>

          {/* Color + Icon */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-semibold mb-1.5 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Warna
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.color}
                  onChange={set('color')}
                  className={`w-10 h-10 rounded-xl border cursor-pointer p-0.5 ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}
                />
                <input
                  type="text"
                  value={form.color}
                  onChange={set('color')}
                  placeholder="#6c5ce7"
                  className={`flex-1 px-3 py-2.5 rounded-xl border text-sm font-mono outline-none focus:border-brand-purple transition-all ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'}`}
                />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-semibold mb-1.5 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Icon (opsional)
              </label>
              <input
                type="text"
                value={form.icon}
                onChange={set('icon')}
                placeholder="URL atau nama icon"
                className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:border-brand-purple transition-all ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'}`}
              />
            </div>
          </div>

          {/* Order + Visibility */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-semibold mb-1.5 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Urutan
              </label>
              <input
                type="number"
                value={form.order}
                onChange={set('order')}
                min={0}
                max={999}
                className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:border-brand-purple transition-all ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-semibold mb-1.5 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Visibilitas
              </label>
              <button
                type="button"
                onClick={() => setDirect('is_visible', !form.is_visible)}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
                  form.is_visible
                    ? 'border-green-400 bg-green-50 text-green-700'
                    : isDarkMode ? 'border-gray-600 bg-gray-700 text-gray-300' : 'border-gray-200 bg-gray-50 text-gray-500'
                }`}
              >
                {form.is_visible
                  ? <><Eye size={15} /> Terlihat</>
                  : <><EyeOff size={15} /> Disembunyikan</>}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`flex gap-3 px-6 py-4 border-t ${isDarkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-100 bg-gray-50'}`}>
          <button
            onClick={onClose}
            disabled={saving}
            className={`flex-1 py-2.5 border text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 ${isDarkMode ? 'border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700' : 'border-gray-200 text-gray-600 bg-white hover:bg-gray-100'}`}
          >
            Batal
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={saving || !form.name.trim()}
            className="flex-1 py-2.5 bg-brand-purple text-white text-sm font-semibold rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving
              ? <><Loader size={14} className="animate-spin" />Menyimpan...</>
              : <><CheckCircle size={14} />{skill ? 'Simpan' : 'Tambah Skill'}</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Skill Card ── */
function SkillCard({ skill, onEdit, onDelete, onToggleVisible, isDarkMode }) {
  const cat      = getCatConfig(skill.category);
  const levelColor = skill.level >= 80
    ? '#00b894' : skill.level >= 60
    ? '#f39c12' : '#e17055';

  return (
    <div className={`rounded-2xl border p-5 hover:shadow-md transition-all group ${!skill.is_visible ? 'opacity-60' : ''} ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:shadow-xl hover:shadow-gray-900/20' : 'bg-white border-gray-100'}`}>

      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Color dot / icon */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{ background: skill.color || cat.color }}
          >
            {skill.icon
              ? <span className="text-xs">{String(skill.icon || '').substring(0, 2)}</span>
              : (skill.name || '??').substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className={`font-sora font-bold text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              {skill.name}
            </div>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cat.bg}`}>
              {cat.label}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onToggleVisible(skill)}
            className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${isDarkMode ? 'text-gray-500 hover:bg-gray-700 hover:text-gray-300' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
            title={skill.is_visible ? 'Sembunyikan' : 'Tampilkan'}
          >
            {skill.is_visible
              ? <Eye size={13} />
              : <EyeOff size={13} />}
          </button>
          <button
            onClick={() => onEdit(skill)}
            className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${isDarkMode ? 'text-gray-500 hover:bg-gray-700 hover:text-indigo-400' : 'text-gray-400 hover:bg-indigo-50 hover:text-indigo-600'}`}
            title="Edit"
          >
            <Edit2 size={13} />
          </button>
          <button
            onClick={() => onDelete(skill)}
            className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${isDarkMode ? 'text-gray-500 hover:bg-gray-700 hover:text-red-400' : 'text-gray-400 hover:bg-red-50 hover:text-red-500'}`}
            title="Hapus"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Level bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Level Keahlian</span>
          <div className="flex items-center gap-1.5">
            <span
              className="font-sora font-bold text-sm"
              style={{ color: levelColor }}
            >
              {skill.level ?? 0}%
            </span>
            <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              {(skill.level ?? 0) >= 90 ? 'Expert'
               : (skill.level ?? 0) >= 75 ? 'Advanced'
               : (skill.level ?? 0) >= 60 ? 'Intermediate'
               : (skill.level ?? 0) >= 40 ? 'Beginner'
               : 'Newbie'}
            </span>
          </div>
        </div>
        <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${skill.level ?? 0}%`,
              background: levelColor,
            }}
          />
        </div>
      </div>

      {/* Hidden badge */}
      {!skill.is_visible && (
        <div className={`mt-3 flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg ${isDarkMode ? 'text-gray-500 bg-gray-700' : 'text-gray-400 bg-gray-50'}`}>
          <EyeOff size={11} />
          Disembunyikan dari publik
        </div>
      )}
    </div>
  );
}

/* ── Main Component ── */
export default function SkillsAdmin() {
  const { isDarkMode } = useDarkMode();
  const [skills,     setSkills]     = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [catFilter,  setCatFilter]  = useState('all');
  const [sortBy,     setSortBy]     = useState('order');
  const [showModal,  setShowModal]  = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [delTarget,  setDelTarget]  = useState(null);
  const [saving,     setSaving]     = useState(false);
  const [delLoading, setDelLoading] = useState(false);
  const [toast,      setToast]      = useState(null);

  /* Fetch dengan konversi boolean secara explisit */
  const fetchSkills = async () => {
    setLoading(true);
    try {
      const res  = await api.get('/admin/skills');
      let data = res.data.data || res.data || [];
      
      data = data.map(skill => ({
        ...skill,
        // Pastikan konversi 1/0 MySQL ke true/false
        is_visible: Boolean(skill.is_visible === 1 || skill.is_visible === true)
      }));
      
      setSkills(data);
    } catch {
      setSkills([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSkills(); }, []);

  /* Filter + sort */
  const filtered = skills
    .filter(s => catFilter === 'all' || s.category === catFilter)
    .sort((a, b) => {
      if (sortBy === 'level') return (b.level ?? 0) - (a.level ?? 0);
      if (sortBy === 'name')  return a.name.localeCompare(b.name);
      return (a.order ?? 0) - (b.order ?? 0);
    });

  /* Group by category untuk tampilan grid */
  const grouped = CATEGORIES.reduce((acc, cat) => {
    const items = filtered.filter(s => s.category === cat.key);
    if (items.length > 0 || catFilter === cat.key) acc[cat.key] = items;
    return acc;
  }, {});

  /* Save (create / update) dengan sinkronisasi ulang via refetch */
  const handleSave = async (formData) => {
    if (!formData.name.trim()) {
      setToast({ type: 'error', message: 'Nama skill wajib diisi!' });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name:       formData.name.trim(),
        category:   formData.category,
        icon:       formData.icon       || null,
        color:      formData.color      || null,
        level:      Number(formData.level),
        order:      Number(formData.order),
        is_visible: Boolean(formData.is_visible),
      };

      if (editTarget) {
        await api.put(`/admin/skills/${editTarget.id}`, payload);
        setToast({ type: 'success', message: 'Skill berhasil diperbarui!' });
      } else {
        await api.post('/admin/skills', payload);
        setToast({ type: 'success', message: 'Skill berhasil ditambahkan!' });
      }

      setShowModal(false);
      setEditTarget(null);

      await fetchSkills(); 
    } catch (err) {
      const errData = err?.response?.data;
      const msg = errData?.errors
        ? Object.values(errData.errors).flat().join(', ')
        : errData?.message || 'Terjadi kesalahan. Coba lagi.';
      setToast({ type: 'error', message: msg });
    } finally {
      setSaving(false);
    }
  };

  /* Delete dengan sinkronisasi ulang */
  const handleDelete = async () => {
    if (!delTarget) return;
    setDelLoading(true);
    try {
      await api.delete(`/admin/skills/${delTarget.id}`);
      setToast({ type: 'success', message: 'Skill berhasil dihapus!' });
      
      await fetchSkills(); 
    } catch {
      setToast({ type: 'error', message: 'Gagal menghapus skill.' });
    } finally {
      setDelLoading(false);
      setDelTarget(null);
    }
  };

  /* Toggle visibility dengan sinkronisasi ulang */
  const handleToggleVisible = async (skill) => {
    try {
      const newVal = !skill.is_visible;
      await api.put(`/admin/skills/${skill.id}`, { is_visible: newVal });
      
      setToast({
        type: 'success',
        message: newVal ? 'Skill ditampilkan!' : 'Skill disembunyikan!',
      });
      
      await fetchSkills();
    } catch {
      setToast({ type: 'error', message: 'Gagal mengubah visibilitas.' });
    }
  };

  /* Stats */
  const totalVisible = skills.filter(s => s.is_visible).length;
  const avgLevel     = skills.length
    ? Math.round(skills.reduce((sum, s) => sum + (s.level ?? 0), 0) / skills.length)
    : 0;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="p-6 md:p-8 max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className={`font-sora font-bold text-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Skills</h1>
            <p className={`text-sm mt-0.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              {loading ? 'Mensinkronkan data...' : `${skills.length} skill · ${totalVisible} ditampilkan · rata-rata ${avgLevel}%`}
            </p>
          </div>
          <button
            onClick={() => { setEditTarget(null); setShowModal(true); }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-purple text-white text-sm font-semibold rounded-xl hover:bg-purple-700 transition-colors self-start sm:self-auto"
          >
            <Plus size={16} />
            Tambah Skill
          </button>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {CATEGORIES.map(cat => {
            const items   = skills.filter(s => s.category === cat.key);
            const avg     = items.length
              ? Math.round(items.reduce((sum, s) => sum + (s.level ?? 0), 0) / items.length)
              : 0;
            return (
              <div key={cat.key} className={`rounded-2xl border p-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {cat.label}
                  </div>
                  <Star size={13} className={isDarkMode ? 'text-gray-600' : 'text-gray-300'} />
                </div>
                <div className={`font-sora font-bold text-2xl mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {items.length}
                </div>
                <div className={`text-xs mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>skill · avg {avg}%</div>
                <div className={`h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${avg}%`, background: cat.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>

      {/* ── Filters ── */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className={`flex gap-1.5 p-1 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}>
          <button
            onClick={() => setCatFilter('all')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              catFilter === 'all'
                ? isDarkMode ? 'bg-gray-700 text-white shadow-sm' : 'bg-gray-100 text-gray-900 shadow-sm'
                : isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Semua ({skills.length})
          </button>
          {CATEGORIES.map(cat => {
            const count = skills.filter(s => s.category === cat.key).length;
            return (
              <button
                key={cat.key}
                onClick={() => setCatFilter(cat.key)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  catFilter === cat.key
                    ? isDarkMode ? 'bg-gray-700 text-white shadow-sm' : 'bg-gray-100 text-gray-900 shadow-sm'
                    : isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Sort */}
        <div className="ml-auto flex items-center gap-2">
          <ArrowUpDown size={13} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className={`text-xs font-semibold rounded-xl px-3 py-2 outline-none focus:border-brand-purple cursor-pointer transition-all ${isDarkMode ? 'bg-gray-800 border border-gray-700 text-gray-200' : 'text-gray-600 bg-white border border-gray-200'}`}
          >
            <option value="order">Urutan Default</option>
            <option value="level">Level (Tertinggi)</option>
            <option value="name">Nama A–Z</option>
          </select>
        </div>
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`rounded-2xl h-36 animate-pulse ${isDarkMode ? 'bg-gray-700' : 'bg-white border border-gray-100'}`} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <Star size={24} className={isDarkMode ? 'text-gray-700' : 'text-gray-300'} />
          </div>
          <p className={`font-semibold mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Belum ada skill</p>
          <p className={`text-sm mb-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Tambahkan skill pertama kamu sekarang.
          </p>
          <button
            onClick={() => { setEditTarget(null); setShowModal(true); }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-purple text-white text-sm font-semibold rounded-xl"
          >
            <Plus size={15} />
            Tambah Skill
          </button>
        </div>
      ) : catFilter === 'all' ? (
        /* Grouped view */
        <div className="flex flex-col gap-8">
          {Object.entries(grouped).map(([catKey, items]) => {
            if (items.length === 0) return null;
            const cat = getCatConfig(catKey);
            const avg = Math.round(
              items.reduce((sum, s) => sum + (s.level ?? 0), 0) / items.length
            );
            return (
              <div key={catKey}>
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: cat.color }}
                  />
                  <h2 className={`font-sora font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {cat.label}
                  </h2>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {items.length} skill · avg {avg}%
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map(skill => (
                    <SkillCard
                      key={skill.id}
                      skill={skill}
                      onEdit={(s) => { setEditTarget(s); setShowModal(true); }}
                      onDelete={setDelTarget}
                      onToggleVisible={handleToggleVisible}
                      isDarkMode={isDarkMode}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Filtered view */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(skill => (
            <SkillCard
              key={skill.id}
              skill={skill}
              onEdit={(s) => { setEditTarget(s); setShowModal(true); }}
              onDelete={setDelTarget}
              onToggleVisible={handleToggleVisible}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>
      )}

      {/* ── Modals ── */}
      {showModal && (
        <SkillFormModal
          skill={editTarget}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditTarget(null); }}
          saving={saving}
          isDarkMode={isDarkMode}
        />
      )}

      <DeleteModal
        skill={delTarget}
        onConfirm={handleDelete}
        onCancel={() => setDelTarget(null)}
        loading={delLoading}
        isDarkMode={isDarkMode}
      />

      <Toast toast={toast} onClose={() => setToast(null)} isDarkMode={isDarkMode} />
      </div>
    </div>
  );
}