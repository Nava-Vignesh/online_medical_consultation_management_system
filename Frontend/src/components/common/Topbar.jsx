import { Menu, Search, ChevronDown } from 'lucide-react';
import '../../styles/layout.css';

function Topbar({ title, user, onMenuToggle, searchPlaceholder }) {
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

      {searchPlaceholder && (
        <div className="topbar-search" style={{ position: 'relative', width: '380px', maxWidth: '40%' }}>
          <Search size={15} color="var(--secondary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder={searchPlaceholder}
            style={{
              width: '100%',
              padding: '7px 42px 7px 34px',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              fontSize: '12.5px',
              background: '#f8f9f8',
              outline: 'none',
            }}
          />
          <kbd style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '10px',
            background: 'var(--white)',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            padding: '1px 5px',
            color: 'var(--secondary)'
          }}>⌘K</kbd>
        </div>
      )}

      <div className="topbar-right">
        <div className="topbar-user">
          <div className="topbar-avatar" style={{ background: '#0e2b20', color: '#fff' }}>{initials}</div>
          <div>
            <div className="topbar-username">{user?.name}</div>
            <div className="topbar-role">{user?.role}</div>
          </div>
          <ChevronDown size={14} color="var(--secondary)" style={{ marginLeft: 2 }} />
        </div>
      </div>
    </header>
  );
}

export default Topbar;
