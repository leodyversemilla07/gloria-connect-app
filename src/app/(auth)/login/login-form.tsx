"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "../../../components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useAuthActions } from "@convex-dev/auth/react";
import { IconBrandGoogle, IconMail } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export interface LoginFormUIProps extends Omit<React.ComponentProps<"form">, "onChange"> {
    email: string;
    password: string;
    error?: string | null;
    loading?: boolean;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function LoginForm({
    className,
    email,
    password,
    error,
    loading,
    onInputChange,
    onSubmit,
    ...props
}: LoginFormUIProps) {
    const { signIn } = useAuthActions();
    const [magicLinkOpen, setMagicLinkOpen] = React.useState(false);
    const [magicEmail, setMagicEmail] = React.useState("");
    const [magicLinkError, setMagicLinkError] = React.useState<string | null>(null);
    const [magicLinkSent, setMagicLinkSent] = React.useState(false);

    function isValidEmail(email: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    return (
        <>
            <form onSubmit={onSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Login to your account</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                        Enter your credentials or use a provider
                    </p>
                </div>
                <div className="grid gap-6">
                    <div className="grid gap-3">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                            autoComplete="email"
                            value={email}
                            onChange={onInputChange}
                        />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" required autoComplete="current-password" value={password} onChange={onInputChange} />
                    </div>
                    <Button type="submit" className="w-full" disabled={!!loading}>
                        {loading ? "Please wait..." : "Login"}
                    </Button>
                    <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                        <span className="bg-background text-muted-foreground relative z-10 px-2">
                            Or continue with
                        </span>
                    </div>
                    <Button variant="outline" className="w-full" type="button" onClick={() => signIn("google")}>
                        <IconBrandGoogle className="size-4 mr-2" />
                        Sign in with Google
                    </Button>
                    <Button variant="outline" className="w-full" type="button" onClick={() => setMagicLinkOpen(true)}>
                        <IconMail className="size-4 mr-2" />
                        Sign in with Email (Magic Link)
                    </Button>
                    {error && (
                        <div className="text-red-600 text-center text-sm mt-2">{error}</div>
                    )}
                </div>
                <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <a href="/register" className="underline underline-offset-4">
                        Sign up
                    </a>
                </div>
            </form>
            <Dialog open={magicLinkOpen} onOpenChange={setMagicLinkOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Sign in with Email (Magic Link)</DialogTitle>
                    </DialogHeader>
                    {magicLinkSent ? (
                        <div className="text-green-600 text-center my-4">Magic link sent! Check your email.</div>
                    ) : (
                        <form
                            onSubmit={async e => {
                                e.preventDefault();
                                if (!isValidEmail(magicEmail)) {
                                    setMagicLinkError("Please enter a valid email address.");
                                    return;
                                }
                                setMagicLinkError(null);
                                try {
                                    await signIn("resend", { email: magicEmail });
                                    setMagicLinkSent(true);
                                } catch (err: unknown) {
                                    if (err instanceof Error) {
                                        setMagicLinkError(err.message);
                                    } else {
                                        setMagicLinkError("Failed to send magic link.");
                                    }
                                }
                            }}
                            className="flex flex-col gap-4"
                        >
                            <Label htmlFor="magic-email">Email</Label>
                            <Input
                                id="magic-email"
                                name="magic-email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                autoComplete="email"
                                value={magicEmail}
                                onChange={e => setMagicEmail(e.target.value)}
                            />
                            {magicLinkError && (
                                <div className="text-red-600 text-center text-sm mt-2">{magicLinkError}</div>
                            )}
                            <DialogFooter className="flex gap-2 justify-end">
                                <Button type="submit">Send Magic Link</Button>
                                <DialogClose asChild>
                                    <Button type="button" variant="ghost">Cancel</Button>
                                </DialogClose>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
