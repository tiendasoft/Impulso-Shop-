import { del } from "@vercel/blob";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método no permitido." });
  }

  const esperado = process.env.ADMIN_PASSWORD;
  const recibido = req.body?.password;
  if (!esperado || !recibido || recibido !== esperado) {
    return res.status(401).json({ error: "Contraseña de administrador incorrecta." });
  }

  const url = req.body?.url;
  if (typeof url !== "string" || !url.includes(".blob.vercel-storage.com/")) {
    return res.status(400).json({ error: "La dirección de imagen no es válida." });
  }

  try {
    await del(url);
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("API eliminar imagen:", error);
    return res.status(500).json({ error: "No se pudo eliminar la imagen de Vercel Blob." });
  }
}
