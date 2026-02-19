import { Link } from "react-router-dom";
import { Anchor, ArrowRight } from "lucide-react";

export default function LandingHeader() {
    return (
        <header style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 3rem',
            background: 'transparent', // Transparent on beige
            maxWidth: '1400px',
            margin: '0 auto',
            width: '100%'
        }}>
            {/* Brand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                    width: '36px',
                    height: '36px',
                    background: '#3E2723', // Dark brown
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Anchor size={20} color="#F5EFE6" />
                </div>
                <span style={{
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    color: '#3E2723',
                    fontFamily: "'Poppins', sans-serif"
                }}>Marine Fishery</span>
            </div>

            {/* Nav Links */}
            <nav style={{ display: 'flex', gap: '2.5rem' }}>
                {['Features', 'Solutions', 'Pricing'].map((item) => (
                    <Link
                        key={item}
                        to={`/${item.toLowerCase()}`}
                        style={{
                            color: '#5D4037',
                            fontWeight: 500,
                            fontSize: '1rem',
                            textDecoration: 'none'
                        }}
                    >
                        {item}
                    </Link>
                ))}
            </nav>

            {/* CTA */}
            <Link
                to="/dashboard"
                style={{
                    background: '#3E2723',
                    color: '#fff',
                    padding: '12px 24px',
                    borderRadius: '50px',
                    textDecoration: 'none',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.95rem'
                }}
            >
                Enter Dashboard <ArrowRight size={16} />
            </Link>
        </header>
    );
}
