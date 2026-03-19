import { FileText, Home, LayoutDashboard, LogOut, Settings, Shapes } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const links = [
  { to: '/admin', label: 'لوحة التحكم', icon: LayoutDashboard, end: true },
  { to: '/admin/articles', label: 'إدارة المقالات', icon: FileText },
  { to: '/admin/categories', label: 'إدارة التصنيفات', icon: Shapes },
  { to: '/admin/homepage', label: 'إدارة الرئيسية', icon: Home },
  { to: '/admin/settings', label: 'إعدادات الموقع', icon: Settings }
];

function AdminLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="grid min-h-screen lg:grid-cols-[290px_1fr]">
        <aside className="border-l border-slate-200 bg-slate-950 p-6 text-white">
          <div className="rounded-3xl bg-white/5 p-5">
            <p className="text-xs text-slate-400">visa-work</p>
            <h1 className="mt-2 text-2xl font-black">لوحة الإدارة</h1>
            <p className="mt-2 text-sm text-slate-400">
              أهلاً {user?.name || 'بالمدير'}، يمكنك إدارة المقالات والتصنيفات وإعدادات الصفحة الرئيسية.
            </p>
          </div>

          <nav className="mt-8 grid gap-2">
            {links.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                      isActive ? 'bg-brand-600 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-8 inline-flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/5"
          >
            <LogOut className="h-4 w-4" />
            تسجيل الخروج
          </button>
        </aside>

        <div className="p-4 sm:p-6 lg:p-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
