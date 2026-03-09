'use client';
import { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { adminService } from '../../services/adminService';

export default function DashboardLayout({ children }) {
    const [adminMenuOpen, setAdminMenuOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await adminService.getMe();
                setProfile(data.admin || data);
            } catch (err) {
                console.error("Failed to fetch profile", err);
            }
        };
        fetchProfile();
    }, []);

    return (
        <ProtectedRoute>
            <div>
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                
                <div className="lg:pl-72">
                    <Navbar 
                        adminMenuOpen={adminMenuOpen} 
                        setAdminMenuOpen={setAdminMenuOpen} 
                        setSidebarOpen={setSidebarOpen}
                        profile={profile}
                    />

                    <main className="py-10">
                        <div className="px-4 sm:px-6 lg:px-8">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}
