"use node";

import nodemailer from "nodemailer";
import { ConvexError, v } from "convex/values";
import { internalAction } from "./_generated/server";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new ConvexError(`Missing required email configuration: ${name}`);
  }
  return value;
}

export const deliverVerificationEmail = internalAction({
  args: {
    email: v.string(),
    code: v.string(),
  },
  handler: async (_ctx, args) => {
    const host = requireEnv("SMTP_HOST");
    const port = Number.parseInt(process.env.SMTP_PORT ?? "587", 10);
    const user = requireEnv("SMTP_USER");
    const pass = requireEnv("SMTP_PASS");
    const from = requireEnv("SMTP_FROM");
    const secure =
      process.env.SMTP_SECURE === "true" || port === 465;

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });

    await transporter.sendMail({
      from,
      to: args.email,
      subject: "Verify your Gloria Local Connect email",
      text: `Your Gloria Local Connect verification code is ${args.code}. It expires in 15 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #111827;">
          <h1 style="font-size: 24px; margin-bottom: 16px;">Verify your email</h1>
          <p style="font-size: 16px; line-height: 1.5; margin-bottom: 16px;">
            Use the code below to verify your Gloria Local Connect account.
          </p>
          <div style="font-size: 32px; font-weight: 700; letter-spacing: 8px; padding: 16px 20px; background: #f3f4f6; border-radius: 12px; text-align: center; margin-bottom: 16px;">
            ${args.code}
          </div>
          <p style="font-size: 14px; line-height: 1.5; color: #4b5563; margin-bottom: 0;">
            This code expires in 15 minutes. If you did not request this, you can ignore this email.
          </p>
        </div>
      `,
    });

    return { success: true };
  },
});
