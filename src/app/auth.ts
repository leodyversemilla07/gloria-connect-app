import { account, ID } from './appwrite';

export async function register(email: string, password: string, name: string) {
  return account.create(ID.unique(), email, password, name);
}

export async function login(email: string, password: string) {
  return account.createEmailPasswordSession(email, password);
}

export async function getLoggedInUser() {
  try {
    return await account.get();
  } catch {
    return null;
  }
}

export async function logout() {
  return account.deleteSession('current');
}
