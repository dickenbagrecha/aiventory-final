import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Anchor,
  Database,
  Brain,
  Smartphone,
  Activity,
  Thermometer,
  TrendingUp,
  ShieldCheck,
  Server,
  Cpu,
  Code
} from "lucide-react";

export default function LandingPage() {
  const [activeArch, setActiveArch] = useState(null);

  // Architecture Data
  const architectureSteps = [
    {
      id: 'source',
      title: 'Data Sources',
      icon: Activity,
      details: 'Vessels (GPS), Sensors (IoT), Auction Feeds',
      stack: 'MQTT, WebSocket, REST'
    },
    {
      id: 'api',
      title: 'API Layer',
      icon: Server,
      details: 'REST API, Auth, Webhooks',
      stack: 'Node.js, Express, JWT'
    },
    {
      id: 'ai',
      title: 'AI Engine',
      icon: Brain,
      details: 'Spoilage Prediction, Price Forecasting',
      stack: 'Python, Scikit-learn, TensorFlow'
    },
    {
      id: 'db',
      title: 'Database',
      icon: Database,
      details: 'Transactions & Timeseries Data',
      stack: 'PostgreSQL, TimescaleDB'
    },
    {
      id: 'ui',
      title: 'Dashboard',
      icon: Smartphone,
      details: 'Real-time React UI',
      stack: 'React, Vite, Recharts'
    }
  ];

  return (
    <div className="landing-page" style={{ overflowX: 'hidden' }}>

      {/* --- HERO SECTION --- */}
      <section className="hero-section" style={{
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        padding: '6rem 2rem',
        background: 'radial-gradient(circle at 60% 40%, rgba(63, 35, 31, 1), #1C1715)', // Deep brown to black
        color: 'var(--text-on-dark)',
        position: 'relative'
      }}>
        {/* Subtle patterned overlay */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'radial-gradient(#6b3f39 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          opacity: 0.05,
          pointerEvents: 'none'
        }}></div>

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '800px' }}>
            {/* Status Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              background: 'rgba(232, 220, 203, 0.1)',
              borderRadius: '20px',
              border: '1px solid rgba(232, 220, 203, 0.2)',
              marginBottom: '2rem',
              color: '#d6c5b4',
              fontSize: '0.9rem',
              fontWeight: 500
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6D7A5E' }}></span>
              v2.4.0 is now live
            </div>

            {/* Headline */}
            <h1 style={{
              fontSize: 'clamp(3rem, 5vw, 4.5rem)',
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              color: '#fff', // Pure white for contrast
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.02em'
            }}>
              Inventory Management <br /> <span style={{ color: '#E8DCCB' }}>Reimagined with AI.</span>
            </h1>

            {/* Subtext */}
            <p style={{
              fontSize: '1.25rem',
              lineHeight: 1.6,
              maxWidth: '600px',
              color: '#e0d2c2',
              marginBottom: '3rem'
            }}>
              Stop guessing. Start knowing. Marine Fishery uses advanced machine learning to predict demand, optimize stock levels, and automate your logistics.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/dashboard" className="btn btn-primary" style={{
                padding: '16px 32px',
                fontSize: '1.1rem',
                backgroundColor: '#f6efe6',
                color: '#3f231f'
              }}>
                Enter Dashboard
              </Link>
              <Link to="/login" className="btn btn-primary" style={{
                padding: '16px 32px',
                fontSize: '1.1rem',
                backgroundColor: '#f6efe6',
                color: '#3f231f'
              }}>
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- PROBLEMS SECTION --- */}
      <section className="section" style={{ background: 'var(--bg-light)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>The Challenge</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--muted)' }}>Modern fisheries face complex logistical hurdles.</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {[
              { icon: Thermometer, title: "Spoilage Risk", desc: "lack of real-time cold chain monitoring leads to 30% loss." },
              { icon: TrendingUp, title: "Price Volatility", desc: "Unpredictable auction prices reduce fishermen's profits." },
              { icon: Activity, title: "Operational Blindspots", desc: "No central view of vessel location or catch quality." }
            ].map((card, i) => (
              <div key={i} style={{
                background: '#fff',
                padding: '2.5rem',
                borderRadius: 'var(--radius)',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid rgba(0,0,0,0.03)'
              }}>
                <div style={{
                  width: '50px', height: '50px',
                  background: 'var(--bg-light)',
                  borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '1.5rem',
                  color: 'var(--accent)'
                }}>
                  <card.icon size={24} />
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{card.title}</h3>
                <p style={{ color: 'var(--muted)', lineHeight: 1.6 }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SYSTEM ARCHITECTURE --- */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <div style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>System Architecture</h2>
            <p style={{ color: 'var(--muted)' }}>End-to-end data pipeline flow. Click components for details.</p>
          </div>

          {/* Flow Diagram */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            padding: '2rem 0',
            position: 'relative',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            {architectureSteps.map((step, i) => (
              <div key={step.id} style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  onClick={() => setActiveArch(activeArch === step.id ? null : step.id)}
                  style={{
                    background: activeArch === step.id ? 'var(--accent)' : 'var(--bg-light)',
                    color: activeArch === step.id ? '#fff' : 'var(--bg-dark)',
                    padding: '2rem',
                    borderRadius: '16px',
                    width: '160px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(0,0,0,0.05)',
                    position: 'relative',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}><step.icon size={32} /></div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'inherit' }}>{step.title}</h4>

                  {/* Modal / Tooltip */}
                  {activeArch === step.id && (
                    <div style={{
                      position: 'absolute',
                      top: '110%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '260px',
                      background: '#fff',
                      padding: '1.5rem',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                      zIndex: 10,
                      border: '1px solid var(--card)',
                      textAlign: 'left'
                    }}>
                      <p style={{ fontSize: '0.9rem', color: '#1C1715', marginBottom: '0.5rem', fontWeight: 600 }}>{step.details}</p>
                      <div style={{ fontSize: '0.8rem', color: 'var(--muted)', background: 'var(--bg-light)', padding: '0.5rem', borderRadius: '6px' }}>
                        Stack: {step.stack}
                      </div>
                    </div>
                  )}
                </div>

                {/* Arrow Connector */}
                {i < architectureSteps.length - 1 && (
                  <div style={{ margin: '0 0.5rem', color: '#e0e0e0' }}>
                    <ArrowRight size={24} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FEATURES & METRICS --- */}
      <section className="section" style={{ background: 'var(--bg-dark)', color: 'var(--bg-light)' }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center' }}>

          <div style={{ flex: 1, minWidth: '300px' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: '#FFFFFF' }}>Impact Metrics</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--success)' }}>30%</div>
                <p style={{ opacity: 1, fontWeight: 500, color: '#FFFFFF' }}>Spoilage Reduction</p>
              </div>
              <div>
                <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--warning)' }}>2x</div>
                <p style={{ opacity: 1, fontWeight: 500, color: '#FFFFFF' }}>Faster Auctions</p>
              </div>
              <div>
                <div style={{ fontSize: '3rem', fontWeight: 700, color: '#fff' }}>24/7</div>
                <p style={{ opacity: 1, fontWeight: 500, color: '#FFFFFF' }}>AI Monitoring</p>
              </div>
              <div>
                <div style={{ fontSize: '3rem', fontWeight: 700, color: '#ffffff' }}>100%</div>
                <p style={{ opacity: 1, fontWeight: 500, color: '#FFFFFF' }}>Digital Logs</p>
              </div>
            </div>
            <p style={{ marginTop: '2rem', fontSize: '0.8rem', opacity: 0.8, color: '#BDBDBD' }}>* Based on pilot data simulations.</p>
          </div>

          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              padding: '3rem',
              borderRadius: '24px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <h3 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#fff' }}>Built for Modern Markets</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', color: '#FFFFFF' }}>
                {[
                  "Automated Catch Logging",
                  "AI Price Forecasting",
                  "Cold Storage Integration",
                  "SMS Notifications"
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.1rem' }}>
                    <ShieldCheck size={20} color="#6D7A5E" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/features" style={{ display: 'inline-flex', marginTop: '2rem', alignItems: 'center', gap: '0.5rem', color: '#FFFFFF', fontWeight: 600 }}>
                Explore Features <ArrowRight size={18} />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* --- TECH STACK --- */}
      <section className="section" style={{ background: '#fff', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: '2rem', marginBottom: '3rem', color: 'var(--bg-dark)' }}>Powered By</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap', color: 'var(--bg-dark)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <Code size={40} color="var(--bg-dark)" />
              <span style={{ fontWeight: 600 }}>React + Vite</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <Server size={40} color="var(--bg-dark)" />
              <span style={{ fontWeight: 600 }}>Node.js</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <Brain size={40} color="var(--bg-dark)" />
              <span style={{ fontWeight: 600 }}>Python AI</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <Database size={40} color="var(--bg-dark)" />
              <span style={{ fontWeight: 600 }}>PostgreSQL</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer style={{ background: '#111', color: '#888', padding: '4rem 0 2rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem', marginBottom: '4rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#fff' }}>
                <Anchor size={24} />
                <span style={{ fontWeight: 700, fontSize: '1.25rem' }}>Marine Fishery</span>
              </div>
              <p style={{ maxWidth: '300px' }}>Empowering coastal fisheries with next-gen operations intelligence.</p>
            </div>

            <div style={{ display: 'flex', gap: '4rem' }}>
              <div>
                <h5 style={{ color: '#fff', marginBottom: '1rem' }}>Platform</h5>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <li><Link to="/dashboard">Dashboard</Link></li>
                  <li><Link to="/features">Features</Link></li>
                  <li><Link to="/api-docs">API Docs</Link></li>
                </ul>
              </div>
              <div>
                <h5 style={{ color: '#fff', marginBottom: '1rem' }}>Legal</h5>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <li><Link to="/privacy">Privacy Policy</Link></li>
                  <li><Link to="/terms">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #222', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p>&copy; 2026 Marine Fishery. All rights reserved.</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {/* Social placeholders */}
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
