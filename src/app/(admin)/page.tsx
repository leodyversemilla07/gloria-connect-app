import { useUser } from "../user-context";

export default function AdminDashboardPage() {
    const { user, loading } = useUser();

    if (loading) return <div>Loading...</div>;

    return (
        <div className="w-full max-w-3xl mx-auto mt-8">
            <h1 className="text-3xl font-bold mb-4 text-blue-900">Admin Dashboard</h1>
            <p className="text-gray-700 mb-8">Welcome to the Gloria Connect Admin Dashboard. Here you can manage users, view analytics, and configure settings.</p>
            <p>
                Welcome, <b>{user ? user.name : "Admin"}</b>! You are authenticated and can see this page.
            </p>
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
