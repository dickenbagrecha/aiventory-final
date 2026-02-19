import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { APP_NAME } from "../config/constants.js";
import { Anchor, LogOut } from "lucide-react";

export default function Header() {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  const isActive = (path) =>
    location.pathname === path ? "nav-link active" : "nav-link";

  return (
    <header className="app-header">
      <div className="header-left">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '10px'
        }}>
          <Anchor size={24} color="#F5EFE6" />
        </div>
        <span className="logo-text">{APP_NAME}</span>
      </div>

      <nav className="header-nav">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/features" className="nav-link">Features</Link>
        <Link to="/docs" className="nav-link">Docs</Link>
        <Link to="/contact" className="nav-link">Contact</Link>
      </nav>

      <div className="header-right">
        {isAuthenticated ? (
          <>
            <span style={{ fontSize: "0.9rem", color: "#D6C5B4", marginRight: '1rem' }}>
              Welcome, Captain
            </span>
            <button
              onClick={logout}
              className="btn"
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: '#F5EFE6',
                padding: '8px 16px',
                fontSize: '0.9rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <LogOut size={16} />
              Logout
            </button>
            <Link to="/dashboard" className="btn btn-primary" style={{ textDecoration: 'none', marginLeft: '1rem', padding: '8px 16px', borderRadius: '50px', background: 'var(--accent)', color: 'var(--bg-light)' }}>
              Dashboard
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="btn" style={{ textDecoration: 'none', marginRight: '0.5rem', color: 'var(--text-secondary)' }}>
              Login
            </Link>
            <Link to="/dashboard" className="btn btn-primary" style={{ textDecoration: 'none', padding: '10px 24px', borderRadius: '50px', background: 'var(--accent)', color: 'var(--bg-light)', fontWeight: 600 }}>
              Enter Dashboard
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
