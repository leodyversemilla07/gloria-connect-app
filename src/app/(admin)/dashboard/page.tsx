"use client";

import LogoutButton from "../../../components/logout-button";
import { useUser } from "@/app/user-context";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
    const { user, loading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/login");
        }
    }, [user, loading, router]);

    if (loading) {
        return <div className="w-full max-w-3xl mx-auto mt-8 text-center">Loading...</div>;
    }
    if (!user) {
        return null;
    }

    return (
        <div className="w-full max-w-3xl mx-auto mt-8">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold text-blue-900">Admin Dashboard</h1>
                <LogoutButton />
            </div>
            <p className="text-gray-700 mb-8">Welcome to the Gloria Connect Admin Dashboard. Here you can manage users, view analytics, and configure settings.</p>
            {/* Add dashboard widgets, stats, or navigation here */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow p-6 flex flex-col items-start">
                    <h2 className="font-semibold text-lg mb-2">User Management</h2>
                    <p className="text-gray-500 mb-2">View, edit, or remove users from the platform.</p>
                    <button className="mt-auto bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition">Go to Users</button>
                </div>
                <div className="bg-white rounded-xl shadow p-6 flex flex-col items-start">
                    <h2 className="font-semibold text-lg mb-2">Analytics</h2>
                    <p className="text-gray-500 mb-2">See platform usage and engagement statistics.</p>
                    <button className="mt-auto bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition">View Analytics</button>
                </div>
            </div>
        </div>
    );
}
