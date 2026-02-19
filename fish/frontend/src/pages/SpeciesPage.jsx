import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { getAllSpecies, createSpecies } from "../api/speciesApi.js";
import "../styles/logs.css";

export default function SpeciesPage() {
    const { token } = useAuth();
    const [species, setSpecies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        name: "",
        category: "",
        avg_shelf_life_hours: "",
        ideal_temp_min: "",
        ideal_temp_max: "",
    });

    useEffect(() => {
        loadSpecies();
    }, []);

    async function loadSpecies() {
        setLoading(true);
        setError("");
        try {
            const data = await getAllSpecies(token);
            setSpecies(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setError("Failed to load species.");
        } finally {
            setLoading(false);
        }
    }

    async function handleCreate(e) {
        e.preventDefault();
        try {
            await createSpecies(
                {
                    ...form,
                    avg_shelf_life_hours: parseInt(form.avg_shelf_life_hours),
                    ideal_temp_min: parseFloat(form.ideal_temp_min),
                    ideal_temp_max: parseFloat(form.ideal_temp_max),
                },
                token
            );
            setShowForm(false);
            setForm({
                name: "",
                category: "",
                avg_shelf_life_hours: "",
                ideal_temp_min: "",
                ideal_temp_max: "",
            });
            loadSpecies();
        } catch (err) {
            console.error(err);
            alert("Failed to create species");
        }
    }

    return (
        <div className="logs-page" style={{ padding: "0" }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: "2rem" }}>
                    <h2 style={{ fontSize: "1.8rem", fontWeight: 700, color: "#3E2723", marginBottom: "0.5rem" }}>
                        Species Management
                    </h2>
                    <p style={{ color: "#8D6E63" }}>
                        Configure fish species, retention policies, and storage parameters
                    </p>
                </div>

                {/* Create Species Form Card */}
                <div style={{
                    background: "#fff",
                    borderRadius: "16px",
                    padding: "2rem",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
                    border: "1px solid rgba(0,0,0,0.05)",
                    marginBottom: "3rem"
                }}>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#4B2E2B", marginBottom: "1.5rem" }}>
                        Add New Species
                    </h3>

                    <form onSubmit={handleCreate}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label style={{ fontWeight: 600, color: "#5D4037", marginBottom: "8px", display: "block" }}>
                                    Name <span style={{ color: "#D32F2F" }}>*</span>
                                </label>
                                <input
                                    required
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="e.g. Atlantic Cod"
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
                                    Category <span style={{ color: "#D32F2F" }}>*</span>
                                </label>
                                <input
                                    required
                                    value={form.category}
                                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                                    placeholder="e.g. Demersal"
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
                                    Avg Shelf Life (hours) <span style={{ color: "#D32F2F" }}>*</span>
                                </label>
                                <input
                                    type="number"
                                    required
                                    value={form.avg_shelf_life_hours}
                                    onChange={(e) => setForm({ ...form, avg_shelf_life_hours: e.target.value })}
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
                                    Ideal Temp Min (°C) <span style={{ color: "#D32F2F" }}>*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    required
                                    value={form.ideal_temp_min}
                                    onChange={(e) => setForm({ ...form, ideal_temp_min: e.target.value })}
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
                                    Ideal Temp Max (°C) <span style={{ color: "#D32F2F" }}>*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    required
                                    value={form.ideal_temp_max}
                                    onChange={(e) => setForm({ ...form, ideal_temp_max: e.target.value })}
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
                                <i className="fa-solid fa-check" style={{ marginRight: '8px' }} /> Create Species
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
                            <strong>Note:</strong> Temperature ranges are critical for spoliage analysis. Ensure these are accurate to industry standards.
                        </p>
                    </div>
                </div>

                {/* List Section */}
                <div style={{ marginBottom: "1rem" }}>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#4B2E2B" }}>Species Database</h3>
                </div>

                {loading && <p>Loading...</p>}
                {error && <p className="error-text">{error}</p>}

                <div className="log-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {species.length === 0 ? (
                        <p>No species found. Add one!</p>
                    ) : (
                        species.map((sp) => (
                            <div key={sp.id} className="log-card" style={{
                                background: "#fff",
                                padding: "20px",
                                borderRadius: "12px",
                                border: "1px solid rgba(0,0,0,0.05)",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
                            }}>
                                <div className="log-info">
                                    <h3 style={{ margin: "0 0 10px 0", color: "#3E2723", fontSize: '1.1rem' }}>{sp.name}</h3>
                                    <div style={{ fontSize: "0.9rem", color: "#5D4037", display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <p><strong>Category:</strong> {sp.category}</p>
                                        <p><strong>Shelf Life:</strong> {sp.avg_shelf_life_hours} hours</p>
                                        <p><strong>Ideal Temp:</strong> {sp.ideal_temp_min}°C — {sp.ideal_temp_max}°C</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
