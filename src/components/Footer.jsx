import { Link } from 'react-router-dom';
import { useDarkMode } from '../context/DarkModeContext';
import { Mail, MapPin, ArrowUpRight, Heart } from 'lucide-react';

const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'Projects', path: '/projects' },
  { label: 'Services', path: '/services' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

const projectLinks = [
  { label: 'Websites', path: '/projects?category=website' },
  { label: 'Android Apps', path: '/projects?category=android' },
  { label: 'Video Editing', path: '/projects?category=video' },
  { label: 'UI/UX Design', path: '/projects?category=design' },
];

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com' },
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'YouTube', href: 'https://youtube.com' },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const { isDarkMode } = useDarkMode();

  return (
    <footer
      className={`relative overflow-hidden ${isDarkMode ? 'bg-gray-950' : 'bg-[#0B1120]'
        }`}
    >
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-8">

        <div className={`rounded-2xl p-8 md:p-10 mb-14 border ${isDarkMode
            ? 'bg-gray-900/50 border-gray-800'
            : 'bg-white/[0.03] border-white/[0.06]'
          } backdrop-blur-sm`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-sora font-bold text-2xl md:text-3xl text-white mb-2">
                Punya ide project menarik?
              </h3>
              <p className="text-slate-400 text-sm md:text-base max-w-md">
                Mari wujudkan bersama. Saya selalu terbuka untuk kolaborasi dan tantangan baru.
              </p>
            </div>
            <Link
              to="/contact"
              className="group flex-shrink-0 inline-flex items-center gap-2 px-7 py-3.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-0.5 active:scale-95"
            >
              Hubungi Saya
              <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 mb-14">

          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="font-sora font-bold text-xl">
                <span className="text-emerald-400">My</span>
                <span className="text-white"> Portfolio</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-5 max-w-xs">
              Creative Developer & Digital Creator — membangun pengalaman digital yang bermakna.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 text-xs font-bold transition-all duration-300 hover:-translate-y-1 ${isDarkMode
                      ? 'bg-gray-800 hover:bg-emerald-500/20 hover:text-emerald-400'
                      : 'bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-400'
                    }`}
                  title={social.label}
                >
                  {social.label.substring(0, 2)}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-sora font-bold text-white text-sm mb-4 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-2.5">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-slate-400 hover:text-emerald-400 transition-colors duration-200 flex items-center gap-1 group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-emerald-400 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-sora font-bold text-white text-sm mb-4 uppercase tracking-wider">
              Projects
            </h4>
            <ul className="flex flex-col gap-2.5">
              {projectLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-slate-400 hover:text-emerald-400 transition-colors duration-200 flex items-center gap-1 group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-emerald-400 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-sora font-bold text-white text-sm mb-4 uppercase tracking-wider">
              Get In Touch
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:rizki@portfolio.com"
                className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-emerald-400 transition-colors group"
              >
                <Mail size={14} className="flex-shrink-0 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                rizki@portfolio.com
              </a>
              <div className="flex items-center gap-2.5 text-sm text-slate-400">
                <MapPin size={14} className="flex-shrink-0 text-slate-500" />
                Bandar Lampung, Indonesia
              </div>
              <div className="mt-2">
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  Available for work
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={`pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${isDarkMode ? 'border-gray-800' : 'border-white/[0.06]'
          }`}>
          <p className="text-slate-500 text-xs flex items-center gap-1">
            © {year} Rizki Aditiya Ramadan.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-slate-600 text-xs">v1.0</span>
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white transition-all duration-300 hover:-translate-y-1 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white/5 hover:bg-white/10'
                }`}
              title="Back to top"
            >
              ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}