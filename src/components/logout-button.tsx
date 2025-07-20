"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@/app/user-context";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const { logout, loading } = useUser();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    return (
        <Button onClick={handleLogout} variant="outline" className="ml-4" disabled={loading}>
            Logout
        </Button>
    );
}
