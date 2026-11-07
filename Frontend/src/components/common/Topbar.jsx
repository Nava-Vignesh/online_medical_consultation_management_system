import { Menu } from 'lucide-react';
import '../../styles/layout.css';

function Topbar({ title, user, onMenuToggle }) {
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '??';

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="mobile-menu-btn" onClick={onMenuToggle} aria-label="Open menu">
          <Menu size={20} />
        </button>
        <span className="topbar-title">{title}</span>
      </div>
      <div className="topbar-right">
        <div className="topbar-user">
          <div className="topbar-avatar">{initials}</div>
          <div>
            <div className="topbar-username">{user?.name}</div>
            <div className="topbar-role">{user?.role}</div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
