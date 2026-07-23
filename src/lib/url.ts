const base = import.meta.env.BASE_URL;

/** Prefija una ruta interna con el `base` configurado en Astro (p. ej. /calcFinanciera/). */
export function withBase(path: string): string {
  return base.replace(/\/$/, '') + '/' + path.replace(/^\//, '');
}
