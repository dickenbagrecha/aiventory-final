import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import {
    getAllStorageUnits,
    createStorageUnit,
    logTemperature,
    getTemperatureLogs,
} from "../api/storageApi.js";
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

export default function StoragePage() {
    const { token } = useAuth();
    const [storageUnits, setStorageUnits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showStorageForm, setShowStorageForm] = useState(false);
    const [showTempForm, setShowTempForm] = useState(false);
    const [selectedStorageLogs, setSelectedStorageLogs] = useState(null);

    const [storageForm, setStorageForm] = useState({
        location: "",
        max_capacity_kg: "",
        current_load_kg: "",
        current_temp: "",
    });

    const [tempForm, setTempForm] = useState({
        storage_unit_id: "",
        recorded_temp: "",
    });

    useEffect(() => {
        loadStorageUnits();
    }, []);

    async function loadStorageUnits() {
        setLoading(true);
        setError("");
        try {
            const data = await getAllStorageUnits(token);
            setStorageUnits(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setError("Failed to load storage units.");
        } finally {
            setLoading(false);
        }
    }

    async function handleCreateStorage(e) {
        e.preventDefault();
        try {
            await createStorageUnit(
                {
                    location: storageForm.location,
                    max_capacity_kg: parseFloat(storageForm.max_capacity_kg),
                    current_load_kg: parseFloat(storageForm.current_load_kg),
                    current_temp: parseFloat(storageForm.current_temp),
                },
                token
            );
            setShowStorageForm(false);
            setStorageForm({
                location: "",
                max_capacity_kg: "",
                current_load_kg: "",
                current_temp: "",
            });
            loadStorageUnits();
        } catch (err) {
            console.error(err);
            alert("Failed to create storage unit");
        }
    }

    async function handleLogTemp(e) {
        e.preventDefault();
        try {
            await logTemperature(
                {
                    storage_unit_id: tempForm.storage_unit_id,
                    recorded_temp: parseFloat(tempForm.recorded_temp),
                    timestamp: new Date().toISOString(),
                },
                token
            );
            setShowTempForm(false);
            setTempForm({
                storage_unit_id: "",
                recorded_temp: "",
            });
            alert("Temperature logged successfully");
        } catch (err) {
            console.error(err);
            alert("Failed to log temperature");
        }
    }

    async function handleViewTempLogs(storageId) {
        try {
            const logs = await getTemperatureLogs(storageId, token);
            setSelectedStorageLogs({ storageId, logs });
        } catch (err) {
            console.error(err);
            alert("Failed to load temperature logs");
        }
    }

    return (
        <div className="logs-page" style={{ padding: "0" }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: "2rem" }}>
                    <h2 style={{ fontSize: "1.8rem", fontWeight: 700, color: "#3E2723", marginBottom: "0.5rem" }}>
                        Storage Management
                    </h2>
                    <p style={{ color: "#8D6E63" }}>
                        Track storage units, capacity, and temperature logs
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 2fr) minmax(300px, 1fr)', gap: '24px', marginBottom: '3rem' }}>

                    {/* Add Storage Unit Card */}
                    <div style={{
                        background: "#fff",
                        borderRadius: "16px",
                        padding: "2rem",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
                        border: "1px solid rgba(0,0,0,0.05)"
                    }}>
                        <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#4B2E2B", marginBottom: "1.5rem" }}>
                            Add Storage Unit
                        </h3>

                        <form onSubmit={handleCreateStorage}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label style={{ fontWeight: 600, color: "#5D4037", marginBottom: "8px", display: "block" }}>
                                        Location <span style={{ color: "#D32F2F" }}>*</span>
                                    </label>
                                    <input
                                        required
                                        value={storageForm.location}
                                        onChange={(e) => setStorageForm({ ...storageForm, location: e.target.value })}
                                        placeholder="e.g. Warehouse A, Portside"
                                        style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #EAEAEA", outline: "none", background: "#FAFAFA" }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label style={{ fontWeight: 600, color: "#5D4037", marginBottom: "8px", display: "block" }}>
                                        Max Capacity (kg) <span style={{ color: "#D32F2F" }}>*</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        required
                                        value={storageForm.max_capacity_kg}
                                        onChange={(e) => setStorageForm({ ...storageForm, max_capacity_kg: e.target.value })}
                                        style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #EAEAEA", outline: "none", background: "#FAFAFA" }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label style={{ fontWeight: 600, color: "#5D4037", marginBottom: "8px", display: "block" }}>
                                        Current Load (kg) <span style={{ color: "#D32F2F" }}>*</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        required
                                        value={storageForm.current_load_kg}
                                        onChange={(e) => setStorageForm({ ...storageForm, current_load_kg: e.target.value })}
                                        style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #EAEAEA", outline: "none", background: "#FAFAFA" }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label style={{ fontWeight: 600, color: "#5D4037", marginBottom: "8px", display: "block" }}>
                                        Current Temp (°C) <span style={{ color: "#D32F2F" }}>*</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        required
                                        value={storageForm.current_temp}
                                        onChange={(e) => setStorageForm({ ...storageForm, current_temp: e.target.value })}
                                        style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #EAEAEA", outline: "none", background: "#FAFAFA" }}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="btn"
                                style={{
                                    width: "100%",
                                    marginTop: "20px",
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
                                Create Unit
                            </button>
                        </form>
                    </div>

                    {/* Log Temperature Card */}
                    <div style={{
                        background: "#FBF9F5",
                        borderRadius: "16px",
                        padding: "2rem",
                        border: "1px solid rgba(0,0,0,0.05)"
                    }}>
                        <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#4B2E2B", marginBottom: "1.5rem" }}>
                            Quick Log: Temperature
                        </h3>
                        <form onSubmit={handleLogTemp}>
                            <div className="form-group" style={{ marginBottom: "15px" }}>
                                <label style={{ fontWeight: 600, color: "#5D4037", marginBottom: "8px", display: "block" }}>
                                    Storage Unit ID <span style={{ color: "#D32F2F" }}>*</span>
                                </label>
                                <input
                                    required
                                    value={tempForm.storage_unit_id}
                                    onChange={(e) => setTempForm({ ...tempForm, storage_unit_id: e.target.value })}
                                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #EAEAEA", outline: "none", background: "#fff" }}
                                    placeholder="UUID..."
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: "20px" }}>
                                <label style={{ fontWeight: 600, color: "#5D4037", marginBottom: "8px", display: "block" }}>
                                    Recorded Temp (°C) <span style={{ color: "#D32F2F" }}>*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    required
                                    value={tempForm.recorded_temp}
                                    onChange={(e) => setTempForm({ ...tempForm, recorded_temp: e.target.value })}
                                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #EAEAEA", outline: "none", background: "#fff" }}
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn"
                                style={{
                                    width: "100%",
                                    background: "transparent",
                                    border: "2px solid #6B3E2E",
                                    color: "#6B3E2E",
                                    padding: "12px",
                                    borderRadius: "10px",
                                    fontWeight: 600,
                                    fontSize: "0.95rem",
                                    cursor: "pointer"
                                }}
                            >
                                <i className="fa-solid fa-thermometer" style={{ marginRight: '8px' }} /> Log Temp
                            </button>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div style={{ marginBottom: "1rem" }}>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#4B2E2B" }}>Storage Units</h3>
                </div>

                {loading && <p>Loading...</p>}
                {error && <p className="error-text">{error}</p>}

                <div className="log-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {storageUnits.length === 0 ? (
                        <p>No storage units found.</p>
                    ) : (
                        storageUnits.map((unit) => (
                            <div key={unit.id} className="log-card" style={{
                                background: "#fff",
                                padding: "20px",
                                borderRadius: "12px",
                                border: "1px solid rgba(0,0,0,0.05)",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
                            }}>
                                <div className="log-info">
                                    <h3 style={{ margin: "0 0 10px 0", color: "#3E2723", fontSize: '1.1rem' }}>{unit.location}</h3>
                                    <div style={{ fontSize: "0.9rem", color: "#5D4037", display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <p><strong>Capacity:</strong> {unit.current_load_kg} / {unit.max_capacity_kg} kg</p>
                                        <p><strong>Current Temp:</strong> {unit.current_temp}°C</p>
                                    </div>
                                </div>
                                <div className="log-actions" style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px solid #eee" }}>
                                    <button
                                        className="btn-edit"
                                        onClick={() => handleViewTempLogs(unit.id)}
                                        style={{
                                            background: "#EFEBE9",
                                            color: "#6B3E2E",
                                            border: "none",
                                            padding: "8px 12px",
                                            borderRadius: "6px",
                                            cursor: "pointer",
                                            fontSize: "0.85rem",
                                            fontWeight: 500
                                        }}
                                    >
                                        <i className="fa-solid fa-clock-rotate-left" style={{ marginRight: "6px" }} /> View Logs
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {selectedStorageLogs && (
                    <div style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }}>
                        <div style={{
                            background: "#fff",
                            width: "500px",
                            borderRadius: "12px",
                            padding: "2rem",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ margin: 0, color: "#3E2723" }}>Temperature Logs</h3>
                                <button onClick={() => setSelectedStorageLogs(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#888' }}>&times;</button>
                            </div>
                            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>Unit ID: {selectedStorageLogs.storageId}</p>

                            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                {selectedStorageLogs.logs.length === 0 ? (
                                    <p>No logs found.</p>
                                ) : (
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid #eee', textAlign: 'left' }}>
                                                <th style={{ padding: '8px', color: '#5D4037' }}>Temp (°C)</th>
                                                <th style={{ padding: '8px', color: '#5D4037' }}>Time</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedStorageLogs.logs.map((log) => (
                                                <tr key={log.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                                                    <td style={{ padding: '8px', fontWeight: 600, color: '#2E7D32' }}>{log.recorded_temp}°C</td>
                                                    <td style={{ padding: '8px', color: '#666' }}>{formatDateTime(log.timestamp)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
