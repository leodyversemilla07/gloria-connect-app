// Appwrite client-side SDK initialization
// Only use this file in browser/client-side code (never in API routes or server components)
import { Client, Account, Databases, Storage, ID } from 'appwrite';

const client = new Client();
client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

export { client, account, databases, storage, ID };
