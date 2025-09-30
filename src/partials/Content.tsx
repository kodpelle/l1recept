import { Outlet } from "react-router-dom";

export default function Main() {
    return (
        <main
            className="flex-grow-1"
            style={{
                background: "linear-gradient(135deg, #fdfdf7, #f7f3e9)",
            }}
        >
            <Outlet />
        </main>
    );
}
