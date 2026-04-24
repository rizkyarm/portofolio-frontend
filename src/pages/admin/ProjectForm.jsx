import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Save, Upload, X, Plus,
  AlertCircle, CheckCircle, Image,
  Globe, Smartphone, Video, Palette,
  Eye, Loader,
} from 'lucide-react';
import api from '../../services/api';

/* ── Config ── */
const CATEGORIES = [
  { key: 'website', label: 'Website',     icon: Globe,       color: 'border-indigo-300 bg-indigo-50 text-indigo-700' },
  { key: 'android', label: 'Android App', icon: Smartphone,  color: 'border-fuchsia-300 bg-fuchsia-50 text-fuchsia-700' },
  { key: 'video',   label: 'Video',       icon: Video,       color: 'border-slate-300 bg-slate-50 text-slate-700' },
  { key: 'design',  label: 'Design',      icon: Palette,     color: 'border-amber-300 bg-amber-50 text-amber-700' },
];

const STATUSES = [
  { key: 'draft', label: 'Draft',  desc: 'Tidak tampil di website publik' },
  { key: 'live',  label: 'Live',   desc: 'Tampil di website publik' },
];

/* ── Reusable Components ── */
function FormSection({ title, desc, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="font-sora font-bold text-sm text-gray-900">{title}</h2>
        {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function FormField({ label, required, error, hint, children }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-semibold text-gray-700">
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
        {hint && <span className="text-xs text-gray-400">{hint}</span>}
      </div>
      {children}
      {error && (
        <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
          <AlertCircle size={11} />
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass =
  'w-full px-4 py-2.5 rounded-xl border text-sm text-gray-800 ' +
  'placeholder-gray-400 bg-white outline-none transition-all ' +
  'focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10';

const inputError = 'border-red-300 ring-2 ring-red-100';
const inputNormal = 'border-gray-200';

/* ── Tag Input ── */
function TagInput({ tags, onChange, placeholder }) {
  const [input, setInput] = useState('');

  const addTag = (val) => {
    const tag = val.trim();
    if (!tag || tags.includes(tag)) { setInput(''); return; }
    onChange([...tags, tag]);
    setInput('');
  };

  const removeTag = (tag) => onChange(tags.filter(t => t !== tag));

  const handleKey = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    }
    if (e.key === 'Backspace' && !input && tags.length) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className={`flex flex-wrap gap-2 px-3 py-2.5 rounded-xl border ${inputNormal} focus-within:border-brand-purple focus-within:ring-2 focus-within:ring-brand-purple/10 transition-all bg-white min-h-[44px]`}>
      {tags.map(tag => (
        <span
          key={tag}
          className="inline-flex items-center gap-1.5 bg-brand-pale text-brand-purple text-xs font-semibold px-2.5 py-1 rounded-full"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="hover:text-red-500 transition-colors"
          >
            <X size={10} />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKey}
        onBlur={() => input && addTag(input)}
        placeholder={tags.length === 0 ? placeholder : 'Tambah lagi...'}
        className="flex-1 min-w-24 text-sm outline-none placeholder-gray-400 bg-transparent"
      />
    </div>
  );
}

/* ── Dynamic List Input (features / tech stack) ── */
function DynamicList({ items, onChange, placeholder, fields }) {
  const addItem = () => {
    if (fields) {
      onChange([...items, Object.fromEntries(fields.map(f => [f.key, '']))]);
    } else {
      onChange([...items, '']);
    }
  };

  const removeItem = (i) => onChange(items.filter((_, idx) => idx !== i));

  const updateItem = (i, val) => {
    const next = [...items];
    next[i] = val;
    onChange(next);
  };

  const updateField = (i, key, val) => {
    const next = [...items];
    next[i] = { ...next[i], [key]: val };
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 items-start">
          {fields ? (
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {fields.map(f => (
                <input
                  key={f.key}
                  type="text"
                  value={item[f.key] || ''}
                  onChange={e => updateField(i, f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className={`${inputClass} ${inputNormal}`}
                />
              ))}
            </div>
          ) : (
            <input
              type="text"
              value={item}
              onChange={e => updateItem(i, e.target.value)}
              placeholder={placeholder}
              className={`flex-1 ${inputClass} ${inputNormal}`}
            />
          )}
          <button
            type="button"
            onClick={() => removeItem(i)}
            className="w-9 h-[42px] flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors flex-shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-brand-purple hover:text-brand-purple text-sm font-medium transition-all"
      >
        <Plus size={15} />
        Tambah {placeholder || 'Item'}
      </button>
    </div>
  );
}

/* ── Image Upload ── */
function ImageUpload({ value, preview, onChange, label }) {
  const inputRef = useRef(null);
  const [drag, setDrag] = useState(false);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran gambar maksimal 2MB');
      return;
    }
    const url = URL.createObjectURL(file);
    onChange(file, url);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  return (
    <div>
      {preview ? (
        <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-gray-100 group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-4 py-2 bg-white text-gray-900 text-xs font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            >
              Ganti Gambar
            </button>
            <button
              type="button"
              onClick={() => onChange(null, null)}
              className="px-4 py-2 bg-red-500 text-white text-xs font-semibold rounded-xl hover:bg-red-600 transition-colors"
            >
              Hapus
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`w-full h-40 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
            drag
              ? 'border-brand-purple bg-brand-pale/30'
              : 'border-gray-200 hover:border-brand-purple hover:bg-brand-pale/20'
          }`}
        >
          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
            <Image size={18} className="text-gray-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-600">{label}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Drag & drop atau klik — PNG, JPG, WebP (max 2MB)
            </p>
          </div>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => handleFile(e.target.files[0])}
      />
    </div>
  );
}

/* ── Toast ── */
function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 3500);
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

/* ── Initial State ── */
const INIT = {
  title:             '',
  category:          '',
  status:            'draft',
  short_description: '',
  description:       '',
  tags:              [],
  features:          [],
  tech_stack:        [],
  demo_url:          '',
  repo_url:          '',
  is_featured:       false,
  order:             0,
};

/* ── Main Component ── */
export default function ProjectForm() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const isEdit       = Boolean(id);

  const [form,        setForm]        = useState(INIT);
  const [thumbnail,   setThumbnail]   = useState(null);
  const [thumbPreview,setThumbPreview]= useState(null);
  const [errors,      setErrors]      = useState({});
  const [loading,     setLoading]     = useState(false);
  const [fetching,    setFetching]    = useState(isEdit);
  const [toast,       setToast]       = useState(null);
  const [activeTab,   setActiveTab]   = useState('basic');

  /* Fetch existing project for edit */
  useEffect(() => {
    if (!isEdit) return;
    setFetching(true);
    api.get(`/projects/${id}`)
      .then(res => {
        const d = res.data.data || res.data;
        setForm({
          title:             d.title             || '',
          category:          d.category          || '',
          status:            d.status            || 'draft',
          short_description: d.short_description || '',
          description:       d.description       || '',
          tags:              d.tags              || [],
          features:          (d.features || []).map(f =>
            typeof f === 'string' ? { name: f, desc: '' } : f
          ),
          tech_stack:        (d.tech_stack || []).map(t =>
            typeof t === 'string' ? { name: t, role: '', color: '', icon: '' } : t
          ),
          demo_url:          d.demo_url          || '',
          repo_url:          d.repo_url          || '',
          is_featured:       d.is_featured       || false,
          order:             d.order             || 0,
        });
        if (d.thumbnail) setThumbPreview(d.thumbnail);
      })
      .catch(() => {
        setToast({ type: 'error', message: 'Gagal memuat data project.' });
      })
      .finally(() => setFetching(false));
  }, [id, isEdit]);

  /* Update field helper */
  const set = (field) => (val) =>
    setForm(prev => ({ ...prev, [field]: val }));

  const setE = (field) => (e) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  /* Validate */
  const validate = () => {
    const e = {};
    if (!form.title.trim())    e.title    = 'Judul wajib diisi';
    if (!form.category)        e.category = 'Kategori wajib dipilih';
    if (!form.description.trim()) e.description = 'Deskripsi wajib diisi';
    return e;
  };

  /* Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setActiveTab('basic');
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const payload = new FormData();

      /* Basic fields */
      Object.entries(form).forEach(([key, val]) => {
        if (key === 'tags' || key === 'features' || key === 'tech_stack') {
          payload.append(key, JSON.stringify(val));
        } else if (key === 'is_featured') {
          payload.append(key, val ? '1' : '0');
        } else {
          payload.append(key, val ?? '');
        }
      });

      /* Thumbnail */
      if (thumbnail) {
        payload.append('thumbnail', thumbnail);
      }

      /* Laravel FormData needs _method for PUT */
      if (isEdit) payload.append('_method', 'PUT');

      const url = isEdit
        ? `/admin/projects/${id}`
        : '/admin/projects';

      await api.post(url, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setToast({
        type: 'success',
        message: isEdit ? 'Project berhasil diperbarui!' : 'Project berhasil ditambahkan!',
      });

      setTimeout(() => navigate('/admin/projects'), 1500);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Terjadi kesalahan. Coba lagi.';
      setToast({ type: 'error', message: msg });

      /* Tampilkan validation errors dari Laravel */
      if (err?.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  /* Tabs */
  const TABS = [
    { key: 'basic',   label: 'Info Dasar',  hasError: !!(errors.title || errors.category || errors.description) },
    { key: 'detail',  label: 'Detail',      hasError: false },
    { key: 'media',   label: 'Media & URL', hasError: false },
    { key: 'publish', label: 'Publish',     hasError: false },
  ];

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex flex-col items-center gap-3">
          <Loader size={24} className="text-brand-purple animate-spin" />
          <p className="text-sm text-gray-400">Memuat data project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">

      {/* ── Header ── */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/admin/projects"
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="font-sora font-bold text-xl text-gray-900">
            {isEdit ? 'Edit Project' : 'Tambah Project Baru'}
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {isEdit ? `Mengedit: ${form.title || '...'}` : 'Isi form di bawah untuk menambahkan project baru'}
          </p>
        </div>
        {isEdit && form.title && (
          <Link
            to={`/projects/${id}`}
            target="_blank"
            className="ml-auto flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 text-xs font-semibold text-gray-500 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Eye size={13} />
            Preview
          </Link>
        )}
      </div>

      {/* ── Tab Nav ── */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 overflow-x-auto scrollbar-none">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-all min-w-fit ${
              activeTab === tab.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            {tab.hasError && (
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="flex flex-col gap-5">

          {/* ══ TAB: INFO DASAR ══ */}
          {activeTab === 'basic' && (
            <>
              <FormSection
                title="Informasi Utama"
                desc="Data dasar yang akan ditampilkan di halaman projects"
              >
                <div className="flex flex-col gap-4">

                  {/* Title */}
                  <FormField label="Judul Project" required error={errors.title}>
                    <input
                      type="text"
                      value={form.title}
                      onChange={setE('title')}
                      placeholder="cth: Eco-Shop E-Commerce"
                      className={`${inputClass} ${errors.title ? inputError : inputNormal}`}
                    />
                  </FormField>

                  {/* Short description */}
                  <FormField
                    label="Deskripsi Singkat"
                    hint={`${form.short_description.length}/120`}
                  >
                    <input
                      type="text"
                      value={form.short_description}
                      onChange={setE('short_description')}
                      maxLength={120}
                      placeholder="Satu kalimat singkat tentang project ini"
                      className={`${inputClass} ${inputNormal}`}
                    />
                  </FormField>

                  {/* Description */}
                  <FormField label="Deskripsi Lengkap" required error={errors.description}>
                    <textarea
                      value={form.description}
                      onChange={setE('description')}
                      rows={5}
                      placeholder="Jelaskan project secara detail — latar belakang, tujuan, proses, dan hasil..."
                      className={`${inputClass} resize-none ${errors.description ? inputError : inputNormal}`}
                    />
                    <p className="text-xs text-gray-300 mt-1 text-right">
                      {form.description.length} karakter
                    </p>
                  </FormField>

                  {/* Tags */}
                  <FormField
                    label="Teknologi / Tags"
                    hint="Enter atau koma untuk tambah"
                  >
                    <TagInput
                      tags={form.tags}
                      onChange={set('tags')}
                      placeholder="React, Flutter, Firebase..."
                    />
                  </FormField>
                </div>
              </FormSection>

              {/* Category */}
              <FormSection title="Kategori" desc="Pilih satu kategori yang paling sesuai">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => set('category')(cat.key)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                        form.category === cat.key
                          ? cat.color + ' border-2'
                          : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                      }`}
                    >
                      <cat.icon size={22} />
                      <span className="text-xs font-semibold">{cat.label}</span>
                    </button>
                  ))}
                </div>
                {errors.category && (
                  <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                    <AlertCircle size={11} />
                    {errors.category}
                  </p>
                )}
              </FormSection>
            </>
          )}

          {/* ══ TAB: DETAIL ══ */}
          {activeTab === 'detail' && (
            <>
              {/* Features */}
              <FormSection
                title="Fitur Utama"
                desc="Daftar fitur yang dimiliki project ini"
              >
                <DynamicList
                  items={form.features}
                  onChange={set('features')}
                  placeholder="Fitur"
                  fields={[
                    { key: 'name', placeholder: 'Nama fitur, cth: Task Management' },
                    { key: 'desc', placeholder: 'Deskripsi singkat fitur...' },
                  ]}
                />
              </FormSection>

              {/* Tech Stack */}
              <FormSection
                title="Tech Stack"
                desc="Teknologi yang digunakan dalam project ini"
              >
                <DynamicList
                  items={form.tech_stack}
                  onChange={set('tech_stack')}
                  placeholder="Teknologi"
                  fields={[
                    { key: 'name',  placeholder: 'Nama, cth: Flutter' },
                    { key: 'role',  placeholder: 'Peran, cth: Cross-platform UI' },
                  ]}
                />
              </FormSection>
            </>
          )}

          {/* ══ TAB: MEDIA & URL ══ */}
          {activeTab === 'media' && (
            <>
              {/* Thumbnail */}
              <FormSection
                title="Thumbnail"
                desc="Gambar utama yang mewakili project (rasio 16:9 disarankan)"
              >
                <ImageUpload
                  value={thumbnail}
                  preview={thumbPreview}
                  onChange={(file, url) => {
                    setThumbnail(file);
                    setThumbPreview(url);
                  }}
                  label="Upload Thumbnail"
                />
              </FormSection>

              {/* URLs */}
              <FormSection
                title="Link Project"
                desc="URL demo dan repository source code"
              >
                <div className="flex flex-col gap-4">
                  <FormField label="Demo URL">
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-mono">
                        https://
                      </span>
                      <input
                        type="url"
                        value={form.demo_url}
                        onChange={setE('demo_url')}
                        placeholder="example.com/demo"
                        className={`${inputClass} ${inputNormal} pl-16`}
                      />
                    </div>
                  </FormField>

                  <FormField label="Repository URL">
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-mono">
                        https://
                      </span>
                      <input
                        type="url"
                        value={form.repo_url}
                        onChange={setE('repo_url')}
                        placeholder="github.com/username/repo"
                        className={`${inputClass} ${inputNormal} pl-16`}
                      />
                    </div>
                  </FormField>
                </div>
              </FormSection>
            </>
          )}

          {/* ══ TAB: PUBLISH ══ */}
          {activeTab === 'publish' && (
            <>
              {/* Status */}
              <FormSection
                title="Status Publikasi"
                desc="Tentukan apakah project ini tampil di website publik"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {STATUSES.map(s => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => set('status')(s.key)}
                      className={`flex items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all ${
                        form.status === s.key
                          ? s.key === 'live'
                            ? 'border-green-400 bg-green-50'
                            : 'border-yellow-400 bg-yellow-50'
                          : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 ${
                        form.status === s.key
                          ? s.key === 'live'
                            ? 'border-green-500 bg-green-500'
                            : 'border-yellow-500 bg-yellow-500'
                          : 'border-gray-300'
                      }`} />
                      <div>
                        <div className="font-semibold text-sm text-gray-900">
                          {s.label}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {s.desc}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </FormSection>

              {/* Options */}
              <FormSection
                title="Opsi Tambahan"
                desc="Pengaturan tampilan project"
              >
                <div className="flex flex-col gap-4">

                  {/* Featured */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        Featured Project
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        Tampilkan di section "Featured Projects" halaman Home
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => set('is_featured')(!form.is_featured)}
                      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
                        form.is_featured ? 'bg-brand-purple' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                        form.is_featured ? 'left-5' : 'left-0.5'
                      }`} />
                    </button>
                  </div>

                  {/* Order */}
                  <FormField
                    label="Urutan Tampil"
                    hint="Angka lebih kecil tampil lebih dulu"
                  >
                    <input
                      type="number"
                      value={form.order}
                      onChange={setE('order')}
                      min={0}
                      max={999}
                      className={`${inputClass} ${inputNormal} w-32`}
                    />
                  </FormField>
                </div>
              </FormSection>

              {/* Summary */}
              <div className="bg-brand-pale/50 rounded-2xl border border-brand-pale p-5">
                <div className="text-xs font-semibold text-brand-purple uppercase tracking-wide mb-3">
                  Ringkasan
                </div>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  {[
                    { label: 'Judul',     val: form.title      || '—' },
                    { label: 'Kategori',  val: form.category   || '—' },
                    { label: 'Status',    val: form.status },
                    { label: 'Featured',  val: form.is_featured ? 'Ya' : 'Tidak' },
                    { label: 'Tags',      val: form.tags.length > 0 ? `${form.tags.length} tag` : '—' },
                    { label: 'Fitur',     val: form.features.length > 0 ? `${form.features.length} fitur` : '—' },
                    { label: 'Tech Stack',val: form.tech_stack.length > 0 ? `${form.tech_stack.length} teknologi` : '—' },
                    { label: 'Thumbnail', val: thumbPreview ? '✓ Siap' : 'Belum ada' },
                  ].map(item => (
                    <div key={item.label} className="flex gap-2">
                      <span className="text-gray-400 min-w-[80px]">{item.label}</span>
                      <span className="font-semibold text-gray-700 capitalize truncate">
                        {item.val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── Action Buttons ── */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex gap-3">
              {/* Prev / Next tab */}
              {activeTab !== 'basic' && (
                <button
                  type="button"
                  onClick={() => {
                    const idx = TABS.findIndex(t => t.key === activeTab);
                    setActiveTab(TABS[idx - 1].key);
                  }}
                  className="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  ← Sebelumnya
                </button>
              )}
              {activeTab !== 'publish' && (
                <button
                  type="button"
                  onClick={() => {
                    const idx = TABS.findIndex(t => t.key === activeTab);
                    setActiveTab(TABS[idx + 1].key);
                  }}
                  className="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Selanjutnya →
                </button>
              )}
            </div>

            <div className="flex gap-3">
              <Link
                to="/admin/projects"
                className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-purple text-white text-sm font-semibold rounded-xl hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                {loading ? (
                  <>
                    <Loader size={15} className="animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save size={15} />
                    {isEdit ? 'Simpan Perubahan' : 'Tambah Project'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}