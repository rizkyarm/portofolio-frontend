import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login, user }       = useAuth();
  const navigate              = useNavigate();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [errors, setErrors]   = useState({});
  const [showPass, setShowPass] = useState(false);
  const [status, setStatus]   = useState('idle'); 
  const [errMsg, setErrMsg]   = useState('');

  useEffect(() => {
    if (user) navigate('/admin', { replace: true });
  }, [user, navigate]);

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.email.trim())    e.email    = 'Email wajib diisi';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Format email tidak valid';
    if (!form.password.trim()) e.password = 'Password wajib diisi';
    else if (form.password.length < 6) e.password = 'Password minimal 6 karakter';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setStatus('loading');
    setErrMsg('');
    try {
      await login(form.email, form.password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setStatus('error');
      setErrMsg(
        err?.response?.data?.message ||
        err?.response?.data?.errors?.email?.[0] ||
        'Email atau password salah. Silakan coba lagi.'
      );
    }
  };

  const inputBase =
    'w-full pl-11 pr-4 py-3 rounded-xl border text-sm text-gray-800 ' +
    'placeholder-gray-400 bg-white outline-none transition-all ' +
    'focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10';

  return (
    <div className="min-h-screen flex overflow-hidden">

      {/* ══ LEFT — Branding Panel ══ */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 relative bg-brand-navy flex-col justify-between p-12 overflow-hidden">

        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-brand-purple/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-brand-light/10 blur-3xl" />
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
        </div>

        {/* Logo */}
        <div className="relative">
          <Link to="/" className="inline-flex items-center gap-2">
            <span className="font-sora font-bold text-2xl text-brand-light">AK</span>
            <span className="font-sora font-bold text-2xl text-white">Portfolio</span>
          </Link>
        </div>

        {/* Center content */}
        <div className="relative">
          <div className="text-xs font-semibold text-brand-light uppercase tracking-widest mb-4">
            Admin Panel
          </div>
          <h1 className="font-sora font-bold text-white leading-tight mb-5"
            style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
            Kelola portfolio
            <br />
            <span className="text-brand-light">kamu</span> dengan
            <br />mudah.
          </h1>
          <p className="text-slate-400 leading-relaxed max-w-sm">
            Dashboard lengkap untuk mengelola semua konten portfolio —
            projects, skills, services, dan pesan masuk.
          </p>

          {/* Feature list */}
          <div className="flex flex-col gap-3 mt-8">
            {[
              '🗂️  Kelola projects dengan mudah',
              '📊  Pantau statistik & pesan',
              '⚡  Update konten real-time',
              '🔒  Akses aman dengan autentikasi',
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 text-slate-300 text-sm"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-brand-light flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative text-xs text-slate-600">
          © {new Date().getFullYear()} Rizki Aditiya. All Rights Reserved.
        </div>
      </div>

      {/* ══ RIGHT — Login Form ══ */}
      <div className="flex-1 flex flex-col">

        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <Link to="/" className="font-sora font-bold text-lg">
            <span className="text-brand-purple">AK</span>
            <span className="text-gray-900"> Portfolio</span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft size={15} />
            Kembali
          </Link>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">

            {/* Header */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-pale rounded-2xl mb-5">
                <Lock size={20} className="text-brand-purple" />
              </div>
              <h2 className="font-sora font-bold text-2xl text-gray-900 mb-1">
                Selamat datang!
              </h2>
              <p className="text-gray-400 text-sm">
                Masuk ke dashboard admin portfolio kamu.
              </p>
            </div>

            {/* Error banner */}
            {status === 'error' && (
              <div className="flex items-start gap-2.5 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100 mb-5">
                <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                <span>{errMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Mail size={16} className={errors.email ? 'text-red-400' : 'text-gray-400'} />
                  </div>
                  <input
                    type="email"
                    placeholder="admin@portfolio.com"
                    value={form.email}
                    onChange={update('email')}
                    autoComplete="email"
                    className={`${inputBase} ${
                      errors.email
                        ? 'border-red-300 ring-2 ring-red-100'
                        : 'border-gray-200'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle size={11} />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-semibold text-gray-700">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Lock size={16} className={errors.password ? 'text-red-400' : 'text-gray-400'} />
                  </div>
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={update('password')}
                    autoComplete="current-password"
                    className={`${inputBase} pr-11 ${
                      errors.password
                        ? 'border-red-300 ring-2 ring-red-100'
                        : 'border-gray-200'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle size={11} />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand-purple text-white font-semibold rounded-xl hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all active:scale-95 mt-2"
              >
                {status === 'loading' ? (
                  <>
                    <div
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      style={{ animation: 'spin 0.7s linear infinite' }}
                    />
                    Masuk...
                  </>
                ) : (
                  'Masuk ke Dashboard'
                )}
              </button>

            </form>

            

            {/* Back to site */}
            <div className="mt-6 text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft size={14} />
                Kembali ke website
              </Link>
            </div>

          </div>
        </div>

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg) }
          }
        `}</style>
      </div>
    </div>
  );
}