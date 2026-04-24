import { useState, useEffect, useRef } from 'react';
import {
  User, Mail, Phone, MapPin, Link2, Save,
  Upload, Camera, CheckCircle, AlertCircle, X, Loader,
  Sun, Moon, Globe, Eye, EyeOff
} from 'lucide-react';
import { 
  FiGithub, FiLinkedin, FiYoutube, FiInstagram, FiTwitter 
} from 'react-icons/fi';
import api from '../../services/api';
import { useDarkMode } from '../../context/DarkModeContext';

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
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-white text-sm font-semibold ${ok ? 'bg-emerald-500' : 'bg-red-500'}`}>
      {ok ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      {toast.message}
      <button onClick={onClose} className="ml-1 opacity-70 hover:opacity-100">
        <X size={14} />
      </button>
    </div>
  );
}

/* ── Avatar Upload ── */
function AvatarUpload({ preview, onChange, name }) {
  const { isDarkMode } = useDarkMode();
  const ref = useRef(null);
  const initials = name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'AK';

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran gambar maksimal 2MB'); return;
    }
    onChange(file, URL.createObjectURL(file));
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group cursor-pointer" onClick={() => ref.current?.click()}>
        {preview ? (
          <img src={preview} alt="Avatar"
            className="w-28 h-28 rounded-3xl object-cover border-4 border-purple-500" />
        ) : (
          <div className="w-28 h-28 rounded-3xl flex items-center justify-center font-sora font-bold text-3xl text-white border-4 border-purple-500 bg-gradient-to-br from-purple-600 to-indigo-400">
            {initials}
          </div>
        )}
        <div className="absolute inset-0 rounded-3xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Camera size={22} className="text-white" />
        </div>
      </div>
      <button type="button" onClick={() => ref.current?.click()}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all hover:opacity-80 
        ${isDarkMode ? 'border-slate-700 text-slate-300 bg-slate-800' : 'border-slate-200 text-slate-600 bg-slate-100'}`}>
        <Upload size={14} />
        Ganti Foto
      </button>
      <input ref={ref} type="file" accept="image/*" className="hidden"
        onChange={e => handleFile(e.target.files[0])} />
    </div>
  );
}

/* ── Section wrapper ── */
function Section({ title, desc, children }) {
  const { isDarkMode } = useDarkMode();
  return (
    <div className={`rounded-2xl border overflow-hidden transition-all hover:shadow-md 
      ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
      <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
        <h2 className={`font-sora font-bold text-sm ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
          {title}
        </h2>
        {desc && <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{desc}</p>}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

/* ── Input ── */
function Field({ label, icon: Icon, error, hint, children }) {
  const { isDarkMode } = useDarkMode();
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className={`text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
          {label}
        </label>
        {hint && <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{hint}</span>}
      </div>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon size={15} className={isDarkMode ? 'text-slate-500' : 'text-slate-400'} />
          </div>
        )}
        <div className={Icon ? 'pl-10' : ''}>{children}</div>
      </div>
      {error && (
        <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
          <AlertCircle size={11} />{error}
        </p>
      )}
    </div>
  );
}

const SOCIALS = [
  { key: 'linkedin',  label: 'LinkedIn',  icon: FiLinkedin,  placeholder: 'linkedin.com/in/username' },
  { key: 'github',    label: 'GitHub',    icon: FiGithub,    placeholder: 'github.com/username' },
  { key: 'youtube',   label: 'YouTube',   icon: FiYoutube,   placeholder: 'youtube.com/@channel' },
  { key: 'instagram', label: 'Instagram', icon: FiInstagram, placeholder: 'instagram.com/username' },
  { key: 'twitter',   label: 'Twitter/X', icon: FiTwitter,   placeholder: 'twitter.com/username' },
  { key: 'website',   label: 'Website',   icon: Globe,       placeholder: 'yourwebsite.com' }, 
];

const TABS = [
  { key: 'personal', label: '👤 Personal' },
  { key: 'socials',  label: '🔗 Sosial' },
  { key: 'stats',    label: '📊 Stats' },
  { key: 'account',  label: '🔒 Akun' },
];

const INIT = {
  name: '', tagline: '', bio: '', email: '', phone: '',
  location: '', cv_url: '',
  socials: { linkedin:'', github:'', youtube:'', instagram:'', twitter:'', website:'' },
  stats: { projects: 24, clients: 18, experience: 3, coffee: 1000 },
};

export default function ProfileAdmin() {
  const { isDarkMode, toggleDarkMode } = useDarkMode(); 
  const [form,          setForm]        = useState(INIT);
  const [avatar,        setAvatar]      = useState(null);
  const [avatarPreview, setAvatarPreview]= useState(null);
  const [loading,       setLoading]     = useState(true);
  const [saving,        setSaving]      = useState(false);
  const [toast,         setToast]       = useState(null);
  const [activeTab,     setActiveTab]   = useState('personal');
  const [showPass,      setShowPass]    = useState(false);
  const [passForm,      setPassForm]    = useState({ current: '', new: '', confirm: '' });
  const [errors,        setErrors]      = useState({});

  const inputCls = `w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
    isDarkMode 
      ? 'bg-slate-900 border-slate-700 text-white focus:border-purple-500' 
      : 'bg-white border-slate-200 text-slate-900 focus:border-purple-500'
  }`;

  const fetchProfile = async () => {
    try {
      const res = await api.get('/admin/profile'); // Sesuaikan endpoint dengan backend
      const d = res.data.data || res.data;
      
      const parsedSocials = typeof d.socials === 'string' ? JSON.parse(d.socials) : (d.socials || {});
      const parsedStats = typeof d.stats === 'string' ? JSON.parse(d.stats) : (d.stats || {});

      setForm({
        name:     d.name     || '',
        tagline:  d.tagline  || '',
        bio:      d.bio      || '',
        email:    d.email    || '',
        phone:    d.phone    || '',
        location: d.location || '',
        cv_url:   d.cv_url   || '',
        socials: {
          linkedin:  parsedSocials.linkedin  || '',
          github:    parsedSocials.github    || '',
          youtube:   parsedSocials.youtube   || '',
          instagram: parsedSocials.instagram || '',
          twitter:   parsedSocials.twitter   || '',
          website:   parsedSocials.website   || '',
        },
        stats: {
          projects:   parsedStats.projects   ?? 24,
          clients:    parsedStats.clients    ?? 18,
          experience: parsedStats.experience ?? 3,
          coffee:     parsedStats.coffee     ?? 1000,
        },
      });
      if (d.avatar) setAvatarPreview(d.avatar);
    } catch (err) {
      // Abaikan jika 404 (database kosong)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const set = (field) => (e) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const setSocial = (key) => (e) =>
    setForm(prev => ({
      ...prev,
      socials: { ...prev.socials, [key]: e.target.value },
    }));

  const setStat = (key) => (e) =>
    setForm(prev => ({
      ...prev,
      stats: { ...prev.stats, [key]: Number(e.target.value) },
    }));

  /* Save profile */
  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = new FormData();
      
      // Basic text fields
      ['name', 'tagline', 'bio', 'email', 'phone', 'location', 'cv_url'].forEach(k => {
        payload.append(k, form[k] || '');
      });

      // Format Object menjadi Associative Array untuk Laravel
      Object.entries(form.socials).forEach(([k, v]) => payload.append(`socials[${k}]`, v || ''));
      Object.entries(form.stats).forEach(([k, v]) => payload.append(`stats[${k}]`, v || 0));

      if (avatar) payload.append('avatar', avatar);

      // Selalu gunakan PUT via POST untuk Upsert di Laravel
      payload.append('_method', 'PUT');

      await api.post('/admin/profile', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      setToast({ type: 'success', message: 'Profil berhasil diperbarui!' });
      await fetchProfile();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Gagal menyimpan profil.';
      setToast({ type: 'error', message: msg });
    } finally {
      setSaving(false);
    }
  };

  /* Change password */
  const handleChangePassword = async () => {
    const e = {};
    if (!passForm.current)                         e.current  = 'Wajib diisi';
    if (!passForm.new || passForm.new.length < 8)  e.new      = 'Min. 8 karakter';
    if (passForm.new !== passForm.confirm)          e.confirm  = 'Password tidak cocok';
    if (Object.keys(e).length) { setErrors(e); return; }
    
    setErrors({});
    setSaving(true);
    try {
      await api.put('/admin/profile', { // Pastikan endpoint ini ditangani di backend
        current_password:      passForm.current,
        password:              passForm.new,
        password_confirmation: passForm.confirm,
      });
      setToast({ type: 'success', message: 'Password berhasil diubah!' });
      setPassForm({ current: '', new: '', confirm: '' });
    } catch (err) {
      const msg = err?.response?.data?.message || 'Password saat ini salah.';
      setToast({ type: 'error', message: msg });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className="flex flex-col items-center gap-3">
        <Loader size={24} className="animate-spin text-purple-500" />
        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Memuat profil...</p>
      </div>
    </div>
  );

  return (
    <div className={`p-6 md:p-8 max-w-full mx-auto min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className="max-w-5xl mx-auto">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className={`font-sora font-bold text-2xl ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              Profile Settings
            </h1>
            <p className={`text-sm mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Kelola informasi profil yang tampil di website
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button onClick={() => toggleDarkMode && toggleDarkMode()}
              className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-all hover:scale-105
              ${isDarkMode ? 'border-slate-700 text-slate-400 bg-slate-800' : 'border-slate-200 text-slate-500 bg-white'}`}>
              {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button onClick={handleSave} disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white text-sm font-semibold rounded-xl transition-all hover:opacity-90 active:scale-95 disabled:opacity-60">
              {saving
                ? <><Loader size={15} className="animate-spin" />Menyimpan...</>
                : <><Save size={15} />Simpan Profil</>}
            </button>
          </div>
        </div>

        {/* ── Layout: Avatar + Form ── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          {/* Left sidebar */}
          <div className="flex flex-col gap-5">
            {/* Avatar card */}
            <div className={`rounded-2xl border p-6 text-center ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <AvatarUpload
                preview={avatarPreview}
                onChange={(file, url) => { setAvatar(file); setAvatarPreview(url); }}
                name={form.name}
              />
              <div className="mt-4">
                <div className={`font-sora font-bold text-sm ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                  {form.name || 'Nama Admin'}
                </div>
                <div className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {form.tagline || 'Tagline belum diset'}
                </div>
              </div>

              {/* Live preview stats */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                {[
                  { label: 'Projects', val: form.stats.projects },
                  { label: 'Clients',  val: form.stats.clients },
                ].map(s => (
                  <div key={s.label} className={`rounded-xl p-2 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                    <div className={`font-sora font-bold text-lg ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                      {s.val}
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Available badge */}
              <div className={`mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-emerald-500 py-2 px-3 rounded-xl 
                ${isDarkMode ? 'bg-emerald-900/20' : 'bg-emerald-50'}`}>
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                Available for work
              </div>
            </div>

            {/* Tabs */}
            <div className={`rounded-2xl border overflow-hidden ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              {TABS.map((tab, i) => {
                const isActive = activeTab === tab.key;
                return (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-left transition-colors border-b last:border-0
                    ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}
                    ${isActive 
                      ? (isDarkMode ? 'bg-purple-900/30 text-purple-400 font-semibold' : 'bg-purple-50 text-purple-600 font-semibold')
                      : (isDarkMode ? 'text-slate-400 hover:bg-slate-700' : 'text-slate-500 hover:bg-slate-50')
                    }`}>
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right content */}
          <div className="md:col-span-3 flex flex-col gap-5">

            {/* ── PERSONAL TAB ── */}
            {activeTab === 'personal' && (
              <>
                <Section title="Informasi Personal" desc="Data dasar yang tampil di halaman About">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <Field label="Nama Lengkap" icon={User}>
                        <input type="text" value={form.name} onChange={set('name')}
                          placeholder="Ariana Kresna" className={`${inputCls} pl-10`} />
                      </Field>
                    </div>
                    <div className="sm:col-span-2">
                      <Field label="Tagline" hint={`${form.tagline.length}/80`}>
                        <input type="text" value={form.tagline} onChange={set('tagline')}
                          maxLength={80} placeholder="Creative Developer & UI/UX Designer" className={inputCls} />
                      </Field>
                    </div>
                    <div className="sm:col-span-2">
                      <Field label="Bio" hint={`${form.bio.length}/500`}>
                        <textarea value={form.bio} onChange={set('bio')} rows={4} maxLength={500}
                          placeholder="Ceritakan tentang dirimu secara singkat dan menarik..."
                          className={`${inputCls} resize-none`} />
                      </Field>
                    </div>
                    <Field label="Email" icon={Mail}>
                      <input type="email" value={form.email} onChange={set('email')}
                        placeholder="ariana@email.com" className={`${inputCls} pl-10`} />
                    </Field>
                    <Field label="Nomor HP" icon={Phone}>
                      <input type="text" value={form.phone} onChange={set('phone')}
                        placeholder="+62 812 3456 789" className={`${inputCls} pl-10`} />
                    </Field>
                    <Field label="Lokasi" icon={MapPin}>
                      <input type="text" value={form.location} onChange={set('location')}
                        placeholder="Bandung, Jawa Barat" className={`${inputCls} pl-10`} />
                    </Field>
                    <Field label="CV / Resume URL" icon={Link2}>
                      <input type="url" value={form.cv_url} onChange={set('cv_url')}
                        placeholder="https://drive.google.com/..." className={`${inputCls} pl-10`} />
                    </Field>
                  </div>
                </Section>
              </>
            )}

            {/* ── SOCIALS TAB ── */}
            {activeTab === 'socials' && (
              <Section title="Media Sosial" desc="Link profil sosial yang tampil di website">
                <div className="flex flex-col gap-4">
                  {SOCIALS.map(s => (
                    <div key={s.key} className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 
                        ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                        <s.icon size={17} className={isDarkMode ? 'text-slate-400' : 'text-slate-500'} />
                      </div>
                      <div className="flex-1">
                        <label className={`block text-xs font-semibold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          {s.label}
                        </label>
                        <div className="relative">
                          <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono pointer-events-none 
                            ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            https://
                          </span>
                          <input type="text" value={form.socials[s.key]} onChange={setSocial(s.key)}
                            placeholder={s.placeholder} className={`${inputCls} pl-16 text-xs`} />
                        </div>
                      </div>
                      {form.socials[s.key] && (
                        <a href={`https://${form.socials[s.key]}`} target="_blank" rel="noreferrer"
                          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors flex-shrink-0 
                          ${isDarkMode ? 'bg-slate-700 text-slate-400 hover:bg-slate-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                          <Eye size={13} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* ── STATS TAB ── */}
            {activeTab === 'stats' && (
              <Section title="Statistik Portfolio" desc="Angka yang tampil di hero section dan halaman About">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    { key: 'projects',   label: '🗂️  Total Projects',   suffix: '+' },
                    { key: 'clients',    label: '🤝  Happy Clients',    suffix: '' },
                    { key: 'experience', label: '📅  Years Experience', suffix: '' },
                    { key: 'coffee',     label: '☕  Cups of Coffee',  suffix: '+' },
                  ].map(stat => (
                    <div key={stat.key}
                      className={`rounded-2xl border p-5 transition-all hover:shadow-md 
                      ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-100 border-slate-200'}`}>
                      <div className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        {stat.label}
                      </div>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="font-sora font-bold text-4xl text-purple-500">
                          {form.stats[stat.key]}
                        </span>
                        <span className={`font-sora font-bold text-2xl ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                          {stat.suffix}
                        </span>
                      </div>
                      <input
                        type="range" min={0}
                        max={stat.key === 'coffee' ? 9999 : stat.key === 'experience' ? 20 : 999}
                        step={stat.key === 'coffee' ? 100 : 1}
                        value={form.stats[stat.key]} onChange={setStat(stat.key)}
                        className="w-full h-2 rounded-full appearance-none cursor-pointer bg-slate-200 accent-purple-500 dark:bg-slate-600"
                      />
                      <div className={`flex justify-between text-xs mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                        <span>0</span>
                        <span>{stat.key === 'coffee' ? '9,999' : stat.key === 'experience' ? '20' : '999'}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Preview */}
                <div className={`mt-5 rounded-2xl border p-5 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <div className={`text-xs font-semibold uppercase tracking-widest mb-3 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    Preview di Hero Section
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { val: `${form.stats.projects}+`, label: 'Projects' },
                      { val: form.stats.clients,        label: 'Clients' },
                      { val: `${form.stats.experience}yr`, label: 'Experience' },
                      { val: `${form.stats.coffee}+`,   label: 'Coffees' },
                    ].map(s => (
                      <div key={s.label} className={`text-center p-3 rounded-xl ${isDarkMode ? 'bg-slate-700' : 'bg-slate-50'}`}>
                        <div className={`font-sora font-bold text-xl ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                          {s.val}
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Section>
            )}

            {/* ── ACCOUNT TAB ── */}
            {activeTab === 'account' && (
              <>
                <Section title="Informasi Akun" desc="Data login admin panel">
                  <div className="flex flex-col gap-4">
                    <Field label="Email Login" icon={Mail}>
                      <input type="email" value={form.email} onChange={set('email')} className={`${inputCls} pl-10`} />
                    </Field>
                    <div className={`rounded-xl p-4 border flex items-center gap-2 text-xs 
                      ${isDarkMode ? 'bg-slate-700 border-slate-600 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                      <CheckCircle size={13} className="text-emerald-500" />
                      Akun admin aktif. Login terakhir hari ini.
                    </div>
                  </div>
                </Section>

                <Section title="Ganti Password" desc="Pastikan password baru minimal 8 karakter">
                  <div className="flex flex-col gap-4">
                    {[
                      { key: 'current', label: 'Password Saat Ini',  placeholder: '••••••••' },
                      { key: 'new',     label: 'Password Baru',      placeholder: 'Min. 8 karakter' },
                      { key: 'confirm', label: 'Konfirmasi Password', placeholder: 'Ulangi password baru' },
                    ].map(f => (
                      <div key={f.key}>
                        <label className={`block text-sm font-semibold mb-1.5 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                          {f.label}
                        </label>
                        <div className="relative">
                          <input
                            type={showPass ? 'text' : 'password'}
                            value={passForm[f.key]}
                            onChange={e => setPassForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                            placeholder={f.placeholder}
                            className={`${inputCls} pr-11 ${errors[f.key] ? 'border-red-500' : ''}`}
                          />
                          {f.key === 'current' && (
                            <button type="button" onClick={() => setShowPass(!showPass)}
                              className={`absolute right-3.5 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                          )}
                        </div>
                        {errors[f.key] && (
                          <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle size={11} />{errors[f.key]}
                          </p>
                        )}
                      </div>
                    ))}

                    {/* Password strength */}
                    {passForm.new && (
                      <div>
                        <div className={`flex justify-between text-xs mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          <span>Kekuatan password</span>
                          <span style={{ color: passForm.new.length < 8 ? '#ef4444' : passForm.new.length < 12 ? '#f59e0b' : '#10b981' }}>
                            {passForm.new.length < 8 ? 'Lemah' : passForm.new.length < 12 ? 'Sedang' : 'Kuat'}
                          </span>
                        </div>
                        <div className={`h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                          <div className="h-full rounded-full transition-all"
                            style={{
                              width: `${Math.min(100, (passForm.new.length / 16) * 100)}%`,
                              background: passForm.new.length < 8 ? '#ef4444' : passForm.new.length < 12 ? '#f59e0b' : '#10b981',
                            }} />
                        </div>
                      </div>
                    )}

                    <button onClick={handleChangePassword} disabled={saving}
                      className="flex items-center justify-center gap-2 py-2.5 bg-purple-600 text-white text-sm font-semibold rounded-xl transition-all hover:opacity-90 disabled:opacity-60">
                      {saving
                        ? <><Loader size={14} className="animate-spin" />Menyimpan...</>
                        : <><Save size={14} />Ganti Password</>}
                    </button>
                  </div>
                </Section>

                {/* Danger zone */}
                <div className={`rounded-2xl border-2 overflow-hidden 
                  ${isDarkMode ? 'border-red-900/50 bg-red-950/20' : 'border-red-200 bg-white'}`}>
                  <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-red-900/50' : 'border-red-100'}`}>
                    <h2 className="font-sora font-bold text-sm text-red-500">⚠️  Danger Zone</h2>
                    <p className="text-xs mt-0.5 text-red-400">Tindakan di bawah ini tidak dapat dibatalkan</p>
                  </div>
                  <div className="p-6 flex items-center justify-between">
                    <div>
                      <div className={`text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                        Reset semua data portfolio
                      </div>
                      <div className="text-xs mt-0.5 text-red-400">
                        Menghapus semua project, skill, dan pesan masuk
                      </div>
                    </div>
                    <button className="px-4 py-2 border-2 border-red-300 text-red-500 text-sm font-semibold rounded-xl hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                      onClick={() => setToast({ type: 'error', message: 'Fitur ini dinonaktifkan untuk keamanan.' })}>
                      Reset Data
                    </button>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>

        {/* ── Bottom Save Bar ── */}
        <div className={`fixed bottom-0 left-0 right-0 border-t px-6 py-4 flex items-center justify-between z-30 
          ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            💡 Perubahan belum tersimpan otomatis
          </p>
          <button onClick={handleSave} disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white text-sm font-semibold rounded-xl transition-all hover:opacity-90 active:scale-95 disabled:opacity-60">
            {saving
              ? <><Loader size={15} className="animate-spin" />Menyimpan...</>
              : <><Save size={15} />Simpan Semua Perubahan</>}
          </button>
        </div>

        {/* Bottom padding for fixed bar */}
        <div className="h-20" />
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}