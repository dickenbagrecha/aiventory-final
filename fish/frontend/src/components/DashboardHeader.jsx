import { Search, Bell, ShieldCheck } from "lucide-react";
import { useSearchParams } from "react-router-dom";

export default function DashboardHeader() {
    const [searchParams, setSearchParams] = useSearchParams();
    return (
        <header style={{
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
            background: '#FBF9F5', // Match page bg
            borderBottom: '1px solid rgba(0,0,0,0.03)'
        }}>
            {/* Search Bar */}
            <div style={{
                flex: 1,
                maxWidth: '600px',
                background: '#fff',
                borderRadius: '12px',
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                border: '1px solid #EAEAEA',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}>
                <Search size={18} color="#8D6E63" />
                <input
                    type="text"
                    placeholder="Ask AI agent or search inventory..."
                    value={searchParams.get("q") || ""}
                    onChange={(e) => {
                        const term = e.target.value;
                        if (term) {
                            setSearchParams({ q: term });
                        } else {
                            setSearchParams({});
                        }
                    }}
                    style={{
                        border: 'none',
                        outline: 'none',
                        width: '100%',
                        fontSize: '0.95rem',
                        color: '#3E2723',
                        background: 'transparent'
                    }}
                />
            </div>

            {/* Right Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                {/* System Secure Badge */}
                <div style={{
                    background: '#EBE5D9', // Muted beige
                    padding: '8px 16px',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#5D4037'
                }}>
                    <ShieldCheck size={16} />
                    System Secure
                </div>

                {/* Notification */}
                <button style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#8D6E63'
                }}>
                    <Bell size={22} />
                </button>

                {/* Profile */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'right' }}>
                    <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#3E2723' }}>Admin User</div>
                        <div style={{ fontSize: '0.75rem', color: '#8D6E63' }}>Fishery Manager</div>
                    </div>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: '#fff',
                        border: '1px solid #3E2723',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 600,
                        color: '#3E2723'
                    }}>
                        AD
                    </div>
                </div>
            </div>
        </header>
    );
}
