import Resend from "@auth/core/providers/resend";
import { generateRandomString, type RandomReader } from "@oslojs/crypto/random";
import { Resend as ResendAPI } from "resend";

export const ResendPasswordReset = Resend({
  id: "resend-password-reset",
  apiKey: process.env.AUTH_RESEND_KEY,
  async generateVerificationToken() {
    const random: RandomReader = {
      read(bytes) {
        crypto.getRandomValues(bytes);
      },
    };
    const alphabet = "0123456789";
    const length = 8;
    return generateRandomString(random, alphabet, length);
  },
  async sendVerificationRequest({ identifier: email, provider, token }) {
    const resend = new ResendAPI(provider.apiKey);
    const { error } = await resend.emails.send({
      from: "Gloria Connect <onboarding@resend.dev>",
      to: [email],
      subject: "Reset your password - Gloria Connect",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Reset Your Password</h1>
          <p>You requested a password reset for your Gloria Connect account.</p>
          <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; text-align: center; margin: 24px 0;">
            <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">${token}</p>
          </div>
          <p>This code will expire in 30 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });
    if (error) {
      throw new Error("Could not send email");
    }
  },
});
