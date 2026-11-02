# Portfolio de Santi

Portfolio público con proyectos y vistas interactivas de las apps originales. Incluye modos claro/oscuro, cinco paletas y diseño adaptable a móvil y escritorio.

## Publicación y edición

GitHub guarda esta interfaz y Vercel la publica. Los visitantes no necesitan cuenta y esta versión no admite escrituras ni subidas de archivos.

El contenido publicado y los archivos se conservan en el servicio actual para mantener los cambios, la foto, el CV y el editor existente. El enlace **Acceso del propietario** abre ese editor con autenticación; únicamente la cuenta propietaria puede guardar cambios. Los cambios aplicados se ven en la web pública al recargar.

La función `api/portfolio.ts` lee exclusivamente el contenido publicado. No reenvía consultas, cookies, credenciales, cuerpos ni cabeceras del visitante. Rechaza los métodos de escritura. Las rutas de medios, fuentes, imágenes y demos apuntan mediante rewrites a los recursos públicos existentes. Esta publicación mantiene esa dependencia; no representa una migración de D1/R2 ni de la autenticación.

## Demos

TNT, Finanzas Pro y Día a Día ejecutan sus pantallas originales en un entorno aislado con datos de sesión. Las demos no usan registros personales de producción. Bloc de notas y la Biblia original están pendientes de vincular su fuente.

Los bundles y archivos de lectura son los mismos que se publican junto con el portfolio original. Las demos conservan la licencia y procedencia de sus recursos. La RVR1909 es de dominio público; las traducciones que necesitan habilitación muestran su estado de acceso.

## Desarrollo

```sh
pnpm install
pnpm build
pnpm check
```

La configuración de `vercel.json` publica el frontend Vite y sirve la función de lectura. No se necesitan secretos para esta versión pública. Para cambios en la base de contenido, usar el editor propietario.

El código de la interfaz corresponde a la versión publicada el 2 de noviembre de 2026. El contenido se actualiza desde el editor; los cambios de código se publican desde este repositorio.
