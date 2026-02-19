import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { getAllNotifications, createNotification } from "../api/notificationsApi.js";
import "../styles/logs.css";

// --- Styles (Alventory / Marine Fishery Theme) ---
const pageContainerStyle = {
    padding: "0",
    minHeight: "calc(100vh - 64px)",
    background: "transparent",
    fontFamily: "'Inter', sans-serif"
};

const contentWrapperStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "2rem",
    alignItems: "start"
};

const headerStyle = {
    marginBottom: "2rem",
    maxWidth: "1200px",
    margin: "0 auto 2rem auto"
};

const titleStyle = {
    fontSize: "1.8rem",
    fontWeight: "700",
    color: "#3E2723",
    marginBottom: "0.5rem"
};

const subtitleStyle = {
    color: "#8D6E63",
    fontSize: "0.95rem"
};

const cardStyle = {
    background: "#FFFFFF",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    padding: "2rem",
    border: "1px solid #EFEBE9"
};

const sectionTitleStyle = {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#3E2723",
    marginBottom: "1.5rem"
};

const labelStyle = {
    display: "block",
    fontWeight: "500",
    color: "#4E342E",
    marginBottom: "0.5rem",
    fontSize: "0.9rem"
};

const inputStyle = {
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    border: "1px solid #E0E0E0",
    background: "#F5F5F5",
    color: "#333",
    fontSize: "0.95rem",
    outline: "none",
    transition: "all 0.2s ease"
};

const buttonStyle = {
    width: "100%",
    padding: "0.85rem",
    background: "#5D4037",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "1rem",
    transition: "background 0.2s"
};

const listContainerStyle = {
    ...cardStyle,
    maxHeight: "600px",
    overflowY: "auto"
};

const listItemStyle = {
    padding: "1rem",
    borderBottom: "1px solid #EEE",
    marginBottom: "0.5rem"
};

function formatDateTime(dateString) {
    if (!dateString) return "N/A";
    try {
        return new Date(dateString).toLocaleString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return "Invalid date";
    }
}

export default function NotificationsPage() {
    const { token } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Form state
    const [form, setForm] = useState({
        phone_number: "",
        message_type: "",
        message_body: "",
        status: "sent",
    });

    useEffect(() => {
        loadNotifications();
    }, []);

    async function loadNotifications() {
        setLoading(true);
        setError("");
        try {
            const data = await getAllNotifications(token);
            setNotifications(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setError("Failed to load notifications.");
        } finally {
            setLoading(false);
        }
    }

    async function handleCreate(e) {
        e.preventDefault();
        try {
            await createNotification(form, token);
            setForm({
                phone_number: "",
                message_type: "",
                message_body: "",
                status: "sent",
            });
            loadNotifications();
        } catch (err) {
            console.error(err);
            alert("Failed to create notification");
        }
    }

    return (
        <div className="logs-page" style={pageContainerStyle}>
            {/* Header */}
            <div style={headerStyle}>
                <h2 style={titleStyle}>Notifications Center</h2>
                <p style={subtitleStyle}>Send alerts and comprehensive message logs</p>
            </div>

            <div style={contentWrapperStyle}>
                {/* LEFT COLUMN: Send Notification Form */}
                <div style={cardStyle}>
                    <h3 style={sectionTitleStyle}>Send New Notification</h3>
                    <form onSubmit={handleCreate}>
                        <div style={{ marginBottom: "1.25rem" }}>
                            <label style={labelStyle}>Phone Number *</label>
                            <input
                                style={inputStyle}
                                required
                                value={form.phone_number}
                                onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                                placeholder="+1 234 567 8900"
                            />
                        </div>

                        <div style={{ marginBottom: "1.25rem" }}>
                            <label style={labelStyle}>Message Type *</label>
                            <input
                                style={inputStyle}
                                required
                                value={form.message_type}
                                onChange={(e) => setForm({ ...form, message_type: e.target.value })}
                                placeholder="e.g. Alert, Reminder, Info"
                            />
                        </div>

                        <div style={{ marginBottom: "1.25rem" }}>
                            <label style={labelStyle}>Message Body *</label>
                            <textarea
                                style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }}
                                required
                                value={form.message_body}
                                onChange={(e) => setForm({ ...form, message_body: e.target.value })}
                                placeholder="Type your message here..."
                            />
                        </div>

                        <div style={{ marginBottom: "1.5rem" }}>
                            <label style={labelStyle}>Status *</label>
                            <select
                                style={inputStyle}
                                value={form.status}
                                onChange={(e) => setForm({ ...form, status: e.target.value })}
                            >
                                <option value="sent">Sent</option>
                                <option value="failed">Failed</option>
                                <option value="pending">Pending</option>
                            </select>
                        </div>

                        <button type="submit" style={buttonStyle}>
                            Send Notification
                        </button>
                    </form>
                </div>

                {/* RIGHT COLUMN: Notification History List */}
                <div style={listContainerStyle}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                        <h3 style={{ ...sectionTitleStyle, marginBottom: 0 }}>Recent Activity</h3>
                        <button
                            onClick={loadNotifications}
                            style={{
                                background: "transparent",
                                border: "1px solid #D7CCC8",
                                padding: "0.4rem 0.8rem",
                                borderRadius: "6px",
                                color: "#5D4037",
                                cursor: "pointer",
                                fontSize: "0.85rem"
                            }}
                        >
                            Refresh
                        </button>
                    </div>

                    {loading && <p style={{ color: "#666", textAlign: "center" }}>Loading history...</p>}
                    {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

                    {!loading && notifications.length === 0 && (
                        <p style={{ color: "#999", textAlign: "center", padding: "2rem" }}>No notifications found.</p>
                    )}

                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {notifications.map((notif) => (
                            <div key={notif.id || Math.random()} style={listItemStyle}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                                    <span style={{ fontWeight: "600", color: "#3E2723" }}>{notif.message_type}</span>
                                    <span style={{ fontSize: "0.8rem", color: "#999" }}>{formatDateTime(notif.created_at)}</span>
                                </div>
                                <p style={{ fontSize: "0.9rem", color: "#555", margin: "0.25rem 0" }}>
                                    {notif.message_body}
                                </p>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
                                    <span style={{ fontSize: "0.8rem", color: "#795548" }}>To: {notif.phone_number}</span>
                                    <span style={{
                                        fontSize: "0.75rem",
                                        padding: "2px 8px",
                                        borderRadius: "12px",
                                        background: notif.status === 'failed' ? '#FFEBEE' : '#E8F5E9',
                                        color: notif.status === 'failed' ? '#C62828' : '#2E7D32',
                                        fontWeight: "600",
                                        textTransform: "capitalize"
                                    }}>
                                        {notif.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
