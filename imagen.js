import { put } from "@vercel/blob";

function autorizado(req) {
  const esperado = process.env.ADMIN_PASSWORD;
  const recibido = req.body?.password;
  return Boolean(esperado && recibido && recibido === esperado);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método no permitido." });
  }

  if (!autorizado(req)) {
    return res.status(401).json({ error: "Contraseña de administrador incorrecta o ADMIN_PASSWORD no configurada en Vercel." });
  }

  try {
    const { dataUrl, filename } = req.body || {};
    if (typeof dataUrl !== "string" || !dataUrl.startsWith("data:image/")) {
      return res.status(400).json({ error: "La imagen enviada no es válida." });
    }

    const match = dataUrl.match(/^data:(image\/(?:jpeg|png|webp|gif));base64,([\s\S]+)$/i);
    if (!match) return res.status(400).json({ error: "Formato de imagen no admitido." });

    const mime = match[1].toLowerCase();
    const buffer = Buffer.from(match[2], "base64");
    if (!buffer.length || buffer.length > 4 * 1024 * 1024) {
      return res.status(413).json({ error: "La imagen supera el límite de 4 MB." });
    }

    const safeName = String(filename || "producto").replace(/[^a-z0-9._-]/gi, "-").slice(0, 80);
    const blob = await put(`productos/${Date.now()}-${safeName}`, buffer, {
      access: "public",
      addRandomSuffix: true,
      contentType: mime,
      cacheControlMaxAge: 31536000
    });

    return res.status(200).json({ ok: true, url: blob.url });
  } catch (error) {
    console.error("API imagen:", error);
    return res.status(500).json({ error: "No se pudo guardar la imagen en Vercel Blob." });
  }
}
