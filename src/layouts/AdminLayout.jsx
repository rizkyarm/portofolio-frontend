import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FolderOpen, Wrench, Star,
  MessageSquare, User, LogOut, Menu, X,
  Bell, ChevronRight, ExternalLink, Settings,
  ChevronDown, Moon, Sun,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';
import MessagesAdmin from '../pages/admin/MessagesAdmin';

/* ── Nav config ── */
const navGroups = [
  {
    label: 'Main',
    items: [
      { path: '/admin',          icon: LayoutDashboard, label: 'Dashboard',  exact: true },
    ],
  },
  {
    label: 'Content',
    items: [
      { path: '/admin/projects', icon: FolderOpen,      label: 'Projects' },
      { path: '/admin/skills',   icon: Star,            label: 'Skills' },
      { path: '/admin/services', icon: Wrench,          label: 'Services' },
      { path: '/admin/messages', icon: MessageSquare,   label: 'Messages' },
    ],
  },
  {
    label: 'Account',
    items: [
      { path: '/admin/profile',  icon: User,            label: 'Profile' },
    ],
  },
];

/* ── Sidebar NavItem ── */
function NavItem({ item, unreadCount, collapsed, onClick, isDarkMode }) {
  const { pathname } = useLocation();
  const isActive = item.exact
    ? pathname === item.path
    : pathname.startsWith(item.path);

  return (
    <Link
      to={item.path}
      onClick={onClick}
      title={collapsed ? item.label : undefined}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
        isActive
          ? 'bg-green-900 text-white shadow-sm shadow-brand-purple/30'
          : `${isDarkMode ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`
      }`}
    >
      <item.icon size={17} className="flex-shrink-0" />
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge && unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-5 text-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </>
      )}
      {/* Tooltip saat collapsed */}
      {collapsed && (
        <div className={`absolute left-full ml-3 px-2.5 py-1.5 ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-gray-900 text-white'} text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50`}>
          {item.label}
          {item.badge && unreadCount > 0 && (
            <span className="ml-1.5 bg-red-500 text-white text-xs px-1 rounded-full">
              {unreadCount}
            </span>
          )}
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent" style={{ borderRightColor: isDarkMode ? '#1f2937' : '#111827' }} />
        </div>
      )}
    </Link>
  );
}

/* ── Main Layout ── */
export default function AdminLayout() {
  const { user, logout }        = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const navigate                = useNavigate();
  const { pathname }            = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unread,     setUnread]   = useState(3);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  /* Tutup mobile menu saat pindah halaman */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  /* Tutup user menu saat klik di luar */
  useEffect(() => {
    function handleClick(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  /* Current page title */
  const pageTitle = (() => {
    if (pathname === '/admin')               return 'Dashboard';
    if (pathname.includes('projects'))       return 'Projects';
    if (pathname.includes('skills'))         return 'Skills';
    if (pathname.includes('services'))       return 'Services';
    if (pathname.includes('messages'))       return 'Messages';
    if (pathname.includes('profile'))        return 'Profile';
    return 'Admin';
  })();

  const sidebarW = collapsed ? 'w-16' : 'w-56';

  return (
    // PERBAIKAN: Mengunci tinggi layar dan menyembunyikan overflow pada root
    <div className="h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex">

      {/* ══ SIDEBAR ══ */}

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-50 flex flex-col ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-brand-navy'} transition-all duration-300
          ${sidebarW}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Logo */}
        <div className={`flex items-center h-16 px-4 border-b ${isDarkMode ? 'border-gray-800' : 'border-white/5'} flex-shrink-0 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && (
            <Link to="/" className="font-sora font-bold text-base">
              <span className="text-green-300">My</span>
              <span className="text-white"> Admin</span>
            </Link>
          )}
          {collapsed && (
            <Link to="/" className="font-sora font-bold text-green-300 text-lg">
              My
            </Link>
          )}
          {/* Collapse toggle — desktop only */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`hidden lg:flex w-7 h-7 rounded-lg ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white/5 hover:bg-white/10'} items-center justify-center ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-slate-400 hover:text-white'} transition-colors flex-shrink-0`}
          >
            <ChevronRight
              size={14}
              className={`transition-transform duration-300 ${collapsed ? '' : 'rotate-180'}`}
            />
          </button>
          {/* Close — mobile */}
          <button
            onClick={() => setMobileOpen(false)}
            className={`lg:hidden w-7 h-7 flex items-center justify-center ${isDarkMode ? 'text-gray-400' : 'text-slate-400'}`}
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 flex flex-col gap-5">
          {navGroups.map((group) => (
            <div key={group.label}>
              {!collapsed && (
                <div className={`text-xs font-semibold ${isDarkMode ? 'text-gray-500' : 'text-slate-600'} uppercase tracking-widest px-3 mb-1.5`}>
                  {group.label}
                </div>
              )}
              <div className="flex flex-col gap-0.5">
                {group.items.map((item) => (
                  <NavItem
                    key={item.path}
                    item={item}
                    unreadCount={unread}
                    collapsed={collapsed}
                    onClick={() => setMobileOpen(false)}
                    isDarkMode={isDarkMode}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom — user info + logout */}
        {/* mt-auto memastikan ini selalu didorong ke dasar sidebar */}
        <div className={`mt-auto border-t ${isDarkMode ? 'border-gray-800' : 'border-white/5'} p-2 flex-shrink-0`}>
          {!collapsed ? (
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-white/5'} transition-colors group`}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-purple to-brand-light flex items-center justify-center font-sora font-bold text-white text-xs flex-shrink-0">
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-white text-xs font-semibold truncate">
                    {user?.name || 'Admin'}
                  </div>
                  <div className="text-slate-500 text-xs truncate">
                    {user?.email || ''}
                  </div>
                </div>
                <ChevronDown
                  size={13}
                  className={`${isDarkMode ? 'text-gray-500' : 'text-slate-500'} transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
                />
              </button>

              {/* User dropdown */}
              {showUserMenu && (
                <div className={`absolute bottom-full left-0 right-0 mb-1 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-slate-800 border-white/10'} rounded-xl border overflow-hidden shadow-xl`}>
                  <Link
                    to="/admin/profile"
                    className={`flex items-center gap-2.5 px-4 py-2.5 ${isDarkMode ? 'text-gray-300 hover:bg-gray-600 hover:text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'} text-xs font-medium transition-colors`}
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings size={13} />
                    Profile Settings
                  </Link>
                  <Link
                    to="/"
                    target="_blank"
                    className={`flex items-center gap-2.5 px-4 py-2.5 ${isDarkMode ? 'text-gray-300 hover:bg-gray-600 hover:text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'} text-xs font-medium transition-colors`}
                    onClick={() => setShowUserMenu(false)}
                  >
                    <ExternalLink size={13} />
                    View Live Site
                  </Link>
                  <button
                    onClick={toggleDarkMode}
                    className={`w-full flex items-center gap-2.5 px-4 py-2.5 ${isDarkMode ? 'text-yellow-400 hover:bg-yellow-500/10' : 'text-yellow-500 hover:bg-yellow-500/10'} text-xs font-medium transition-colors`}
                  >
                    {isDarkMode ? <Sun size={13} /> : <Moon size={13} />}
                    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                  </button>
                  <div className={`border-t ${isDarkMode ? 'border-gray-600' : 'border-white/5'}`} />
                  <button
                    onClick={handleLogout}
                    className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-red-400 ${isDarkMode ? 'hover:bg-red-500/20' : 'hover:bg-red-500/10'} text-xs font-medium transition-colors`}
                  >
                    <LogOut size={13} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleLogout}
              title="Logout"
              className="w-full flex justify-center py-2.5 text-slate-500 hover:text-red-400 transition-colors"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </aside>

      {/* ══ MAIN AREA ══ */}
      {/* PERBAIKAN: Memastikan wrapper kanan tinggi penuh dan tidak overlap */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">

        {/* ── TOPBAR ── */}
        <header className={`h-16 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border-b flex items-center px-4 md:px-6 gap-4 flex-shrink-0 z-30`}>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className={`lg:hidden w-9 h-9 flex items-center justify-center rounded-xl ${isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-400 hover:bg-gray-50'} transition-colors`}
          >
            <Menu size={20} />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <span className={`hidden sm:inline ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Admin</span>
            <span className={`hidden sm:inline ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`}>/</span>
            <span className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{pageTitle}</span>
          </div>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-2">

            {/* View site */}
            <a
              href="/"
              target="_blank"
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold ${isDarkMode ? 'text-gray-400 hover:text-gray-200 border-gray-700 hover:border-gray-600' : 'text-gray-500 hover:text-gray-900 border-gray-200 hover:border-gray-300'} border rounded-lg transition-all`}
            >
              <ExternalLink size={12} />
              View Site
            </a>

            {/* Notifications */}
            <button className={`relative w-9 h-9 flex items-center justify-center rounded-xl ${isDarkMode ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-200' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700'} transition-colors`}>
              <Bell size={17} />
              {unread > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-purple to-brand-light flex items-center justify-center font-sora font-bold text-white text-xs cursor-pointer">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {/* ── PAGE CONTENT ── */}
        {/* PERBAIKAN: Menerapkan overflow-y-auto secara spesifik pada tag <main> */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
}