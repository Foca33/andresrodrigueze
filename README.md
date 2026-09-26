# HELA — sitio web (Lago de Fuego, Vol. I)

Next.js 16 · React 19 · TypeScript · Tailwind v4 · Motion. Compatible con Vercel (`vercel deploy`, sin configuración).

```bash
npm install
npm run dev      # desarrollo
npm run build && npm start
npm run lint     # tsc --noEmit
```

## Publicar el sitio (Netlify, gratis) + www.andresrodrigueze.com

**Por qué Netlify y no Vercel:** Vercel es más simple de usar, pero su plan gratuito ("Hobby") prohíbe explícitamente el "uso comercial" — y eso incluye "anunciar la venta de un producto o servicio", que es justo lo que hace la sección de Ediciones. Con esto necesitarías el plan de pago (US$20/mes). Netlify no tiene esa restricción en su plan gratuito, soporta Next.js igual de bien (detecta el proyecto solo, corre `/api/subscribe` como función) y el dominio propio con HTTPS también es gratis. Por eso el repo trae `netlify.toml` en vez de config de Vercel.

### 1. Subir el código a GitHub
```
cd hela-site
git remote add origin https://github.com/TU_USUARIO/hela-site.git
git branch -M main
git push -u origin main
```
(Si no tienes repo creado: en github.com → "New repository" → sin README, sin licencia → copia la URL que te da y úsala arriba.)

### 2. Conectar Netlify
1. Crea cuenta en netlify.com (con tu cuenta de GitHub, es un clic).
2. "Add new site" → "Import an existing project" → GitHub → elige `hela-site`.
3. Netlify detecta Next.js solo. Deja el build command que trae `netlify.toml` (`npm run build`) y dale "Deploy".
4. Cuando termine, te da una URL tipo `algo-al-azar.netlify.app` — ábrela y confirma que el sitio carga.

### 3. Variables de entorno
En el sitio dentro de Netlify: **Site configuration → Environment variables** → agrega:
- `NEXT_PUBLIC_SITE_URL` = `https://www.andresrodrigueze.com`
- `NEXT_PUBLIC_INDEXABLE` = `true` (el día que quieras que Google indexe el sitio)
- `NEXT_PUBLIC_SHOW_PLACEHOLDERS` = `false` (cuando ya no haya nada provisional)
- `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` = `/api/subscribe`
- `BREVO_API_KEY` y `BREVO_LIST_ID` — ver sección de Brevo abajo

Después de agregarlas: **Deploys → Trigger deploy → Deploy site** (las variables no aplican hasta el siguiente deploy).

### 4. Conectar el dominio
1. **Site configuration → Domain management → Add a domain** → escribe `andresrodrigueze.com`.
2. Netlify te muestra los registros DNS exactos a crear en el sitio donde compraste el dominio (GoDaddy, Namecheap, etc.). Normalmente es un registro A para el dominio raíz y un CNAME para `www`. Sigue exactamente lo que te muestre esa pantalla — varía un poco según el registrador.
3. La propagación puede tardar de minutos a un par de horas. Netlify emite el certificado HTTPS solo, apenas detecta el DNS correcto.
4. En la misma pantalla, marca `www.andresrodrigueze.com` (o el dominio raíz, tú decides) como dominio principal; el otro queda redirigido automáticamente.

### 5. Brevo (email marketing)
Por qué Brevo y no MailerLite: MailerLite recortó su plan gratis a 250 contactos — se queda corto si TikTok empieza a traer suscriptores en serio. Brevo gratis da 300 correos/día y hasta 100.000 contactos guardados, con API incluida.

1. Crea cuenta en brevo.com (gratis).
2. **Contacts → Lists → Create a list**, por ejemplo "HELA — Lectores". Abre la lista: el número en la URL es tu `BREVO_LIST_ID`.
3. Ícono de engranaje (arriba a la derecha) → **SMTP & API → API Keys → Generate a new API key**. Cópiala una sola vez (no se vuelve a mostrar): es tu `BREVO_API_KEY`.
4. Pega ambos valores en las variables de entorno de Netlify (paso 3) y vuelve a desplegar.
5. Prueba: llena cualquiera de los tres formularios del sitio (primer capítulo, newsletter, ERIC) con un correo tuyo → debe aparecer en Brevo → Contacts en segundos.

El endpoint (`src/app/api/subscribe/route.ts`) ya trae:
- Validación de correo en servidor (no solo en el navegador).
- Un campo trampa oculto (`honeypot`): si un bot lo llena, el sitio le finge éxito sin gastar tu cupo de 300 correos/día en Brevo.
- Si el correo ya existe en la lista, lo actualiza en vez de marcar error.

Si con el tiempo el spam se vuelve un problema real, el siguiente paso (no implementado todavía) es añadir Cloudflare Turnstile — es gratis e invisible para el usuario.

## Assets
Los originales están en `assets-src/` (`hela-cover.png`, `eric-cover.png`, `andres-portrait.png`). `npm run assets:prepare` genera los JPG optimizados en `public/assets/` (el retrato se convierte a blanco y negro ahí mismo; el original a color se conserva).
- La portada de HELA original mide 624×992 px: el script la escala 2× con Lanczos, pero al expandirse en el hero se nota suave. Cuando tengas el archivo de alta resolución (el de KDP), reemplaza `assets-src/hela-cover.png` y corre el script.
- Para ajustar el blanco y negro del retrato edita el bloque `andres-portrait` de `scripts/prepare-assets.mjs`.

## Tipografía y rojo
- **HELA y ERIC**: son las letras de Arial Black de las portadas, trazadas a SVG (`src/components/brand/wordmarks.ts`, generado; no lo edites a mano). Arial Black es una fuente con licencia y no viene en los celulares, así que trazarla garantiza que se vea idéntica en todas partes. Se usan con `<Wordmark />` / `<WordmarkGlyph />`.
- **Títulos y etiquetas**: Josefin Sans (variable; la portada usa su peso ExtraLight). **Texto de lectura y citas**: Newsreader. Se cargan en `src/app/layout.tsx`.
- **Rojo** (`--color-ember` sobre oscuro, `--color-blood-deep` sobre papel, en `globals.css`): solo en puntos clave: 03:08, la barra de scroll, los guiones de sección, el punto final de los títulos (`redStop` en `MaskText`), el "5" del TOP 5, hover de botones y PRÓXIMAMENTE.
- La retícula de letras del lago (HELA/ERIC/LUCA/LENA) sigue en Josefin.

## Conversión y medición
- **Objeciones**: sección de preguntas frecuentes (`content/es.ts` → `faq`), con datos de páginas y capítulos tomados de `config/books.ts` y marcado `FAQPage` para buscadores. Revisa que las respuestas de contenido fuerte y de "para quién es" (menciona a Castillo, Coben y Patterson) sean lo que quieres decir.
- **Segunda puerta a la tienda** justo después del lago (`sections/BuyStrip.tsx`) y barra de compra fija en móvil (se oculta donde estorba: ediciones, formularios, lago).
- **Atribución**: `lib/analytics.ts` guarda por sesión `utm_*`, `ttclid`, `fbclid` y si el visitante llega desde el navegador de TikTok/Instagram/Facebook, y lo agrega a cada evento y al envío del formulario. En TikTok usa un enlace distinto por video: `https://tusitio.com/?utm_source=tiktok&utm_campaign=video-12`.
- **Eventos**: compra por formato y tienda, clic en hero, barra móvil, nav, franja, FAQ, primer capítulo, newsletter, compartir, privacidad, profundidad de scroll (25/50/75/100).
- **Formularios**: `POST { email, firstName, source, attribution, consent, consentAt }` a `NEXT_PUBLIC_NEWSLETTER_ENDPOINT`. Al éxito ofrecen comprar y compartir por WhatsApp.
- **Compartir**: `opengraph-image.jpg` y `twitter-image.jpg` (1200×630) en `src/app/`, íconos en `icon.png` y `apple-icon.png`. Se generaron a partir de la portada; reemplázalos si cambia.
- **Privacidad**: ventana con política y aviso legal (`content/es.ts` → `privacy`), redactada bajo la Ley 1581 de 2012. Es un borrador razonable, no asesoría legal: revísala con un abogado y pon el correo de contacto en `config/site.ts`.
- **Nada provisional a la vista**: precio e ISBN solo aparecen cuando existen; las reseñas solo aparecen cuando agregas una real (`config/testimonials.ts`); la franja de videos de TikTok solo aparece cuando agregas videos reales (`config/social.ts`). Los números de sección se recalculan solos.

## Dónde se edita cada cosa
| Qué | Archivo |
|---|---|
| Copy en español (todo el texto, FAQ y política de privacidad) | `src/content/es.ts` |
| Enlaces de compra, precios, ISBN, formatos | `src/config/retailers.ts` |
| Stats de TikTok y videos (la franja aparece con el primero) | `src/config/social.ts` |
| Reseñas de lectores (la sección aparece con la primera) | `src/config/testimonials.ts` |
| Libros y reconocimientos | `src/config/books.ts` |
| URL, autor, flags globales | `src/config/site.ts` |

## Checklist de lanzamiento
1. Reemplazar los enlaces `example.com/?placeholder=…` en `retailers.ts` (Amazon/Buscalibre × Kindle/Tapa blanda/Tapa dura). Para Kobo o Apple Books: agrega el retailer y pon `enabled: true`.
2. Precios e ISBN: hoy `null`; no se muestran hasta que existan.
3. Variables de entorno (ver `.env.example`): `SITE_URL`, `INDEXABLE=true`, `SHOW_PLACEHOLDERS=false`, `NEWSLETTER_ENDPOINT`.
4. Stats de TikTok, Instagram y Facebook (`social.ts`): vienen del dossier v2; actualízalos con las cifras vigentes y la fecha (`asOf`).
5. Reseñas reales en `testimonials.ts` (vacío = se muestran 3 espacios marcados).
6. Instagram, Goodreads, Facebook, Privacidad y Aviso legal siguen como placeholders.
7. El Sigil es un vegvísir redibujado, aproximado al de la portada. Si tienes el vector original, reemplaza `src/components/brand/Sigil.tsx`.
8. Analítica: `src/lib/analytics.ts` publica en `dataLayer`, `gtag` y `plausible` si existen; añade el script que uses.
