"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ID, Models } from 'appwrite';
import { account } from "./appwrite";

type AppwriteUser = Models.User<Models.Preferences> | null;

interface UserContextType {
    user: AppwriteUser;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
    refresh: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AppwriteUser>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    // Helper to get current user from Appwrite client SDK (browser only)
    const refresh = async () => {
        setLoading(true);
        try {
            const user = await account.get();
            setUser(user);
        } catch {
            setUser(null);
        }
        setLoading(false);
    };

    useEffect(() => {
        refresh();
    }, []);

    const handleLogin = async (email: string, password: string) => {
        setError(null);
        setLoading(true);
        try {
            await account.createEmailPasswordSession(email, password);
            await refresh();
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
            else setError("Login failed");
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (email: string, password: string, name: string) => {
        setError(null);
        setLoading(true);
        try {
            await account.create(ID.unique(), email, password, name);
            await handleLogin(email, password);
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
            else setError("Registration failed");
        } finally {
            setLoading(false);
        }
    };


    const handleLogout = async () => {
        setLoading(true);
        try {
            await account.deleteSession("current");
        } catch {}
        setUser(null);
        setLoading(false);
    };

    return (
        <UserContext.Provider value={{ user, loading, error, login: handleLogin, register: handleRegister, logout: handleLogout, refresh }}>
            {children}
        </UserContext.Provider>
    );
};

export function useUser() {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("useUser must be used within a UserProvider");
    return ctx;
}
