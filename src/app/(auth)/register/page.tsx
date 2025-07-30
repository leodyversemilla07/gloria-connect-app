
"use client";

import React from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { IconBrandGoogle } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

function isErrorWithMessage(err: unknown): err is { message: string } {
    return typeof err === "object" && err !== null && "message" in err && typeof (err as { message?: unknown }).message === "string";
}

export default function RegisterPage() {
    const { signIn } = useAuthActions();
    const router = useRouter();
    const currentUser = useQuery(api.users.getCurrentUser);
    React.useEffect(() => {
        // If currentUser is not null, user is authenticated
        if (currentUser) {
            router.push("/dashboard");
        }
    }, [currentUser, router]);
    const [error, setError] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    const [showPassword, setShowPassword] = React.useState(false);

    async function onSubmit(values: { name: string; email: string; password: string }) {
        setLoading(true);
        setError(null);
        try {
            await signIn("password", { ...values, flow: "signUp" });
            // Redirect after successful registration
            router.push("/dashboard"); // Change to your desired route
        } catch (err: unknown) {
            if (isErrorWithMessage(err)) {
                setError(err.message);
            } else {
                setError("Registration failed");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col gap-6")}> 
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
                    <p className="text-sm text-balance text-muted-foreground">
                        Enter your details below to create your account
                    </p>
                </div>
                <div className="grid gap-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input type="text" autoComplete="name" placeholder="Enter your name" required {...field} className="bg-background text-foreground border-border" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" autoComplete="email" placeholder="Enter your email" required {...field} className="bg-background text-foreground border-border" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            autoComplete="new-password"
                                            placeholder="Enter your password"
                                            required
                                            {...field}
                                            className="bg-background text-foreground border-border pr-10"
                                        />
                                        <button
                                            type="button"
                                            tabIndex={-1}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                                            onClick={() => setShowPassword((v) => !v)}
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? <IconEyeOff className="size-5" /> : <IconEye className="size-5" />}
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full bg-primary text-primary-foreground" disabled={loading || form.formState.isSubmitting}>
                        {loading ? "Please wait..." : "Register"}
                    </Button>
                    <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                        <span className="relative z-10 px-2 bg-background text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                    <Button variant="outline" className="w-full border-border text-foreground" type="button" onClick={() => signIn("google", { flow: "signUp" })}>
                        <IconBrandGoogle className="size-4 mr-2 text-foreground" />
                        Sign up with Google
                    </Button>
                    {error && (
                        <div className="text-destructive text-center text-sm mt-2">{error}</div>
                    )}
                </div>
                <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/login" className="underline underline-offset-4 text-primary">
                        Login
                    </Link>
                </div>
            </form>
        </Form>
    );
}
