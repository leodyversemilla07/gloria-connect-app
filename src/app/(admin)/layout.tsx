import "../globals.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
            <header className="w-full px-8 py-4 bg-blue-900 text-white flex items-center justify-between shadow">
                <span className="text-xl font-bold tracking-tight">Gloria Connect Admin</span>
                {/* Add admin nav or user info here if needed */}
            </header>
            <main className="flex-1 flex flex-col items-center justify-start px-4 py-8 w-full max-w-5xl mx-auto">
                {children}
            </main>
            <footer className="w-full py-4 text-center text-gray-500 text-sm border-t mt-8">
                &copy; {new Date().getFullYear()} Gloria Connect Admin. All rights reserved.
            </footer>
        </div>
    );
}
