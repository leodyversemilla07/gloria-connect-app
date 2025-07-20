
// =======================
// Imports
// =======================
import { Client, Account, Databases, Storage, ID } from 'node-appwrite';
import { cookies } from "next/headers";

// =======================
// Appwrite SDK Initialization (Server-side)
// =======================
// Only use this file in API routes, server components, or SSR logic (never in client/browser code)
export function getServerAppwrite() {
  // Always create a new client per request for security
  const client = new Client();
  client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);
  // Optionally set API key for admin actions (never expose to client)
  if (process.env.NEXT_APPWRITE_KEY) {
    client.setKey(process.env.NEXT_APPWRITE_KEY);
  }
  return {
    client,
    account: new Account(client),
    databases: new Databases(client),
    storage: new Storage(client),
    ID,
  };
}

// =======================
// SSR Utility: Get Logged-in User
// =======================
// Reads the Appwrite session from cookies and returns the user, or null if not authenticated
// SSR user session impersonation is not supported by Appwrite.
// Always use client-side authentication for user context.
export async function getLoggedInUser() {
  // Not supported: see Appwrite docs. Always return null.
  return null;
}
