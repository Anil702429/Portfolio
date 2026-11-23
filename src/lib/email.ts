import "server-only";

type ContactEmail = { name: string; email: string; subject: string; message: string };

/** Sends a plain-text notification through Resend. Does nothing when not configured. */
export async function sendContactNotification(contact: ContactEmail): Promise<void> {
  const { RESEND_API_KEY, CONTACT_EMAIL, CONTACT_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !CONTACT_EMAIL || !CONTACT_FROM_EMAIL) return;
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: CONTACT_FROM_EMAIL,
        to: [CONTACT_EMAIL],
        reply_to: contact.email,
        subject: `Portfolio: ${contact.subject}`,
        text: `From: ${contact.name} <${contact.email}>\n\n${contact.message}`,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) console.error("Contact notification failed:", response.status);
  } catch (error) {
    console.error("Contact notification failed:", error instanceof Error ? error.message : error);
  }
}
