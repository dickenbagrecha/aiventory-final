import { useState } from "react";
import { useNavigate, useLocation, Link, useSearchParams } from "react-router-dom";
import "../styles/logs.css";
import {
    Anchor,
    Fish,
    Package,
    Gavel,
    Warehouse,
    LineChart,
    Bell,
    Brain,
    ArrowRight,
    LayoutDashboard,
    LogOut
} from "lucide-react";

export default function DashboardPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [agentQuery, setAgentQuery] = useState("");

    const handleAgentSubmit = (e) => {
        e.preventDefault();
        if (agentQuery.trim()) {
            navigate(`/chat?query=${encodeURIComponent(agentQuery)}`);
        }
    };

    const modules = [
        {
            title: "Dashboard",
            description: "Overview of all metrics and active modules",
            icon: LayoutDashboard,
            path: "/dashboard",
        },
        {
            title: "Vessels",
            description: "Manage fishing vessels, registrations, and owner information",
            icon: Anchor,
            path: "/dashboard/vessels",
        },
        {
            title: "Species",
            description: "Track fish species, categories, and storage requirements",
            icon: Fish,
            path: "/dashboard/species",
        },
        {
            title: "Catch Batches",
            description: "Monitor catch batches, weights, and quality grades",
            icon: Package,
            path: "/dashboard/catch",
        },
        {
            title: "Auctions",
            description: "Manage auctions, bids, and pricing strategies",
            icon: Gavel,
            path: "/dashboard/auctions",
        },
        {
            title: "Storage",
            description: "Track storage units, capacity, and temperature logs",
            icon: Warehouse,
            path: "/dashboard/storage",
        },
        {
            title: "Analytics",
            description: "Spoilage prediction and price recommendations",
            icon: LineChart,
            path: "/dashboard/analytics",
        },
        {
            title: "Notifications",
            description: "Send and manage SMS notifications",
            icon: Bell,
            path: "/dashboard/notifications",
        },
        {
            title: "Agent Console",
            description: "Chat with AI agent for intelligent assistance",
            icon: Brain,
            path: "/chat",
        },
    ];

    // Filter out Dashboard item for the Grid view (keep others)
    const searchTerm = searchParams.get("q")?.toLowerCase() || "";

    const gridModules = modules.filter(m => {
        const matchesType = m.path !== "/dashboard";
        const matchesSearch = m.title.toLowerCase().includes(searchTerm) ||
            m.description.toLowerCase().includes(searchTerm);
        return matchesType && matchesSearch;
    });

    return (
        <div style={{ height: '100%' }}>

            {/* Header Removed as per request */}



            {/* Agent Input Capsule */}
            <div
                style={{
                    background: '#4B2E2B',
                    borderRadius: "16px",
                    padding: "24px",
                    marginBottom: "3rem",
                    boxShadow: "0 8px 30px rgba(75, 46, 43, 0.15)",
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Decorative background element */}
                <div style={{
                    position: 'absolute',
                    top: '-50%',
                    right: '-10%',
                    width: '300px',
                    height: '300px',
                    borderRadius: '50%',
                    background: 'rgba(232, 220, 203, 0.05)',
                    pointerEvents: 'none'
                }} />

                <form onSubmit={handleAgentSubmit}>
                    <label
                        htmlFor="agent-query"
                        style={{
                            display: "block",
                            color: "#E8DCCB",
                            fontWeight: "600",
                            marginBottom: "12px",
                            fontSize: "1.1rem",
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <Brain size={20} />
                        Ask the Marine Agent
                    </label>
                    <div style={{ display: "flex", gap: "12px" }}>
                        <input
                            id="agent-query"
                            type="text"
                            value={agentQuery}
                            onChange={(e) => setAgentQuery(e.target.value)}
                            placeholder="e.g., What's the status of my latest catch batch?"
                            style={{
                                flex: 1,
                                padding: "16px 24px",
                                borderRadius: "12px",
                                border: "1px solid #6B3E2E",
                                fontSize: "16px",
                                outline: "none",
                                background: "#2A2422",
                                color: "#F5EFE6",
                                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)"
                            }}
                        />
                        <button
                            type="submit"
                            className="btn"
                            style={{
                                background: "#E8DCCB",
                                color: "#4B2E2B",
                                padding: "0 32px",
                                fontSize: "1rem"
                            }}
                        >
                            Ask
                        </button>
                    </div>
                </form>
            </div>

            {/* Module Cards Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '24px'
            }}>
                {gridModules.map((module) => (
                    <div
                        key={module.path}
                        onClick={() => navigate(module.path)}
                        style={{
                            background: '#fff',
                            borderRadius: '16px',
                            padding: '24px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                            border: '1px solid rgba(0,0,0,0.03)',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            minHeight: '220px',
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)';
                        }}
                    >
                        <div>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                background: '#F5EFE6',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '1.5rem',
                                color: '#4B2E2B'
                            }}>
                                <module.icon size={24} strokeWidth={1.5} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#1C1715' }}>{module.title}</h3>
                            <p style={{ fontSize: '0.9rem', color: '#8B6B64', lineHeight: 1.5, marginBottom: '2rem' }}>
                                {module.description}
                            </p>
                        </div>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            letterSpacing: '1px',
                            color: '#8B6B64',
                            textTransform: 'uppercase'
                        }}>
                            ACCESS MODULE <ArrowRight size={14} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
