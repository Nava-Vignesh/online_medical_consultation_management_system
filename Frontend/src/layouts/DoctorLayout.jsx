import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, Users, FileText,
  ClipboardList, User, LogOut, CalendarClock,
  Receipt, Award, Stethoscope, CalendarDays
} from 'lucide-react';
import Sidebar from '../components/common/Sidebar';
import Topbar from '../components/common/Topbar';
import { dummyDoctor } from '../data/dummyData';
import '../styles/layout.css';

const NAV_ITEMS = [
  {
    section: 'Menu',
    items: [
      { path: '/doctor/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
      { path: '/doctor/calendar', label: 'Calendar', icon: <CalendarDays size={16} /> },
      { path: '/doctor/appointments', label: 'Appointments', icon: <Calendar size={16} /> },
      { path: '/doctor/patients', label: 'Patients', icon: <Users size={16} /> },
      { path: '/doctor/schedule', label: 'Schedule', icon: <CalendarClock size={16} /> },
      { path: '/doctor/prescriptions', label: 'Prescriptions', icon: <ClipboardList size={16} /> },
      { path: '/doctor/certificates', label: 'Certificates', icon: <Award size={16} /> },
      { path: '/doctor/invoices', label: 'Invoices', icon: <Receipt size={16} /> },
    ],
  },
  {
    section: 'Settings',
    items: [
      { path: '/doctor/profile', label: 'Profile Settings', icon: <User size={16} /> },
    ],
  },
];

function DoctorLayout() {
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
          portalLabel="Doctor Portal"
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
          title="Doctor Portal"
          user={{ name: dummyDoctor.name, role: dummyDoctor.department }}
          searchPlaceholder="Search patients, appointments..."
          onMenuToggle={() => setSidebarOpen((v) => !v)}
        />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DoctorLayout;
