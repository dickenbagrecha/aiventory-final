import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import {
    getAllCatchBatches,
    createCatchBatch,
    updateCatchStatus,
} from "../api/catchApi.js";
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

export default function CatchPage() {
    const { token } = useAuth();
    const [catchBatches, setCatchBatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        vessel_id: "",
        species_id: "",
        catch_weight_kg: "",
        catch_time: "",
        landing_port: "",
        ice_applied_time: "",
        quality_grade: "",
        current_status: "stored",
    });

    useEffect(() => {
        loadCatchBatches();
    }, [filter]);

    async function loadCatchBatches() {
        setLoading(true);
        setError("");
        try {
            const data = await getAllCatchBatches(token, filter || null);
            setCatchBatches(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setError("Failed to load catch batches.");
        } finally {
            setLoading(false);
        }
    }

    async function handleCreate(e) {
        e.preventDefault();
        try {
            await createCatchBatch(
                {
                    vessel_id: form.vessel_id,
                    species_id: form.species_id,
                    catch_weight_kg: parseFloat(form.catch_weight_kg),
                    catch_time: new Date(form.catch_time).toISOString(),
                    landing_port: form.landing_port,
                    ice_applied_time: form.ice_applied_time
                        ? new Date(form.ice_applied_time).toISOString()
                        : null,
                    quality_grade: form.quality_grade || null,
                    current_status: form.current_status,
                },
                token
            );
            setShowForm(false);
            setForm({
                vessel_id: "",
                species_id: "",
                catch_weight_kg: "",
                catch_time: "",
                landing_port: "",
                ice_applied_time: "",
                quality_grade: "",
                current_status: "stored",
            });
            loadCatchBatches();
        } catch (err) {
            console.error(err);
            alert("Failed to create catch batch");
        }
    }

    async function handleUpdateStatus(batchId, newStatus) {
        try {
            await updateCatchStatus(batchId, newStatus, token);
            loadCatchBatches();
        } catch (err) {
            console.error(err);
            alert("Failed to update status");
        }
    }

    return (
        <div className="logs-page" style={{ padding: "0" }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: "2rem" }}>
                    <h2 style={{ fontSize: "1.8rem", fontWeight: 700, color: "#3E2723", marginBottom: "0.5rem" }}>
                        Catch Batches
                    </h2>
                    <p style={{ color: "#8D6E63" }}>
                        Log new catches, monitor status, and track quality
                    </p>
                </div>

                {/* Main Form Card */}
                <div style={{
                    background: "#fff",
                    borderRadius: "16px",
                    padding: "2rem",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
                    border: "1px solid rgba(0,0,0,0.05)",
                    marginBottom: "3rem"
                }}>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#4B2E2B", marginBottom: "1.5rem" }}>
                        Log New Catch Batch
                    </h3>

                    <form onSubmit={handleCreate}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) minmax(250px, 1fr)', gap: '20px' }}>
                            <div className="form-group">
                                <label style={{ fontWeight: 600, color: "#5D4037", marginBottom: "8px", display: "block" }}>
                                    Vessel ID <span style={{ color: "#D32F2F" }}>*</span>
                                </label>
                                <input
                                    required
                                    value={form.vessel_id}
                                    onChange={(e) => setForm({ ...form, vessel_id: e.target.value })}
                                    placeholder="UUID of vessel"
                                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #EAEAEA", outline: "none", background: "#FAFAFA" }}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ fontWeight: 600, color: "#5D4037", marginBottom: "8px", display: "block" }}>
                                    Species ID <span style={{ color: "#D32F2F" }}>*</span>
                                </label>
                                <input
                                    required
                                    value={form.species_id}
                                    onChange={(e) => setForm({ ...form, species_id: e.target.value })}
                                    placeholder="UUID of species"
                                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #EAEAEA", outline: "none", background: "#FAFAFA" }}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ fontWeight: 600, color: "#5D4037", marginBottom: "8px", display: "block" }}>
                                    Catch Weight (kg) <span style={{ color: "#D32F2F" }}>*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    required
                                    value={form.catch_weight_kg}
                                    onChange={(e) => setForm({ ...form, catch_weight_kg: e.target.value })}
                                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #EAEAEA", outline: "none", background: "#FAFAFA" }}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ fontWeight: 600, color: "#5D4037", marginBottom: "8px", display: "block" }}>
                                    Catch Time <span style={{ color: "#D32F2F" }}>*</span>
                                </label>
                                <input
                                    type="datetime-local"
                                    required
                                    value={form.catch_time}
                                    onChange={(e) => setForm({ ...form, catch_time: e.target.value })}
                                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #EAEAEA", outline: "none", background: "#FAFAFA" }}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ fontWeight: 600, color: "#5D4037", marginBottom: "8px", display: "block" }}>
                                    Landing Port <span style={{ color: "#D32F2F" }}>*</span>
                                </label>
                                <input
                                    required
                                    value={form.landing_port}
                                    onChange={(e) => setForm({ ...form, landing_port: e.target.value })}
                                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #EAEAEA", outline: "none", background: "#FAFAFA" }}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ fontWeight: 600, color: "#5D4037", marginBottom: "8px", display: "block" }}>
                                    Ice Applied Time
                                </label>
                                <input
                                    type="datetime-local"
                                    value={form.ice_applied_time}
                                    onChange={(e) => setForm({ ...form, ice_applied_time: e.target.value })}
                                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #EAEAEA", outline: "none", background: "#FAFAFA" }}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ fontWeight: 600, color: "#5D4037", marginBottom: "8px", display: "block" }}>
                                    Quality Grade
                                </label>
                                <input
                                    value={form.quality_grade}
                                    onChange={(e) => setForm({ ...form, quality_grade: e.target.value })}
                                    placeholder="e.g. A, B, C"
                                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #EAEAEA", outline: "none", background: "#FAFAFA" }}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ fontWeight: 600, color: "#5D4037", marginBottom: "8px", display: "block" }}>
                                    Current Status <span style={{ color: "#D32F2F" }}>*</span>
                                </label>
                                <select
                                    value={form.current_status}
                                    onChange={(e) => setForm({ ...form, current_status: e.target.value })}
                                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #EAEAEA", outline: "none", background: "#FAFAFA", backgroundSize: '16px' }}
                                >
                                    <option value="stored">Stored</option>
                                    <option value="auctioned">Auctioned</option>
                                    <option value="transported">Transported</option>
                                    <option value="spoiled">Spoiled</option>
                                </select>
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
                                <i className="fa-solid fa-fish-fins" style={{ marginRight: '8px' }} /> Record Catch
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
                            <strong>Tip:</strong> Recording the exact time ice was applied improves the accuracy of ML spoilage predictions.
                        </p>
                    </div>
                </div>

                {/* Filter Section */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#4B2E2B" }}>Recent Batches</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '0.9rem', color: '#666' }}>Filter:</span>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #ddd", background: "#fff", fontSize: "0.9rem" }}
                        >
                            <option value="">All Statuses</option>
                            <option value="stored">Stored</option>
                            <option value="auctioned">Auctioned</option>
                            <option value="transported">Transported</option>
                            <option value="spoiled">Spoiled</option>
                        </select>
                    </div>
                </div>

                {loading && <p>Loading...</p>}
                {error && <p className="error-text">{error}</p>}

                <div className="log-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {catchBatches.length === 0 ? (
                        <p style={{ color: "#888" }}>No catch batches found.</p>
                    ) : (
                        catchBatches.map((batch) => (
                            <div key={batch.id} className="log-card" style={{
                                background: "#fff",
                                padding: "20px",
                                borderRadius: "12px",
                                border: "1px solid rgba(0,0,0,0.05)",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
                            }}>
                                <div className="log-info">
                                    <h3 style={{ margin: "0 0 10px 0", color: "#3E2723", fontSize: '1.1rem' }}>Batch #{String(batch.id).slice(0, 6)}</h3>
                                    <div style={{ fontSize: "0.9rem", color: "#5D4037", display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <p><strong>Weight:</strong> {batch.catch_weight_kg} kg</p>
                                        <p><strong>Port:</strong> {batch.landing_port}</p>
                                        <p><strong>Time:</strong> {formatDateTime(batch.catch_time)}</p>
                                        <div style={{ marginTop: '5px' }}>
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                background: batch.current_status === 'spoiled' ? '#FFEBEE' : '#E8F5E9',
                                                color: batch.current_status === 'spoiled' ? '#C62828' : '#2E7D32',
                                                fontWeight: 600,
                                                fontSize: '0.8rem',
                                                textTransform: 'uppercase'
                                            }}>
                                                {batch.current_status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="log-actions" style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px solid #eee" }}>
                                    <select
                                        onChange={(e) => handleUpdateStatus(batch.id, e.target.value)}
                                        value={batch.current_status}
                                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}
                                    >
                                        <option value="stored">Stored</option>
                                        <option value="auctioned">Auctioned</option>
                                        <option value="transported">Transported</option>
                                        <option value="spoiled">Spoiled</option>
                                    </select>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
