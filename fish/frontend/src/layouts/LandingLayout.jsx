import { Outlet } from "react-router-dom";
import LandingHeader from "../components/LandingHeader";

export default function LandingLayout() {
    return (
        <div style={{ background: '#FBF9F5', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <LandingHeader />
            <main style={{ flex: 1 }}>
                <Outlet />
            </main>
        </div>
    );
}
