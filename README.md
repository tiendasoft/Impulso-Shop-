# Tienda con Vercel Blob

Este proyecto conserva el catálogo de 63 productos y sus imágenes originales del archivo HTML recibido.

## Qué se necesita configurar en Vercel

1. Importar este proyecto en Vercel desde GitHub.
2. En el proyecto, abrir **Storage** y crear un almacenamiento **Blob** público.
3. Vincular Blob al proyecto. Vercel debe crear `BLOB_READ_WRITE_TOKEN` automáticamente.
4. En **Settings > Environment Variables**, crear:
   - `ADMIN_PASSWORD` = `pepa1` (es la contraseña inicial que figura en el archivo recibido).
5. Hacer un nuevo Deploy después de agregar las variables.

## Migración inicial

Al abrir la página por primera vez, si todavía no existe un catálogo en Vercel Blob, se carga el respaldo original de 63 productos. Las fotografías Base64 se suben individualmente a Vercel Blob y el catálogo se guarda en `tienda/catalogo.json`.

La migración requiere que Blob esté vinculado y que `ADMIN_PASSWORD` coincida con la contraseña de administración.

## Importante

- Las imágenes se guardan en Vercel Blob.
- Los datos del catálogo (nombres, precios, categorías, stock y configuración) también se guardan en un archivo JSON de Vercel Blob.
- No se usa nPoint en esta versión.
- La contraseña inicial del respaldo era `pepa1`. Cambiala en Vercel en `ADMIN_PASSWORD` y mantené sincronizada la contraseña del panel.
- No publiques el repositorio como plantilla con una contraseña que no hayas cambiado.
- El archivo HTML debe estar en la raíz con el nombre `index.html`.
