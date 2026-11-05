import { list, put } from "@vercel/blob";

const CATALOGO = "tienda/catalogo.json";

function autorizado(req) {
  const esperado = process.env.ADMIN_PASSWORD;
  const recibido = req.body?.password;
  return Boolean(esperado && recibido && recibido === esperado);
}

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const resultado = await list({ prefix: CATALOGO, limit: 1 });
      if (!resultado.blobs?.length) {
        return res.status(200).json({ productos: [], configuracion: {} });
      }
      const respuesta = await fetch(resultado.blobs[0].url, { cache: "no-store" });
      if (!respuesta.ok) throw new Error("No se pudo leer el catálogo guardado.");
      const datos = await respuesta.json();
      return res.status(200).json(datos);
    }

    if (req.method === "POST") {
      if (!autorizado(req)) {
        return res.status(401).json({ error: "Contraseña de administrador incorrecta o ADMIN_PASSWORD no configurada en Vercel." });
      }
      const datos = req.body?.datos;
      if (!datos || !Array.isArray(datos.productos)) {
        return res.status(400).json({ error: "El catálogo enviado no es válido." });
      }
      const guardado = await put(CATALOGO, JSON.stringify(datos), {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: "application/json; charset=utf-8",
        cacheControlMaxAge: 60
      });
      return res.status(200).json({ ok: true, url: guardado.url, datos });
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Método no permitido." });
  } catch (error) {
    console.error("API catálogo:", error);
    return res.status(500).json({ error: "Error al acceder al catálogo de Vercel Blob." });
  }
}
