import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
    return (
        <div style={{ padding: "4rem 2rem", maxWidth: "800px", margin: "0 auto" }}>
            <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem", color: "var(--bg-dark)" }}>
                <ArrowLeft size={20} /> Back to Home
            </Link>

            <h1 style={{ marginBottom: "1rem", color: "var(--bg-dark)" }}>Privacy Policy</h1>
            <p style={{ color: "var(--bg-dark)", marginBottom: "2rem", opacity: 0.8 }}>Last Updated: February 2026</p>

            <section style={{ marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "var(--bg-dark)" }}>Data Collection</h2>
                <p style={{ lineHeight: "1.6", color: "var(--bg-dark)" }}>
                    We collect information necessary to provide our services, including user account information, vessel telemetry, and transaction logs.
                </p>
            </section>

            <section style={{ marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "var(--bg-dark)" }}>Data Security</h2>
                <p style={{ lineHeight: "1.6", color: "var(--bg-dark)" }}>
                    We implement industry-standard security measures to protect your data. However, no absolute guarantee of security can be made for data transmitted over the internet.
                </p>
            </section>

            <section style={{ marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "var(--bg-dark)" }}>Contact Us</h2>
                <p style={{ lineHeight: "1.6", color: "var(--bg-dark)" }}>
                    For any questions regarding this Privacy Policy, please contact us at privacy@marinefishery.com.
                </p>
            </section>

            <footer style={{ marginTop: "4rem", paddingTop: "2rem", borderTop: "1px solid #e0e0e0", fontSize: "0.9rem", color: "var(--bg-dark)", opacity: 0.8 }}>
                &copy; 2026 Marine Fishery. All rights reserved.
            </footer>
        </div>
    );
}
