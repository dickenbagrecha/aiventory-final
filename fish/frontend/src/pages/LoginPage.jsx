import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Anchor, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // For demo purposes, just navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-dark)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Ambience */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03), rgba(0,0,0,0.2))',
        pointerEvents: 'none'
      }} />

      <Link to="/" style={{
        position: 'absolute',
        top: '2rem',
        left: '2rem',
        color: 'var(--bg-light)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontWeight: 500
      }}>
        <ArrowLeft size={20} /> Back to Home
      </Link>

      <div style={{
        background: 'var(--bg-light)',
        padding: '3rem',
        borderRadius: 'var(--radius)',
        width: '100%',
        maxWidth: '420px',
        boxShadow: 'var(--shadow-md)',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            padding: '1rem',
            background: 'rgba(107, 63, 57, 0.1)',
            borderRadius: '50%',
            marginBottom: '1rem',
            color: 'var(--accent)'
          }}>
            <Anchor size={32} />
          </div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Welcome Back</h1>
          <p style={{ color: 'var(--muted)' }}>Sign in to Marine Fishery Dashboard</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--bg-dark)' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="captain@marinefishery.com"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #dcdcdc',
                background: '#fff',
                fontSize: '1rem'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--bg-dark)' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #dcdcdc',
                background: '#fff',
                fontSize: '1rem'
              }}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            Sign In
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--muted)' }}>
          Don't have an account? <span style={{ color: 'var(--accent)', fontWeight: 600, cursor: 'pointer' }}>Request Access</span>
        </div>
      </div>
    </div>
  );
}
