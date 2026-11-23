import { Resend } from "resend";

let resendInstance: Resend | null = null;

export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  if (!resendInstance) {
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
}

export async function sendPasswordResetEmail(
  email: string,
  token: string,
): Promise<{ sent: boolean; link: string; error?: string }> {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3002";
  const resetLink = `${frontendUrl}/reset-password?token=${encodeURIComponent(token)}`;

  const resend = getResendClient();
  if (!resend) {
    console.log(
      `[Watchtower Resend] RESEND_API_KEY is not defined in environment. Reset link for ${email}: ${resetLink}`,
    );
    return { sent: false, link: resetLink };
  }

  try {
    const from =
      process.env.RESEND_FROM || "Watchtower <onboarding@resend.dev>";
    const { data, error } = await resend.emails.send({
      from,
      to: [email],
      subject: "Reset your Watchtower password",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 36px 28px; background-color: #07080D; color: #FFFFFF; border-radius: 12px; border: 1px solid rgba(114, 125, 161, 0.2);">
          <div style="margin-bottom: 24px;">
            <span style="font-size: 20px; font-weight: 700; color: #FFFFFF; letter-spacing: -0.02em;">Watchtower</span>
          </div>
          <h1 style="font-size: 22px; font-weight: 700; margin: 0 0 14px 0; color: #FFFFFF;">
            Reset your password
          </h1>
          <p style="font-size: 14px; line-height: 1.6; color: #8F9BB7; margin: 0 0 24px 0;">
            We received a request to reset your password for your Watchtower account. Click the button below to set a new password. This link is valid for 1 hour.
          </p>
          <div style="margin-bottom: 28px;">
            <a href="${resetLink}" style="display: inline-block; background-color: #5B63D3; color: #FFFFFF; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 24px; border-radius: 6px;">
              Reset Password
            </a>
          </div>
          <p style="font-size: 12px; line-height: 1.5; color: #555E75; margin: 0 0 16px 0;">
            Or copy and paste this link in your browser:<br />
            <a href="${resetLink}" style="color: #7C87F7; word-break: break-all;">${resetLink}</a>
          </p>
          <hr style="border: none; border-top: 1px solid rgba(114, 125, 161, 0.15); margin: 24px 0 16px 0;" />
          <p style="font-size: 11px; color: #555E75; margin: 0;">
            If you did not request a password reset, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error(
        "[Watchtower Resend] Error response from Resend API:",
        error,
      );
      return { sent: false, link: resetLink, error: error.message };
    }

    console.log(
      `[Watchtower Resend] Reset email sent to ${email} (ID: ${data?.id})`,
    );
    return { sent: true, link: resetLink };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[Watchtower Resend] Failed to send email via Resend:", msg);
    return { sent: false, link: resetLink, error: msg };
  }
}
