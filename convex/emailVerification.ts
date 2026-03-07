export async function sendVerificationEmail(email: string, code: string): Promise<void> {
  console.log(`[EMAIL VERIFICATION] Sending to ${email}: ${code}`);
}
