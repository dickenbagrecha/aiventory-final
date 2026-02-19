import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import {
    getSpoilageByBatch,
    evaluateSpoilage,
    recommendAuctionPrice,
} from "../api/analyticsApi.js";
import "../styles/logs.css";

export default function AnalyticsPage() {
    const { token } = useAuth();

    const [spoilageQuery, setSpoilageQuery] = useState("");
    const [spoilageResult, setSpoilageResult] = useState(null);

    const [evalForm, setEvalForm] = useState({
        catch_batch_id: "",
        avg_temperature: "",
        hours_since_catch: "",
    });
    const [evalResult, setEvalResult] = useState(null);

    const [priceForm, setPriceForm] = useState({
        species_name: "",
        catch_weight_kg: "",
        recent_avg_price: "",
        demand_index: "",
    });
    const [priceResult, setPriceResult] = useState(null);

    async function handleGetSpoilage() {
        try {
            const result = await getSpoilageByBatch(spoilageQuery, token);
            setSpoilageResult(result);
        } catch (err) {
            console.error(err);
            setSpoilageResult({ error: err.message });
        }
    }

    async function handleEvaluateSpoilage(e) {
        e.preventDefault();
        try {
            const result = await evaluateSpoilage(
                {
                    catch_batch_id: parseInt(evalForm.catch_batch_id),
                    hours_since_catch: parseFloat(evalForm.hours_since_catch),
                    hours_before_ice: 2,
                    avg_storage_temp: parseFloat(evalForm.avg_temperature),
                    temp_variance: 1.5,
                    species_shelf_life: 48,
                    weight_kg: 500,
                },
                token
            );
            setEvalResult(result);
        } catch (err) {
            console.error(err);
            setEvalResult({ error: err.message });
        }
    }

    async function handleRecommendPrice(e) {
        e.preventDefault();
        try {
            const result = await recommendAuctionPrice(
                {
                    species_name: priceForm.species_name,
                    catch_weight_kg: parseFloat(priceForm.catch_weight_kg),
                    recent_avg_price: parseFloat(priceForm.recent_avg_price),
                    demand_index: parseFloat(priceForm.demand_index),
                },
                token
            );
            setPriceResult(result);
        } catch (err) {
            console.error(err);
            setPriceResult({ error: err.message });
        }
    }

    return (

        <div className="logs-page" style={{ padding: "0" }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: "2rem" }}>
                    <h2 style={{ fontSize: "1.8rem", fontWeight: 700, color: "#3E2723", marginBottom: "0.5rem" }}>
                        Analytics Dashboard
                    </h2>
                    <p style={{ color: "#8D6E63" }}>
                        AI-driven insights for spoilage and pricing
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1fr)', gap: '24px' }}>

                    {/* Spoilage Prediction Card */}
                    <div style={{
                        background: "#fff",
                        borderRadius: "16px",
                        padding: "2rem",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
                        border: "1px solid rgba(0,0,0,0.05)",
                        gridColumn: 'span 2'
                    }}>
                        <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#4B2E2B", marginBottom: "1.5rem", display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <i className="fa-solid fa-magnifying-glass-chart" /> Spoilage Prediction by Batch
                        </h3>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input
                                placeholder="Enter Catch Batch ID (UUID)"
                                value={spoilageQuery}
                                onChange={(e) => setSpoilageQuery(e.target.value)}
                                style={{
                                    flex: 1,
                                    padding: "12px",
                                    borderRadius: "8px",
                                    border: "1px solid #EAEAEA",
                                    outline: "none",
                                    fontSize: "0.95rem",
                                    background: "#FAFAFA"
                                }}
                            />
                            <button
                                onClick={handleGetSpoilage}
                                className="btn"
                                style={{
                                    background: "#6B3E2E",
                                    color: "#fff",
                                    padding: "12px 20px",
                                    borderRadius: "8px",
                                    border: "none",
                                    fontWeight: 600,
                                    cursor: "pointer"
                                }}
                            >
                                Analyze
                            </button>
                        </div>
                        {spoilageResult && (
                            <div style={{
                                marginTop: "20px",
                                padding: "15px",
                                background: spoilageResult.error ? "#FFEBEE" : "#F1F8E9",
                                borderRadius: "8px",
                                border: spoilageResult.error ? "1px solid #FFCDD2" : "1px solid #DCEDC8"
                            }}>
                                {spoilageResult.error ? (
                                    <p style={{ color: "#D32F2F", margin: 0 }}>Error: {spoilageResult.error}</p>
                                ) : (
                                    <>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <strong>Risk Level:</strong>
                                            <span style={{ fontWeight: 700, color: spoilageResult.predicted_risk === 'High' ? '#D32F2F' : '#388E3C' }}>{spoilageResult.predicted_risk}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <strong>Confidence:</strong>
                                            <span>{(spoilageResult.confidence_score * 100).toFixed(1)}%</span>
                                        </div>
                                        <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                                            <strong>Recommendation:</strong> {spoilageResult.recommended_action}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Evaluate Spoilage (ML) Card */}
                    <div style={{
                        background: "#fff",
                        borderRadius: "16px",
                        padding: "2rem",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
                        border: "1px solid rgba(0,0,0,0.05)"
                    }}>
                        <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#4B2E2B", marginBottom: "1.5rem" }}>
                            Evaluate New Data
                        </h3>
                        <form onSubmit={handleEvaluateSpoilage}>
                            <div className="form-group" style={{ marginBottom: "15px" }}>
                                <label style={{ fontWeight: 600, color: "#5D4037", marginBottom: "8px", display: "block" }}>
                                    Batch ID <span style={{ color: "#D32F2F" }}>*</span>
                                </label>
                                <input
                                    required
                                    value={evalForm.catch_batch_id}
                                    onChange={(e) => setEvalForm({ ...evalForm, catch_batch_id: e.target.value })}
                                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #EAEAEA", outline: "none", background: "#FAFAFA" }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label style={{ fontWeight: 600, color: "#5D4037", marginBottom: "8px", display: "block" }}>
                                        Avg Temp (°C)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        required
                                        value={evalForm.avg_temperature}
                                        onChange={(e) => setEvalForm({ ...evalForm, avg_temperature: e.target.value })}
                                        style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #EAEAEA", outline: "none", background: "#FAFAFA" }}
                                    />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label style={{ fontWeight: 600, color: "#5D4037", marginBottom: "8px", display: "block" }}>
                                        Hours Since Catch
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        required
                                        value={evalForm.hours_since_catch}
                                        onChange={(e) => setEvalForm({ ...evalForm, hours_since_catch: e.target.value })}
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
                                    background: "#4B2E2B",
                                    color: "#fff",
                                    padding: "12px",
                                    borderRadius: "8px",
                                    border: "none",
                                    fontWeight: 600,
                                    cursor: "pointer"
                                }}
                            >
                                Run Evaluation
                            </button>
                        </form>
                        {evalResult && (
                            <div style={{ marginTop: "15px", padding: "10px", background: "#F5F5F5", borderRadius: "8px", fontSize: '0.9rem' }}>
                                <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{JSON.stringify(evalResult, null, 2)}</pre>
                            </div>
                        )}
                    </div>

                    {/* Price Recommendation (ML) Card */}
                    <div style={{
                        background: "#fff",
                        borderRadius: "16px",
                        padding: "2rem",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
                        border: "1px solid rgba(0,0,0,0.05)"
                    }}>
                        <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#4B2E2B", marginBottom: "1.5rem" }}>
                            Price Recommender
                        </h3>
                        <form onSubmit={handleRecommendPrice}>
                            <div className="form-group" style={{ marginBottom: "15px" }}>
                                <label style={{ fontWeight: 600, color: "#5D4037", marginBottom: "8px", display: "block" }}>
                                    Species Name <span style={{ color: "#D32F2F" }}>*</span>
                                </label>
                                <input
                                    required
                                    value={priceForm.species_name}
                                    onChange={(e) => setPriceForm({ ...priceForm, species_name: e.target.value })}
                                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #EAEAEA", outline: "none", background: "#FAFAFA" }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label style={{ fontWeight: 600, color: "#5D4037", marginBottom: "8px", display: "block" }}>
                                        Weight (kg)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        required
                                        value={priceForm.catch_weight_kg}
                                        onChange={(e) => setPriceForm({ ...priceForm, catch_weight_kg: e.target.value })}
                                        style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #EAEAEA", outline: "none", background: "#FAFAFA" }}
                                    />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label style={{ fontWeight: 600, color: "#5D4037", marginBottom: "8px", display: "block" }}>
                                        Recent Price
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={priceForm.recent_avg_price}
                                        onChange={(e) => setPriceForm({ ...priceForm, recent_avg_price: e.target.value })}
                                        style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #EAEAEA", outline: "none", background: "#FAFAFA" }}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label style={{ fontWeight: 600, color: "#5D4037", marginBottom: "8px", display: "block" }}>
                                    Demand Index (0-10) <span style={{ color: "#D32F2F" }}>*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    value={priceForm.demand_index}
                                    onChange={(e) => setPriceForm({ ...priceForm, demand_index: e.target.value })}
                                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #EAEAEA", outline: "none", background: "#FAFAFA" }}
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn"
                                style={{
                                    width: "100%",
                                    marginTop: "20px",
                                    background: "#4B2E2B",
                                    color: "#fff",
                                    padding: "12px",
                                    borderRadius: "8px",
                                    border: "none",
                                    fontWeight: 600,
                                    cursor: "pointer"
                                }}
                            >
                                Get Price
                            </button>
                        </form>
                        {priceResult && (
                            <div style={{ marginTop: "15px", padding: "10px", background: "#F5F5F5", borderRadius: "8px", fontSize: '0.9rem' }}>
                                <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{JSON.stringify(priceResult, null, 2)}</pre>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
