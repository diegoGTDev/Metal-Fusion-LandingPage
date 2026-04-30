import type { APIRoute } from "astro";
import nodemailer from "nodemailer";

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.formData();

    const nombre = data.get("nombre")?.toString().trim();
    const correo = data.get("correo")?.toString().trim();
    const telefono = data.get("telefono")?.toString().trim() || "No proporcionado";
    const mensaje = data.get("mensaje")?.toString().trim();

    // Validación básica
    if (!nombre || !correo || !mensaje) {
      return new Response(
        JSON.stringify({ success: false, error: "Faltan campos requeridos." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Configuración del transporter de Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: import.meta.env.GMAIL_USER,
        pass: import.meta.env.GMAIL_APP_PASSWORD,
      },
    });

    // Correo que recibirás en tu bandeja de entrada
    await transporter.sendMail({
      from: `"Metal Fusion Web" <${import.meta.env.GMAIL_USER}>`,
      to: import.meta.env.GMAIL_USER,
      replyTo: correo,
      subject: `Nuevo mensaje de contacto de: ${nombre}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #C00000; padding: 24px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Nuevo Mensaje de Contacto</h1>
            <p style="color: #fca5a5; margin: 8px 0 0 0; font-size: 14px;">Metal Fusion - Formulario Web</p>
          </div>
          <div style="padding: 32px; background-color: #f9fafb;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px; font-weight: bold; color: #374151; width: 140px;">Nombre:</td>
                <td style="padding: 12px; color: #111827;">${nombre}</td>
              </tr>
              <tr style="background-color: #f3f4f6;">
                <td style="padding: 12px; font-weight: bold; color: #374151;">Correo:</td>
                <td style="padding: 12px; color: #111827;"><a href="mailto:${correo}" style="color: #C00000;">${correo}</a></td>
              </tr>
              <tr>
                <td style="padding: 12px; font-weight: bold; color: #374151;">Teléfono:</td>
                <td style="padding: 12px; color: #111827;">${telefono}</td>
              </tr>
              <tr style="background-color: #f3f4f6;">
                <td style="padding: 12px; font-weight: bold; color: #374151; vertical-align: top;">Mensaje:</td>
                <td style="padding: 12px; color: #111827; line-height: 1.6;">${mensaje.replace(/\n/g, "<br>")}</td>
              </tr>
            </table>
          </div>
          <div style="padding: 16px; text-align: center; background-color: #1f2937;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">Puedes responder directamente a este correo para contactar al cliente.</p>
          </div>
        </div>
      `,
    });

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Error al procesar el mensaje. Intenta de nuevo." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
