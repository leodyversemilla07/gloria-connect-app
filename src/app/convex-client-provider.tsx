"use client";

import { ConvexReactClient } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ReactNode } from "react";

const convex = process.env.NEXT_PUBLIC_CONVEX_URL 
    ? new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL)
    : null;

export function ConvexClientProvider({ children }: { children: ReactNode }) {
    if (!convex) {
        return (
            <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
                <p>
                    ⚠️ Convex client is not configured. Please set <code>NEXT_PUBLIC_CONVEX_URL</code> in your environment variables.
                </p>
                <p>
                    Run <code>convex dev</code> locally to generate the <code>.env.local</code> file, or add the URL manually to your Vercel environment.
                </p>
            </div>
        );
    }
    
    return <ConvexAuthProvider client={convex}>{children}</ConvexAuthProvider>;
}
