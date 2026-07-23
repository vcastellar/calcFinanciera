/**
 * Utilidades de formato para mostrar cantidades en la interfaz.
 */

const formateadorEuro = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Formatea un número como moneda en euros (locale español).
 * @param {number} valor
 * @returns {string}
 */
export function formatoEuro(valor) {
  if (!Number.isFinite(valor)) return '—';
  return formateadorEuro.format(valor);
}
