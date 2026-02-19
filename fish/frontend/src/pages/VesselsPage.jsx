import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { getAllVessels, createVessel, deleteVessel } from "../api/vesselsApi.js";
import "../styles/logs.css";

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

export default function VesselsPage() {
    const { token } = useAuth();
    const [vessels, setVessels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        registration_number: "",
        owner_name: "",
        owner_phone: "",
        vessel_type: "",
        capacity_kg: "",
        home_port: "",
    });

    useEffect(() => {
        loadVessels();
    }, []);

    async function loadVessels() {
        setLoading(true);
        setError("");
        try {
            const data = await getAllVessels(token);
            setVessels(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setError("Failed to load vessels.");
        } finally {
            setLoading(false);
        }
    }

    async function handleCreate(e) {
        e.preventDefault();
        try {
            await createVessel(
                {
                    ...form,
                    capacity_kg: parseInt(form.capacity_kg),
                },
                token
            );
            setShowForm(false);
            setForm({
                registration_number: "",
                owner_name: "",
                owner_phone: "",
                vessel_type: "",
                capacity_kg: "",
                home_port: "",
            });
            loadVessels();
        } catch (err) {
            console.error(err);
            alert("Failed to create vessel");
        }
    }

    async function handleDelete(id) {
        if (!confirm("Delete this vessel?")) return;
        try {
            await deleteVessel(id, token);
            loadVessels();
        } catch (err) {
            console.error(err);
            alert("Failed to delete vessel");
        }
    }

    return (
        <div className="logs-page" style={{ padding: "0" }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

                {/* Header */}
                <div style={{ marginBottom: "2rem" }}>
                    <h2 style={{ fontSize: "1.8rem", fontWeight: 700, color: "#3E2723", marginBottom: "0.5rem" }}>
                        Vessels Management
                    </h2>
                    <p style={{ color: "#8D6E63" }}>
                        Register and manage your fishing fleet
                    </p>
                </div>

                {/* Create Vessel Form Card */}
                <div style={{
                    background: "#fff",
                    borderRadius: "16px",
                    padding: "2rem",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
                    border: "1px solid rgba(0,0,0,0.05)",
                    marginBottom: "3rem"
                }}>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#4B2E2B", marginBottom: "1.5rem" }}>
                        Register New Vessel
                    </h3>

                    <form onSubmit={handleCreate}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="form-group">
                                <label style={{ fontWeight: 600, color: "#5D4037", marginBottom: "8px", display: "block" }}>
                                    Registration Number <span style={{ color: "#D32F2F" }}>*</span>
                                </label>
                                <input
                                    required
                                    value={form.registration_number}
                                    onChange={(e) => setForm({ ...form, registration_number: e.target.value })}
                                    placeholder="Enter registration number"
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        borderRadius: "8px",
                                        border: "1px solid #EAEAEA",
                                        outline: "none",
                                        fontSize: "0.95rem",
                                        color: "#3E2723",
                                        background: "#FAFAFA"
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ fontWeight: 600, color: "#5D4037", marginBottom: "8px", display: "block" }}>
                                    Owner Name <span style={{ color: "#D32F2F" }}>*</span>
                                </label>
                                <input
                                    required
                                    value={form.owner_name}
                                    onChange={(e) => setForm({ ...form, owner_name: e.target.value })}
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        borderRadius: "8px",
                                        border: "1px solid #EAEAEA",
                                        outline: "none",
                                        fontSize: "0.95rem",
                                        color: "#3E2723",
                                        background: "#FAFAFA"
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ fontWeight: 600, color: "#5D4037", marginBottom: "8px", display: "block" }}>
                                    Owner Phone
                                </label>
                                <input
                                    value={form.owner_phone}
                                    onChange={(e) => setForm({ ...form, owner_phone: e.target.value })}
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        borderRadius: "8px",
                                        border: "1px solid #EAEAEA",
                                        outline: "none",
                                        fontSize: "0.95rem",
                                        color: "#3E2723",
                                        background: "#FAFAFA"
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ fontWeight: 600, color: "#5D4037", marginBottom: "8px", display: "block" }}>
                                    Vessel Type <span style={{ color: "#D32F2F" }}>*</span>
                                </label>
                                <input
                                    required
                                    value={form.vessel_type}
                                    onChange={(e) => setForm({ ...form, vessel_type: e.target.value })}
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        borderRadius: "8px",
                                        border: "1px solid #EAEAEA",
                                        outline: "none",
                                        fontSize: "0.95rem",
                                        color: "#3E2723",
                                        background: "#FAFAFA"
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ fontWeight: 600, color: "#5D4037", marginBottom: "8px", display: "block" }}>
                                    Capacity (kg) <span style={{ color: "#D32F2F" }}>*</span>
                                </label>
                                <input
                                    type="number"
                                    required
                                    value={form.capacity_kg}
                                    onChange={(e) => setForm({ ...form, capacity_kg: e.target.value })}
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        borderRadius: "8px",
                                        border: "1px solid #EAEAEA",
                                        outline: "none",
                                        fontSize: "0.95rem",
                                        color: "#3E2723",
                                        background: "#FAFAFA"
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ fontWeight: 600, color: "#5D4037", marginBottom: "8px", display: "block" }}>
                                    Home Port <span style={{ color: "#D32F2F" }}>*</span>
                                </label>
                                <input
                                    required
                                    value={form.home_port}
                                    onChange={(e) => setForm({ ...form, home_port: e.target.value })}
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        borderRadius: "8px",
                                        border: "1px solid #EAEAEA",
                                        outline: "none",
                                        fontSize: "0.95rem",
                                        color: "#3E2723",
                                        background: "#FAFAFA"
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ marginTop: "2rem" }}>
                            <button
                                type="submit"
                                className="btn"
                                style={{
                                    width: "100%",
                                    background: "#6B3E2E",
                                    color: "#fff",
                                    padding: "14px",
                                    borderRadius: "10px",
                                    fontWeight: 600,
                                    fontSize: "1rem",
                                    border: "none",
                                    cursor: "pointer"
                                }}
                            >
                                Create Vessel
                            </button>
                        </div>
                    </form>

                    {/* Note Box */}
                    <div style={{
                        marginTop: "1.5rem",
                        padding: "1rem",
                        background: "#F5F5F5",
                        borderRadius: "8px",
                        border: "1px solid #E0E0E0",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "10px"
                    }}>
                        <div style={{ color: "#8D6E63", marginTop: "2px" }}><i className="fa-regular fa-lightbulb"></i></div>
                        <p style={{ fontSize: "0.85rem", color: "#616161", lineHeight: 1.5, margin: 0 }}>
                            <strong>Note:</strong> Accurately registering vessel capacity helps the AI optimize catch batch allocations and prevent overloading.
                        </p>
                    </div>
                </div>

                {/* List Section */}
                <div style={{ marginBottom: "1rem" }}>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#4B2E2B" }}>Registered Fleet</h3>
                </div>

                {loading && <p>Loading...</p>}
                {error && <p className="error-text">{error}</p>}

                <div className="log-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {vessels.length === 0 ? (
                        <p style={{ color: "#888" }}>No vessels found. Register one above!</p>
                    ) : (
                        vessels.map((vessel) => (
                            <div key={vessel.id} className="log-card" style={{
                                background: "#fff",
                                padding: "20px",
                                borderRadius: "12px",
                                border: "1px solid rgba(0,0,0,0.05)",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
                            }}>
                                <div className="log-info">
                                    <h3 style={{ margin: "0 0 10px 0", color: "#3E2723" }}>{vessel.registration_number}</h3>
                                    <div style={{ fontSize: "0.9rem", color: "#5D4037", display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <p><strong>Owner:</strong> {vessel.owner_name}</p>
                                        <p><strong>Type:</strong> {vessel.vessel_type}</p>
                                        <p><strong>Capacity:</strong> {vessel.capacity_kg} kg</p>
                                        <p><strong>Port:</strong> {vessel.home_port}</p>
                                    </div>
                                </div>
                                <div className="log-actions" style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px solid #eee" }}>
                                    <button
                                        onClick={() => handleDelete(vessel.id)}
                                        style={{
                                            background: "#FFEBEE",
                                            color: "#D32F2F",
                                            border: "none",
                                            padding: "8px 12px",
                                            borderRadius: "6px",
                                            cursor: "pointer",
                                            fontSize: "0.85rem",
                                            fontWeight: 500
                                        }}
                                    >
                                        <i className="fa-solid fa-trash" style={{ marginRight: "6px" }} /> Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
