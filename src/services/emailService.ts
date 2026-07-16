import nodemailer from "nodemailer";

interface EmailInput {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

function createTransport() {
  if (!process.env.SMTP_HOST) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
  });
}

export async function sendEmail(input: EmailInput) {
  const transport = createTransport();
  if (!transport) {
    if (process.env.NODE_ENV !== "test")
      console.info(`Correo omitido (SMTP no configurado): ${input.subject}`);
    return false;
  }
  await transport.sendMail({
    from: process.env.EMAIL_FROM || "StockFácil <no-reply@stockfacil.local>",
    ...input,
  });
  return true;
}

export function sendEmailSafely(input: EmailInput) {
  void sendEmail(input).catch((error: unknown) =>
    console.error("No fue posible enviar el correo", error),
  );
}
