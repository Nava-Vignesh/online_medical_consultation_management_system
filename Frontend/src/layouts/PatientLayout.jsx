import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, FileText, MessageSquare,
  User, LogOut, Bell
} from 'lucide-react';
import Sidebar from '../components/common/Sidebar';
import Topbar from '../components/common/Topbar';
import { dummyPatient } from '../data/dummyData';
import '../styles/layout.css';

const NAV_ITEMS = [
  {
    section: 'Main',
    items: [
      { path: '/patient/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    ],
  },
  {
    section: 'Care',
    items: [
      { path: '/patient/appointments', label: 'Appointments', icon: <Calendar size={16} /> },
      { path: '/patient/records', label: 'Medical Records', icon: <FileText size={16} /> },
      { path: '/patient/consultations', label: 'Consultations', icon: <MessageSquare size={16} /> },
    ],
  },
  {
    section: 'Account',
    items: [
      { path: '/patient/profile', label: 'My Profile', icon: <User size={16} /> },
    ],
  },
];

function PatientLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => navigate('/');

  return (
    <div className="app-layout">
      {/* Overlay for mobile */}
      <div
        className={`sidebar-overlay${sidebarOpen ? ' visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <div className={`sidebar${sidebarOpen ? ' open' : ''}`}>
        <Sidebar
          portalLabel="Patient Portal"
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
          title="Patient Portal"
          user={{ name: dummyPatient.name, role: 'Patient' }}
          onMenuToggle={() => setSidebarOpen((v) => !v)}
        />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default PatientLayout;
