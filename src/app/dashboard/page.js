"use client";

import { use, useEffect, useState } from "react";
import { getDashboardStats } from "../../services/adminServices";

export default function DashboardPage(){

    const [stats, setStats] = useState(null);

    useEffect(() => {
        async function loadStats() {
            const data = await getDashboardStats();
            setStats(data);
        }
        loadStats();
    }, []);

    return (
        <main style={{padding: "40px"}}>
            <h1>Admin Dashboard Stats</h1>

            <pre>
                {JSON.stringify(stats, null, 2)}
            </pre>
        </main>
    );
}