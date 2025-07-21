"use client";

function isErrorWithMessage(err: unknown): err is { message: string } {
    return typeof err === "object" && err !== null && "message" in err && typeof (err as { message?: unknown }).message === "string";
}

import { useState } from "react";
import { RegisterForm } from "./register-form";
import { useAuthActions } from "@convex-dev/auth/react";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuthActions();

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === "name") setName(e.target.value);
        if (e.target.name === "email") setEmail(e.target.value);
        if (e.target.name === "password") setPassword(e.target.value);
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await signIn("password", { email, password, name });
        } catch (err: unknown) {
            if (isErrorWithMessage(err)) {
                setError(err.message);
            } else {
                setError("Registration failed");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <RegisterForm
            name={name}
            email={email}
            password={password}
            error={error}
            loading={loading}
            onInputChange={onInputChange}
            onSubmit={onSubmit}
        />
    );
}
