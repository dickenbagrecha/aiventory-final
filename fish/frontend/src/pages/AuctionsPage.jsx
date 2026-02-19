import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import {
    getAllAuctions,
    createAuction,
    createBid,
    getBidsForAuction,
} from "../api/auctionApi.js";
import "../styles/logs.css";

function formatDate(dateString) {
    if (!dateString) return "N/A";
    try {
        return new Date(dateString).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    } catch {
        return "Invalid date";
    }
}

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

export default function AuctionsPage() {
    const { token } = useAuth();
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showAuctionForm, setShowAuctionForm] = useState(false);
    const [showBidForm, setShowBidForm] = useState(false);
    const [selectedAuctionBids, setSelectedAuctionBids] = useState(null);

    const [auctionForm, setAuctionForm] = useState({
        port: "",
        auction_date: "",
        base_price_per_kg: "",
        recommended_price_per_kg: "",
    });

    const [bidForm, setBidForm] = useState({
        auction_id: "",
        buyer_name: "",
        bid_price_per_kg: "",
        quantity_kg: "",
    });

    useEffect(() => {
        loadAuctions();
    }, []);

    async function loadAuctions() {
        setLoading(true);
        setError("");
        try {
            const data = await getAllAuctions(token);
            setAuctions(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setError("Failed to load auctions.");
        } finally {
            setLoading(false);
        }
    }

    async function handleCreateAuction(e) {
        e.preventDefault();
        try {
            await createAuction(
                {
                    port: auctionForm.port,
                    auction_date: auctionForm.auction_date,
                    base_price_per_kg: parseFloat(auctionForm.base_price_per_kg),
                    recommended_price_per_kg: auctionForm.recommended_price_per_kg
                        ? parseFloat(auctionForm.recommended_price_per_kg)
                        : null,
                },
                token
            );
            setShowAuctionForm(false);
            setAuctionForm({
                port: "",
                auction_date: "",
                base_price_per_kg: "",
                recommended_price_per_kg: "",
            });
            loadAuctions();
        } catch (err) {
            console.error(err);
            alert("Failed to create auction");
        }
    }

    async function handleCreateBid(e) {
        e.preventDefault();
        try {
            await createBid(
                {
                    auction_id: bidForm.auction_id,
                    buyer_name: bidForm.buyer_name,
                    bid_price_per_kg: parseFloat(bidForm.bid_price_per_kg),
                    quantity_kg: parseFloat(bidForm.quantity_kg),
                    timestamp: new Date().toISOString(),
                },
                token
            );
            setShowBidForm(false);
            setBidForm({
                auction_id: "",
                buyer_name: "",
                bid_price_per_kg: "",
                quantity_kg: "",
            });
            alert("Bid created successfully");
        } catch (err) {
            console.error(err);
            alert("Failed to create bid");
        }
    }

    async function handleViewBids(auctionId) {
        try {
            const bids = await getBidsForAuction(auctionId, token);
            setSelectedAuctionBids({ auctionId, bids });
        } catch (err) {
            console.error(err);
            alert("Failed to load bids");
        }
    }

    return (
        <div className="logs-page" style={{ padding: "0" }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: "2rem" }}>
                    <h2 style={{ fontSize: "1.8rem", fontWeight: 700, color: "#3E2723", marginBottom: "0.5rem" }}>
                        Auctions & Bidding
                    </h2>
                    <p style={{ color: "#8D6E63" }}>
                        Manage live auctions, pricing strategies, and buyer bids
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 2fr) minmax(300px, 1fr)', gap: '24px', marginBottom: '3rem' }}>

                    {/* Create Auction Card */}
                    <div style={{
                        background: "#fff",
                        borderRadius: "16px",
                        padding: "2rem",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
                        border: "1px solid rgba(0,0,0,0.05)"
                    }}>
                        <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#4B2E2B", marginBottom: "1.5rem" }}>
                            Create New Auction
                        </h3>

                        <form onSubmit={handleCreateAuction}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label style={{ fontWeight: 600, color: "#5D4037", marginBottom: "8px", display: "block" }}>
                                        Port <span style={{ color: "#D32F2F" }}>*</span>
                                    </label>
                                    <input
                                        required
                                        value={auctionForm.port}
                                        onChange={(e) => setAuctionForm({ ...auctionForm, port: e.target.value })}
                                        style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #EAEAEA", outline: "none", background: "#FAFAFA" }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label style={{ fontWeight: 600, color: "#5D4037", marginBottom: "8px", display: "block" }}>
                                        Date <span style={{ color: "#D32F2F" }}>*</span>
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={auctionForm.auction_date}
                                        onChange={(e) => setAuctionForm({ ...auctionForm, auction_date: e.target.value })}
                                        style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #EAEAEA", outline: "none", background: "#FAFAFA" }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label style={{ fontWeight: 600, color: "#5D4037", marginBottom: "8px", display: "block" }}>
                                        Base Price/kg <span style={{ color: "#D32F2F" }}>*</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={auctionForm.base_price_per_kg}
                                        onChange={(e) => setAuctionForm({ ...auctionForm, base_price_per_kg: e.target.value })}
                                        style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #EAEAEA", outline: "none", background: "#FAFAFA" }}
                                    />
                                </div>
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label style={{ fontWeight: 600, color: "#5D4037", marginBottom: "8px", display: "block" }}>
                                        Recommended Price/kg
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={auctionForm.recommended_price_per_kg}
                                        onChange={(e) => setAuctionForm({ ...auctionForm, recommended_price_per_kg: e.target.value })}
                                        placeholder="Optional (AI Suggestion)"
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
                                <i className="fa-solid fa-gavel" style={{ marginRight: '8px' }} /> Launch Auction
                            </button>
                        </form>
                    </div>

                    {/* Place Bid Card */}
                    <div style={{
                        background: "#FBF9F5",
                        borderRadius: "16px",
                        padding: "2rem",
                        border: "1px solid rgba(0,0,0,0.05)"
                    }}>
                        <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#4B2E2B", marginBottom: "1.5rem" }}>
                            Place Bid
                        </h3>
                        <form onSubmit={handleCreateBid}>
                            <div className="form-group" style={{ marginBottom: "15px" }}>
                                <label style={{ fontWeight: 600, color: "#5D4037", marginBottom: "8px", display: "block" }}>
                                    Auction ID <span style={{ color: "#D32F2F" }}>*</span>
                                </label>
                                <input
                                    required
                                    value={bidForm.auction_id}
                                    onChange={(e) => setBidForm({ ...bidForm, auction_id: e.target.value })}
                                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #EAEAEA", outline: "none", background: "#fff" }}
                                    placeholder="UUID..."
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: "15px" }}>
                                <label style={{ fontWeight: 600, color: "#5D4037", marginBottom: "8px", display: "block" }}>
                                    Buyer Name <span style={{ color: "#D32F2F" }}>*</span>
                                </label>
                                <input
                                    required
                                    value={bidForm.buyer_name}
                                    onChange={(e) => setBidForm({ ...bidForm, buyer_name: e.target.value })}
                                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #EAEAEA", outline: "none", background: "#fff" }}
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: "15px" }}>
                                <label style={{ fontWeight: 600, color: "#5D4037", marginBottom: "8px", display: "block" }}>
                                    Bid Price/kg <span style={{ color: "#D32F2F" }}>*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    value={bidForm.bid_price_per_kg}
                                    onChange={(e) => setBidForm({ ...bidForm, bid_price_per_kg: e.target.value })}
                                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #EAEAEA", outline: "none", background: "#fff" }}
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: "20px" }}>
                                <label style={{ fontWeight: 600, color: "#5D4037", marginBottom: "8px", display: "block" }}>
                                    Quantity (kg) <span style={{ color: "#D32F2F" }}>*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    required
                                    value={bidForm.quantity_kg}
                                    onChange={(e) => setBidForm({ ...bidForm, quantity_kg: e.target.value })}
                                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #EAEAEA", outline: "none", background: "#fff" }}
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn"
                                style={{
                                    width: "100%",
                                    background: "#4B2E2B",
                                    color: "#fff",
                                    padding: "12px",
                                    borderRadius: "10px",
                                    fontWeight: 600,
                                    fontSize: "0.95rem",
                                    cursor: "pointer",
                                    border: "none"
                                }}
                            >
                                Submit Bid
                            </button>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div style={{ marginBottom: "1rem" }}>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#4B2E2B" }}>Active Auctions</h3>
                </div>

                {loading && <p>Loading...</p>}
                {error && <p className="error-text">{error}</p>}

                <div className="log-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {auctions.length === 0 ? (
                        <p>No auctions found.</p>
                    ) : (
                        auctions.map((auction) => (
                            <div key={auction.id} className="log-card" style={{
                                background: "#fff",
                                padding: "20px",
                                borderRadius: "12px",
                                border: "1px solid rgba(0,0,0,0.05)",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
                            }}>
                                <div className="log-info">
                                    <h3 style={{ margin: "0 0 10px 0", color: "#3E2723", fontSize: '1.1rem' }}>{auction.port}</h3>
                                    <div style={{ fontSize: "0.9rem", color: "#5D4037", display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <p><strong>Date:</strong> {formatDate(auction.auction_date)}</p>
                                        <p><strong>Base Price:</strong> ₹{auction.base_price_per_kg}/kg</p>
                                        {auction.recommended_price_per_kg && (
                                            <p style={{ color: '#2E7D32', fontWeight: 600 }}>AI Recommended: ₹{auction.recommended_price_per_kg}/kg</p>
                                        )}
                                    </div>
                                </div>
                                <div className="log-actions" style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px solid #eee" }}>
                                    <button
                                        onClick={() => handleViewBids(auction.id)}
                                        style={{
                                            background: "#FFF8E1",
                                            color: "#F57F17",
                                            border: "none",
                                            padding: "8px 12px",
                                            borderRadius: "6px",
                                            cursor: "pointer",
                                            fontSize: "0.85rem",
                                            fontWeight: 600
                                        }}
                                    >
                                        View Bids
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {selectedAuctionBids && (
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
                                <h3 style={{ margin: 0, color: "#3E2723" }}>Bids for Auction</h3>
                                <button onClick={() => setSelectedAuctionBids(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#888' }}>&times;</button>
                            </div>

                            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                {selectedAuctionBids.bids.length === 0 ? (
                                    <p>No bids yet.</p>
                                ) : (
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid #eee', textAlign: 'left' }}>
                                                <th style={{ padding: '8px', color: '#5D4037' }}>Buyer</th>
                                                <th style={{ padding: '8px', color: '#5D4037' }}>Bid/kg</th>
                                                <th style={{ padding: '8px', color: '#5D4037' }}>Qty</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedAuctionBids.bids.map((bid) => (
                                                <tr key={bid.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                                                    <td style={{ padding: '8px', fontWeight: 600 }}>{bid.buyer_name}</td>
                                                    <td style={{ padding: '8px', color: '#2E7D32', fontWeight: 600 }}>₹{bid.bid_price_per_kg}</td>
                                                    <td style={{ padding: '8px', color: '#666' }}>{bid.quantity_kg} kg</td>
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
