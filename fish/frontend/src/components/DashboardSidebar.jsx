import { Link, useLocation } from "react-router-dom";
import {
    Home,
    Bot,
    Package,
    Layers,
    ClipboardList,
    BarChart2,
    Warehouse,
    CreditCard,
    Move,
    Activity,
    Anchor
} from "lucide-react";

export default function DashboardSidebar() {
    const location = useLocation();
    const path = location.pathname;

    const menuItems = [
        { name: 'Home', icon: Home, path: '/dashboard' },
        { name: 'AI Agent', icon: Bot, path: '/chat' },
        { name: 'Vessels', icon: Anchor, path: '/dashboard/vessels' }, // Mapped from Product
        { name: 'Species', icon: Layers, path: '/dashboard/species' }, // Mapped from Category
        { name: 'Catch', icon: ClipboardList, path: '/dashboard/catch' }, // Mapped from Inventory
        { name: 'Analytics', icon: BarChart2, path: '/dashboard/analytics' },
        { name: 'Storage', icon: Warehouse, path: '/dashboard/storage' },
        { name: 'Auctions', icon: CreditCard, path: '/dashboard/auctions' }, // Mapped from Billing
        { name: 'Notifs', icon: Move, path: '/dashboard/notifications' }, // Mapped from Movement
    ];

    return (
        <aside style={{
            width: '260px',
            background: '#F3EFE0', // Beige sidebar
            height: '100vh',
            padding: '2rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            borderRight: '1px solid rgba(0,0,0,0.05)',
            position: 'fixed',
            left: 0,
            top: 0
        }}>
            {/* Brand */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '3rem', paddingLeft: '0.5rem', textDecoration: 'none' }}>
                <div style={{
                    width: '32px',
                    height: '32px',
                    background: '#3E2723',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Anchor size={18} color="#F5EFE6" />
                </div>
                <span style={{
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: '#3E2723',
                    fontFamily: "'Poppins', sans-serif"
                }}>Marine Fishery</span>
            </Link>

            {/* Main Menu Label */}
            <div style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: '#8D6E63',
                marginBottom: '1rem',
                paddingLeft: '1rem',
                fontWeight: 600
            }}>Main Menu</div>

            {/* Menu Items */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                {menuItems.map((item) => {
                    const isActive = path === item.path;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 16px',
                                borderRadius: '12px',
                                textDecoration: 'none',
                                color: isActive ? '#3E2723' : '#6D4C41',
                                background: isActive ? '#FFFFFF' : 'transparent',
                                boxShadow: isActive ? '0 2px 5px rgba(0,0,0,0.05)' : 'none',
                                fontWeight: isActive ? 600 : 500,
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Badge */}
            <div style={{
                marginTop: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                borderTop: '1px solid rgba(0,0,0,0.05)'
            }}>
                <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#3E2723'
                }}>EP</div>
                <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#3E2723' }}>Enterprise</div>
                    <div style={{ fontSize: '0.75rem', color: '#8D6E63' }}>v2.4.0 • Online</div>
                </div>
            </div>
        </aside>
    );
}
