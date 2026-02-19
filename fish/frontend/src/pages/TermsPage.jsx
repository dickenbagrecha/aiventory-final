import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
    return (
        <div style={{ padding: "4rem 2rem", maxWidth: "800px", margin: "0 auto" }}>
            <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem", color: "var(--bg-dark)" }}>
                <ArrowLeft size={20} /> Back to Home
            </Link>

            <h1 style={{ marginBottom: "1rem", color: "var(--bg-dark)" }}>Terms of Service</h1>
            <p style={{ color: "var(--bg-dark)", marginBottom: "2rem", opacity: 0.8 }}>Last Updated: February 2026</p>

            <section style={{ marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "var(--bg-dark)" }}>1. Acceptance of Terms</h2>
                <p style={{ lineHeight: "1.6", color: "var(--bg-dark)" }}>
                    By accessing and using the Marine Fishery platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                </p>
            </section>

            <section style={{ marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "var(--bg-dark)" }}>2. Use of Data</h2>
                <p style={{ lineHeight: "1.6", color: "var(--bg-dark)" }}>
                    The platform collects operational data including but not limited to vessel location, catch volume, and auction prices. This data is used solely for the purpose of optimizing fishery operations and is protected under our Privacy Policy.
                </p>
            </section>

            <section style={{ marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "var(--bg-dark)" }}>3. Compliance</h2>
                <p style={{ lineHeight: "1.6", color: "var(--bg-dark)" }}>
                    Users must comply with all local maritime laws and fishery regulations. Marine Fishery is a tool for management and does not replace legal obligations.
                </p>
            </section>

            <footer style={{ marginTop: "4rem", paddingTop: "2rem", borderTop: "1px solid #e0e0e0", fontSize: "0.9rem", color: "var(--bg-dark)", opacity: 0.8 }}>
                &copy; 2026 Marine Fishery. All rights reserved.
            </footer>
        </div>
    );
}
