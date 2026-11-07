import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, UserCheck, Calendar,
  Settings, Shield, LogOut
} from 'lucide-react';
import Sidebar from '../components/common/Sidebar';
import Topbar from '../components/common/Topbar';
import { dummyAdmin } from '../data/dummyData';
import '../styles/layout.css';

const NAV_ITEMS = [
  {
    section: 'Main',
    items: [
      { path: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    ],
  },
  {
    section: 'Management',
    items: [
      { path: '/admin/doctors', label: 'Doctors', icon: <UserCheck size={16} /> },
      { path: '/admin/patients', label: 'Patients', icon: <Users size={16} /> },
      { path: '/admin/appointments', label: 'Appointments', icon: <Calendar size={16} /> },
    ],
  },
  {
    section: 'System',
    items: [
      { path: '/admin/settings', label: 'Settings', icon: <Settings size={16} /> },
    ],
  },
];

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => navigate('/');

  return (
    <div className="app-layout">
      <div
        className={`sidebar-overlay${sidebarOpen ? ' visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <div className={`sidebar${sidebarOpen ? ' open' : ''}`}>
        <Sidebar
          portalLabel="Admin Panel"
          navItems={NAV_ITEMS}
          onClose={() => setSidebarOpen(false)}
          bottomItems={[
            {
              label: 'Sign Out',
              icon: <LogOut size={16} />,
              onClick: handleLogout,
            },
          ]}
        />
      </div>

      <div className="main-area">
        <Topbar
          title="Admin Panel"
          user={{ name: dummyAdmin.name, role: dummyAdmin.role }}
          onMenuToggle={() => setSidebarOpen((v) => !v)}
        />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
