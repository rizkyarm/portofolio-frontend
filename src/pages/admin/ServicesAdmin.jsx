import { useState, useEffect } from 'react';
import {
  Plus, Edit2, Trash2, Eye, EyeOff, X,
  CheckCircle, AlertCircle, Loader, Wrench,
  ArrowUpDown, GripVertical, Monitor, Smartphone,
  Video, Palette, Code, Layers, DollarSign,
  ToggleLeft, ToggleRight, Sun, Moon,
} from 'lucide-react';
import api from '../../services/api';
import { useDarkMode } from '../../context/DarkModeContext';

/* ── Icon map ── */
const ICONS = {
  monitor:    { component: Monitor,    label: 'Monitor' },
  smartphone: { component: Smartphone, label: 'Phone' },
  video:      { component: Video,      label: 'Video' },
  palette:    { component: Palette,    label: 'Palette' },
  code:       { component: Code,       label: 'Code' },
  layers:     { component: Layers,     label: 'Layers' },
  wrench:     { component: Wrench,     label: 'Wrench' },
  dollar:     { component: DollarSign, label: 'Dollar' },
};

const COLORS = [
  { hex: '#6c5ce7', label: 'Purple'  },
  { hex: '#e84393', label: 'Pink'    },
  { hex: '#00b894', label: 'Green'   },
  { hex: '#f39c12', label: 'Amber'   },
  { hex: '#0984e3', label: 'Blue'    },
  { hex: '#d63031', label: 'Red'     },
  { hex: '#00cec9', label: 'Teal'    },
  { hex: '#636e72', label: 'Gray'    },
];

const INIT_FORM = {
  title:       '',
  description: '',
  icon:        'wrench',
  price_range: '',
  includes:    [''],
  order:       0,
  is_visible:  true,
  color:       '#6c5ce7',
  featured:    false,
};

/* ── CSS vars helper — injects dark/light theme ── */
function ThemeWrapper({ dark, children }) {
  const t = dark ? {
    '--bg':        '#0f172a',
    '--bg2':       '#1e293b',
    '--bg3':       '#334155',
    '--border':    '#334155',
    '--border2':   '#475569',
    '--text':      '#f1f5f9',
    '--text2':     '#94a3b8',
    '--text3':     '#64748b',
    '--card':      '#1e293b',
    '--input':     '#0f172a',
    '--hover':     '#334155',
    '--purple':    '#a78bfa',
    '--purplebg':  '#2e1065',
  } : {
    '--bg':        '#f8fafc',
    '--bg2':       '#ffffff',
    '--bg3':       '#f1f5f9',
    '--border':    '#e2e8f0',
    '--border2':   '#cbd5e1',
    '--text':      '#0f172a',
    '--text2':     '#64748b',
    '--text3':     '#94a3b8',
    '--card':      '#ffffff',
    '--input':     '#ffffff',
    '--hover':     '#f8fafc',
    '--purple':    '#6c5ce7',
    '--purplebg':  '#ede9fe',
  };
  return (
    <div style={t} className="transition-colors duration-300">
      {children}
    </div>
  );
}

/* ── Toast ── */
function Toast({ toast, onClose, dark }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [toast, onClose]);
  if (!toast) return null;
  const ok = toast.type === 'success';
  return (
    <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-white text-sm font-semibold animate-bounce-once ${ok ? 'bg-emerald-500' : 'bg-red-500'}`}>
      {ok ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      {toast.message}
      <button onClick={onClose} className="ml-1 opacity-70 hover:opacity-100">
        <X size={14} />
      </button>
    </div>
  );
}

/* ── Delete Modal ── */
function DeleteModal({ service, onConfirm, onCancel, loading, dark }) {
  if (!service) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="rounded-3xl p-6 w-full max-w-sm shadow-2xl border"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Trash2 size={22} className="text-red-500" />
        </div>
        <h3 className="font-sora font-bold text-center mb-2" style={{ color: 'var(--text)' }}>
          Hapus Layanan?
        </h3>
        <p className="text-sm text-center mb-1" style={{ color: 'var(--text2)' }}>
          Kamu akan menghapus layanan:
        </p>
        <p className="font-bold text-sm text-center mb-5 px-2 truncate" style={{ color: 'var(--text)' }}>
          "{service.title}"
        </p>
        <p className="text-xs text-red-400 text-center mb-6">
          Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 text-sm font-semibold rounded-xl border transition-colors disabled:opacity-50"
            style={{ borderColor: 'var(--border)', color: 'var(--text2)', background: 'var(--bg3)' }}
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

/* ── Service Form Modal ── */
function ServiceFormModal({ service, onSave, onClose, saving, dark }) {
  const isEdit = Boolean(service);
  const [form, setForm] = useState({
    title:       service?.title       ?? '',
    description: service?.description ?? '',
    icon:        service?.icon        ?? 'wrench',
    price_range: service?.price_range ?? '',
    includes:    service?.includes?.length ? service.includes : [''],
    order:       service?.order       ?? 0,
    is_visible:  service?.is_visible  ?? true,
    color:       service?.color       ?? '#6c5ce7',
    featured:    service?.featured    ?? false,
  });

  const set = (field) => (e) => {
    const val = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setForm(prev => ({ ...prev, [field]: val }));
  };

  const setDirect = (field, val) =>
    setForm(prev => ({ ...prev, [field]: val }));

  const updateInclude = (i, val) => {
    const next = [...form.includes];
    next[i] = val;
    setForm(prev => ({ ...prev, includes: next }));
  };

  const addInclude = () =>
    setForm(prev => ({ ...prev, includes: [...prev.includes, ''] }));

  const removeInclude = (i) =>
    setForm(prev => ({
      ...prev,
      includes: prev.includes.filter((_, idx) => idx !== i),
    }));

  const SelIcon = ICONS[form.icon]?.component || Wrench;

  const inputStyle = {
    background:  'var(--input)',
    borderColor: 'var(--border)',
    color:       'var(--text)',
  };

  const labelStyle = { color: 'var(--text)' };
  const subStyle   = { color: 'var(--text2)' };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="rounded-3xl w-full max-w-2xl shadow-2xl border overflow-hidden"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: form.color + '20' }}
            >
              <SelIcon size={18} style={{ color: form.color }} />
            </div>
            <div>
              <h3 className="font-sora font-bold text-sm" style={labelStyle}>
                {isEdit ? 'Edit Layanan' : 'Tambah Layanan Baru'}
              </h3>
              <p className="text-xs" style={subStyle}>
                {isEdit ? `Mengedit: ${service.title}` : 'Isi detail layanan yang ditawarkan'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl transition-colors"
            style={{ color: 'var(--text2)', background: 'var(--bg3)' }}
          >
            <X size={15} />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[70vh]">
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1.5" style={labelStyle}>
                Judul Layanan <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={set('title')}
                placeholder="cth: Web Development, Video Editing..."
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-2"
                style={{ ...inputStyle, '--tw-ring-color': form.color + '40' }}
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1.5" style={labelStyle}>
                Deskripsi
              </label>
              <textarea
                value={form.description}
                onChange={set('description')}
                rows={3}
                placeholder="Jelaskan layanan ini secara singkat dan menarik..."
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none resize-none transition-all"
                style={inputStyle}
              />
            </div>

            {/* Icon picker */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={labelStyle}>
                Icon
              </label>
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(ICONS).map(([key, { component: Icon, label }]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setDirect('icon', key)}
                    title={label}
                    className="flex flex-col items-center gap-1 py-2.5 rounded-xl border-2 text-xs font-medium transition-all"
                    style={{
                      borderColor: form.icon === key ? form.color : 'var(--border)',
                      background:  form.icon === key ? form.color + '15' : 'var(--bg3)',
                      color:       form.icon === key ? form.color : 'var(--text2)',
                    }}
                  >
                    <Icon size={17} />
                    <span className="text-xs">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Color picker */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={labelStyle}>
                Warna Tema
              </label>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {COLORS.map(c => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setDirect('color', c.hex)}
                    title={c.label}
                    className="h-10 rounded-xl border-2 transition-all hover:scale-105"
                    style={{
                      background:  c.hex,
                      borderColor: form.color === c.hex ? 'var(--text)' : 'transparent',
                    }}
                  />
                ))}
              </div>
              {/* Custom color */}
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.color}
                  onChange={set('color')}
                  className="w-9 h-9 rounded-lg border cursor-pointer p-0.5"
                  style={{ borderColor: 'var(--border)', background: 'var(--bg3)' }}
                />
                <input
                  type="text"
                  value={form.color}
                  onChange={set('color')}
                  className="flex-1 px-3 py-2 rounded-xl border text-sm font-mono outline-none transition-all"
                  style={inputStyle}
                  placeholder="#6c5ce7"
                />
              </div>

              {/* Preview card mini */}
              <div
                className="mt-3 rounded-xl p-3 border flex items-center gap-2.5"
                style={{ borderColor: form.color + '40', background: form.color + '10' }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: form.color }}
                >
                  <SelIcon size={15} className="text-white" />
                </div>
                <div>
                  <div className="text-xs font-bold truncate" style={{ color: form.color }}>
                    {form.title || 'Nama Layanan'}
                  </div>
                  <div className="text-xs" style={subStyle}>
                    {form.price_range || 'Harga belum diset'}
                  </div>
                </div>
              </div>
            </div>

            {/* Price range */}
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={labelStyle}>
                Range Harga
              </label>
              <div className="relative">
                <DollarSign
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text3)' }}
                />
                <input
                  type="text"
                  value={form.price_range}
                  onChange={set('price_range')}
                  placeholder="Rp 1JT - 5JT"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Order */}
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={labelStyle}>
                Urutan
              </label>
              <input
                type="number"
                value={form.order}
                onChange={set('order')}
                min={0}
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all"
                style={inputStyle}
              />
            </div>

            {/* Includes list */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2" style={labelStyle}>
                Yang Termasuk dalam Layanan
              </label>
              <div className="flex flex-col gap-2">
                {form.includes.map((item, i) => (
                  <div key={i} className="flex gap-2 items-center group">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: form.color + '20' }}
                    >
                      <CheckCircle size={11} style={{ color: form.color }} />
                    </div>
                    <input
                      type="text"
                      value={item}
                      onChange={e => updateInclude(i, e.target.value)}
                      placeholder={`Fitur ke-${i + 1}...`}
                      className="flex-1 px-4 py-2.5 rounded-xl border text-sm outline-none transition-all"
                      style={inputStyle}
                    />
                    {form.includes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeInclude(i)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border transition-colors opacity-0 group-hover:opacity-100"
                        style={{ borderColor: 'var(--border)', color: 'var(--text3)' }}
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addInclude}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed text-sm font-medium transition-all"
                  style={{ borderColor: form.color + '40', color: form.color }}
                >
                  <Plus size={14} />
                  Tambah Item
                </button>
              </div>
            </div>

            {/* Toggles */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Visibility */}
              <button
                type="button"
                onClick={() => setDirect('is_visible', !form.is_visible)}
                className="flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left"
                style={{
                  borderColor: form.is_visible ? '#10b981' : 'var(--border)',
                  background:  form.is_visible ? '#10b98115' : 'var(--bg3)',
                }}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${form.is_visible ? 'bg-emerald-100' : ''}`}
                  style={!form.is_visible ? { background: 'var(--bg2)' } : {}}>
                  {form.is_visible
                    ? <Eye size={18} className="text-emerald-600" />
                    : <EyeOff size={18} style={{ color: 'var(--text3)' }} />}
                </div>
                <div>
                  <div className="text-sm font-semibold" style={labelStyle}>
                    Visibilitas
                  </div>
                  <div className="text-xs" style={subStyle}>
                    {form.is_visible ? 'Tampil di website' : 'Disembunyikan'}
                  </div>
                </div>
                <div className="ml-auto">
                  {form.is_visible
                    ? <ToggleRight size={22} className="text-emerald-500" />
                    : <ToggleLeft size={22} style={{ color: 'var(--text3)' }} />}
                </div>
              </button>

              {/* Featured */}
              <button
                type="button"
                onClick={() => setDirect('featured', !form.featured)}
                className="flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left"
                style={{
                  borderColor: form.featured ? form.color : 'var(--border)',
                  background:  form.featured ? form.color + '15' : 'var(--bg3)',
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: form.featured ? form.color + '25' : 'var(--bg2)' }}
                >
                  <CheckCircle
                    size={18}
                    style={{ color: form.featured ? form.color : 'var(--text3)' }}
                  />
                </div>
                <div>
                  <div className="text-sm font-semibold" style={labelStyle}>
                    Most Popular
                  </div>
                  <div className="text-xs" style={subStyle}>
                    {form.featured ? 'Ditandai unggulan' : 'Layanan biasa'}
                  </div>
                </div>
                <div className="ml-auto">
                  {form.featured
                    ? <ToggleRight size={22} style={{ color: form.color }} />
                    : <ToggleLeft size={22} style={{ color: 'var(--text3)' }} />}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex gap-3 px-6 py-4 border-t"
          style={{ borderColor: 'var(--border)', background: 'var(--bg3)' }}
        >
          <button
            onClick={onClose}
            disabled={saving}
            className="flex-1 py-2.5 border text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
            style={{ borderColor: 'var(--border)', color: 'var(--text2)', background: 'var(--card)' }}
          >
            Batal
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={saving || !form.title.trim()}
            className="flex-1 py-2.5 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 hover:opacity-90 active:scale-95"
            style={{ background: form.color }}
          >
            {saving
              ? <><Loader size={14} className="animate-spin" />Menyimpan...</>
              : <><CheckCircle size={14} />{isEdit ? 'Simpan Perubahan' : 'Tambah Layanan'}</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Service Card ── */
function ServiceCard({ service, onEdit, onDelete, onToggleVisible, dark }) {
  const IconComp = ICONS[service.icon]?.component || Wrench;
  const clr      = service.color || '#6c5ce7';
  const includes = service.includes || [];

  return (
    <div
      className="rounded-3xl border overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-xl group relative"
      style={{
        background:   'var(--card)',
        borderColor:  service.featured ? clr : 'var(--border)',
        boxShadow:    service.featured ? `0 0 0 2px ${clr}30` : undefined,
      }}
    >
      {/* Top color bar */}
      <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${clr}, ${clr}88)` }} />

      {/* Featured badge */}
      {service.featured && (
        <div
          className="absolute top-4 right-4 text-white text-xs font-bold px-2.5 py-1 rounded-full"
          style={{ background: clr }}
        >
          ✨ Popular
        </div>
      )}

      <div className="p-5">
        {/* Icon + title */}
        <div className="flex items-start gap-3 mb-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
            style={{ background: clr + '20' }}
          >
            <IconComp size={22} style={{ color: clr }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className="font-sora font-bold text-sm leading-tight truncate"
              style={{ color: 'var(--text)' }}
            >
              {service.title}
            </h3>
            {service.price_range && (
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block"
                style={{ background: clr + '15', color: clr }}
              >
                {service.price_range}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        {service.description && (
          <p
            className="text-xs leading-relaxed mb-4 line-clamp-2"
            style={{ color: 'var(--text2)' }}
          >
            {service.description}
          </p>
        )}

        {/* Includes */}
        {includes.length > 0 && (
          <div className="flex flex-col gap-1.5 mb-4">
            {includes.slice(0, 3).map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-xs" style={{ color: 'var(--text2)' }}>
                <CheckCircle size={11} style={{ color: clr, flexShrink: 0 }} />
                <span className="truncate">{item}</span>
              </div>
            ))}
            {includes.length > 3 && (
              <div className="text-xs" style={{ color: 'var(--text3)' }}>
                +{includes.length - 3} lainnya
              </div>
            )}
          </div>
        )}

        {/* Footer actions */}
        <div
          className="flex items-center justify-between pt-3 border-t"
          style={{ borderColor: 'var(--border)' }}
        >
          {/* Visibility indicator */}
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${service.is_visible ? 'bg-emerald-400' : 'bg-gray-400'}`} />
            <span className="text-xs" style={{ color: 'var(--text3)' }}>
              {service.is_visible ? 'Live' : 'Hidden'}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onToggleVisible(service)}
              className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
              style={{ color: 'var(--text3)', background: 'var(--bg3)' }}
              title={service.is_visible ? 'Sembunyikan' : 'Tampilkan'}
            >
              {service.is_visible ? <Eye size={12} /> : <EyeOff size={12} />}
            </button>
            <button
              onClick={() => onEdit(service)}
              className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors hover:bg-indigo-100"
              style={{ color: 'var(--text3)' }}
              title="Edit"
            >
              <Edit2 size={12} />
            </button>
            <button
              onClick={() => onDelete(service)}
              className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors hover:bg-red-100"
              style={{ color: 'var(--text3)' }}
              title="Hapus"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Skeleton Card ── */
function SkeletonCard({ dark }) {
  return (
    <div
      className="rounded-3xl border overflow-hidden"
      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
    >
      <div className="h-1.5" style={{ background: 'var(--bg3)' }} />
      <div className="p-5">
        <div className="flex gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl animate-pulse" style={{ background: 'var(--bg3)' }} />
          <div className="flex-1">
            <div className="h-4 rounded-lg mb-2 animate-pulse" style={{ background: 'var(--bg3)', width: '70%' }} />
            <div className="h-3 rounded-lg animate-pulse" style={{ background: 'var(--bg3)', width: '40%' }} />
          </div>
        </div>
        <div className="space-y-2 mb-4">
          {[1,2,3].map(i => (
            <div key={i} className="h-3 rounded animate-pulse" style={{ background: 'var(--bg3)', width: `${70 + i * 8}%` }} />
          ))}
        </div>
        <div className="h-3 rounded animate-pulse" style={{ background: 'var(--bg3)' }} />
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function ServicesAdmin() {
  const { isDarkMode: dark } = useDarkMode();
  const [services,   setServices]  = useState([]);
  const [loading,    setLoading]   = useState(true);
  const [filter,     setFilter]    = useState('all');
  const [sortBy,     setSortBy]    = useState('order');
  const [showModal,  setShowModal] = useState(false);
  const [editTarget, setEditTarget]= useState(null);
  const [delTarget,  setDelTarget] = useState(null);
  const [saving,     setSaving]    = useState(false);
  const [delLoading, setDelLoading]= useState(false);
  const [toast,      setToast]     = useState(null);

  /* Fetch */
  const fetchServices = async () => {
    setLoading(true);
    try {
      const res  = await api.get('/services');
      const data = res.data.data || res.data || [];
      setServices(data.length > 0 ? data : dummyServices);
    } catch {
      setServices(dummyServices);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  /* Filter + sort */
  const filtered = services
    .filter(s => {
      if (filter === 'visible') return s.is_visible;
      if (filter === 'hidden')  return !s.is_visible;
      if (filter === 'featured')return s.featured;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'newest')return (b.id || 0) - (a.id || 0);
      return (a.order || 0) - (b.order || 0);
    });

  /* Save */
  const handleSave = async (formData) => {
    if (!formData.title.trim()) {
      setToast({ type: 'error', message: 'Judul layanan wajib diisi!' });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title:       formData.title.trim(),
        description: formData.description.trim(),
        icon:        formData.icon,
        price_range: formData.price_range,
        includes:    formData.includes.filter(i => i.trim()),
        order:       Number(formData.order),
        is_visible:  Boolean(formData.is_visible),
        color:       formData.color,
        featured:    Boolean(formData.featured),
      };

      if (editTarget) {
        await api.put(`/admin/services/${editTarget.id}`, payload);
        setServices(prev =>
          prev.map(s => s.id === editTarget.id ? { ...s, ...payload } : s)
        );
        setToast({ type: 'success', message: 'Layanan berhasil diperbarui!' });
      } else {
        const res = await api.post('/admin/services', payload);
        const newService = res.data.data || res.data;
        setServices(prev => [...prev, newService]);
        setToast({ type: 'success', message: 'Layanan berhasil ditambahkan!' });
      }

      setShowModal(false);
      setEditTarget(null);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Gagal menyimpan layanan.';
      setToast({ type: 'error', message: msg });
    } finally {
      setSaving(false);
    }
  };

  /* Delete */
  const handleDelete = async () => {
    if (!delTarget) return;
    setDelLoading(true);
    try {
      await api.delete(`/admin/services/${delTarget.id}`);
      setServices(prev => prev.filter(s => s.id !== delTarget.id));
      setToast({ type: 'success', message: 'Layanan berhasil dihapus!' });
    } catch {
      setToast({ type: 'error', message: 'Gagal menghapus layanan.' });
    } finally {
      setDelLoading(false);
      setDelTarget(null);
    }
  };

  /* Toggle visibility */
  const handleToggleVisible = async (service) => {
    const newVal = !service.is_visible;
    try {
      await api.put(`/admin/services/${service.id}`, { is_visible: newVal });
      setServices(prev =>
        prev.map(s => s.id === service.id ? { ...s, is_visible: newVal } : s)
      );
      setToast({
        type: 'success',
        message: newVal ? 'Layanan ditampilkan!' : 'Layanan disembunyikan!',
      });
    } catch {
      setToast({ type: 'error', message: 'Gagal mengubah visibilitas.' });
    }
  };

  /* Stats */
  const totalVisible  = services.filter(s => s.is_visible).length;
  const totalFeatured = services.filter(s => s.featured).length;

  return (
    <ThemeWrapper dark={dark}>
      <div
        className="min-h-screen transition-colors duration-300"
        style={{ background: 'var(--bg)' }}
      >
        <div className="p-6 md:p-8 max-w-7xl mx-auto">

          {/* ── Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1
                className="font-sora font-bold text-2xl"
                style={{ color: 'var(--text)' }}
              >
                Services
              </h1>
              <p className="text-sm mt-0.5" style={{ color: 'var(--text2)' }}>
                {loading ? '...' : `${services.length} layanan · ${totalVisible} aktif · ${totalFeatured} unggulan`}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => { setEditTarget(null); setShowModal(true); }}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-white text-sm font-semibold rounded-xl transition-all hover:opacity-90 active:scale-95"
                style={{ background: '#6c5ce7' }}
              >
                <Plus size={16} />
                Tambah Layanan
              </button>
            </div>
          </div>

          {/* ── Stats ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total',      value: services.length,  color: '#6c5ce7', icon: Wrench },
              { label: 'Aktif',      value: totalVisible,     color: '#10b981', icon: Eye },
              { label: 'Disembunyikan', value: services.length - totalVisible, color: '#f59e0b', icon: EyeOff },
              { label: 'Unggulan',   value: totalFeatured,    color: '#e84393', icon: CheckCircle },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border p-4 transition-all hover:shadow-md"
                style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: stat.color + '20' }}
                  >
                    <stat.icon size={16} style={{ color: stat.color }} />
                  </div>
                  <span
                    className="font-sora font-bold text-2xl"
                    style={{ color: 'var(--text)' }}
                  >
                    {loading ? '—' : stat.value}
                  </span>
                </div>
                <div className="text-xs font-medium" style={{ color: 'var(--text2)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* ── Filter & Sort bar ── */}
          <div
            className="flex flex-wrap items-center gap-3 p-4 rounded-2xl border mb-6"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            {/* Filter tabs */}
            <div
              className="flex gap-1 p-1 rounded-xl"
              style={{ background: 'var(--bg3)' }}
            >
              {[
                { key: 'all',      label: `Semua (${services.length})` },
                { key: 'visible',  label: `Aktif (${totalVisible})` },
                { key: 'hidden',   label: `Hidden (${services.length - totalVisible})` },
                { key: 'featured', label: `Unggulan (${totalFeatured})` },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap"
                  style={{
                    background: filter === f.key ? 'var(--card)' : 'transparent',
                    color:      filter === f.key ? 'var(--text)' : 'var(--text2)',
                    boxShadow:  filter === f.key ? '0 1px 4px rgba(0,0,0,.08)' : 'none',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="ml-auto flex items-center gap-2">
              <ArrowUpDown size={13} style={{ color: 'var(--text3)' }} />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="text-xs font-semibold border rounded-xl px-3 py-2 outline-none cursor-pointer transition-all"
                style={{
                  background:  'var(--input)',
                  borderColor: 'var(--border)',
                  color:       'var(--text)',
                }}
              >
                <option value="order">Urutan Default</option>
                <option value="title">Judul A–Z</option>
                <option value="newest">Terbaru</option>
              </select>
            </div>
          </div>

          {/* ── Grid ── */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} dark={dark} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-28 text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: 'var(--bg3)' }}
              >
                <Wrench size={24} style={{ color: 'var(--text3)' }} />
              </div>
              <p
                className="font-semibold mb-1"
                style={{ color: 'var(--text2)' }}
              >
                {filter !== 'all' ? 'Tidak ada layanan yang cocok' : 'Belum ada layanan'}
              </p>
              <p className="text-sm mb-5" style={{ color: 'var(--text3)' }}>
                {filter !== 'all'
                  ? 'Coba ganti filter'
                  : 'Tambahkan layanan pertama yang kamu tawarkan'}
              </p>
              {filter === 'all' && (
                <button
                  onClick={() => { setEditTarget(null); setShowModal(true); }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-white text-sm font-semibold rounded-xl"
                  style={{ background: '#6c5ce7' }}
                >
                  <Plus size={15} />
                  Tambah Layanan
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(service => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onEdit={s => { setEditTarget(s); setShowModal(true); }}
                  onDelete={setDelTarget}
                  onToggleVisible={handleToggleVisible}
                  dark={dark}
                />
              ))}
            </div>
          )}

        </div>
      </div>

      {/* ── Modals ── */}
      {showModal && (
        <ServiceFormModal
          service={editTarget}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditTarget(null); }}
          saving={saving}
          dark={dark}
        />
      )}

      <DeleteModal
        service={delTarget}
        onConfirm={handleDelete}
        onCancel={() => setDelTarget(null)}
        loading={delLoading}
        dark={dark}
      />

      <Toast
        toast={toast}
        onClose={() => setToast(null)}
        dark={dark}
      />
    </ThemeWrapper>
  );
}

/* ── Dummy fallback ── */
const dummyServices = [
  { id:1, title:'Web Development',         icon:'monitor',    color:'#6c5ce7', price_range:'Rp 2JT - 8JT', description:'Membangun website modern & responsif.',       includes:['Desain UI/UX','REST API','Deploy'],              is_visible:true,  featured:false, order:1 },
  { id:2, title:'Android App Development', icon:'smartphone', color:'#e84393', price_range:'Rp 3JT - 12JT',description:'Aplikasi Android cross-platform dengan Flutter.',includes:['Flutter UI','Firebase','Google Play'],           is_visible:true,  featured:false, order:2 },
  { id:3, title:'Video Editing',           icon:'video',      color:'#636e72', price_range:'Rp 500RB - 3JT',description:'Editing video profesional Premiere & AE.',     includes:['Color grading','Motion graphics','Sound design'], is_visible:true,  featured:false, order:3 },
  { id:4, title:'UI/UX Design',            icon:'palette',    color:'#f39c12', price_range:'Rp 1JT - 5JT', description:'Desain antarmuka intuitif menggunakan Figma.',  includes:['Wireframe','Prototype','Handoff'],               is_visible:true,  featured:false, order:4 },
  { id:5, title:'Full-Stack Development',  icon:'code',       color:'#00b894', price_range:'Rp 5JT - 20JT',description:'Solusi end-to-end React + Laravel + MySQL.',    includes:['Frontend','Backend API','Admin panel','3 bulan maintenance'], is_visible:true, featured:true, order:5 },
  { id:6, title:'Konsultasi & Code Review',icon:'layers',     color:'#0984e3', price_range:'Rp 200RB/jam', description:'Review kode, debugging, dan mentoring teknikal.',includes:['Code review','Problem solving','Session recording'], is_visible:false, featured:false, order:6 },
];