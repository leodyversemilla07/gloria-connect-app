import { convexAuth } from "@convex-dev/auth/server";
import Google from "@auth/core/providers/google";
import { Password } from "@convex-dev/auth/providers/Password";
import Resend from "@auth/core/providers/resend";
import { query } from "./_generated/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Google,
    Password(),
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY!,
      from: "Gloria Connect <onboarding@resend.dev>",
      async sendVerificationRequest(params: {
        identifier: string;
        url: string;
        expires: Date;
        provider: unknown;
        token: string;
        theme: unknown;
        request: Request;
        [key: string]: unknown;
      }) {
        const { url } = params;
        const html = `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f6f8fa; padding: 40px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
              <tr>
                <td style="padding: 32px 32px 16px 32px; text-align: center;">
                  <img src="http://gloria.gov.ph/wp-content/uploads/2022/10/logo-300x298.jpg" alt="Gloria Connect" width="64" style="margin-bottom: 16px;" />
                  <h2 style="margin: 0 0 8px 0; color: #1a202c; font-size: 24px; font-weight: 700;">Sign in to Gloria Connect</h2>
                  <p style="margin: 0 0 24px 0; color: #4a5568; font-size: 16px;">Click the button below to sign in securely. This link is valid for 20 minutes.</p>
                  <a href="${url}" style="display: inline-block; padding: 14px 32px; background: #2563eb; color: #fff; border-radius: 8px; font-size: 18px; font-weight: 600; text-decoration: none; margin-bottom: 24px;">Sign in to Gloria Connect</a>
                  <p style="margin: 24px 0 0 0; color: #a0aec0; font-size: 13px;">If you did not request this email, you can safely ignore it.</p>
                </td>
              </tr>
            </table>
            <p style="text-align: center; color: #a0aec0; font-size: 12px; margin-top: 24px;">&copy; ${new Date().getFullYear()} Gloria Connect. All rights reserved.</p>
          </div>
        `;
        const text = `Sign in to Gloria Connect\n\nClick this link to sign in: ${url}\n\nIf you did not request this email, you can ignore it.`;
        (params as unknown as { html: string; text: string }).html = html;
        (params as unknown as { html: string; text: string }).text = text;
        return;
      },
    }), // Enables Magic Link via Resend (uses AUTH_RESEND_KEY)
  ]
});

// Query to get the current user's isAdmin status
export const getIsAdmin = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { isAdmin: false };
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email))
      .first();
    return { isAdmin: !!user?.isAdmin };
  },
});
