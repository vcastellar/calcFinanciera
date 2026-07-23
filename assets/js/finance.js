/**
 * Núcleo de cálculo financiero.
 *
 * Funciones puras, sin dependencias y sin acceso al DOM, para poder
 * reutilizarlas tanto en el navegador como en los tests de Node.
 */

/**
 * Convierte una tasa de interés nominal anual (en %) a tasa periódica
 * (en tanto por uno) según el número de periodos por año.
 *
 * @param {number} tasaAnualPct - Tasa nominal anual en porcentaje. Ej: 5 = 5%.
 * @param {number} periodosPorAnio - Número de periodos por año. Ej: 12 = mensual.
 * @returns {number} Tasa periódica en tanto por uno.
 */
export function tasaPeriodica(tasaAnualPct, periodosPorAnio) {
  return tasaAnualPct / 100 / periodosPorAnio;
}

/**
 * Calcula el valor futuro de una inversión con capital inicial y
 * aportaciones periódicas constantes (interés compuesto).
 *
 * VF = P·(1+i)^n + A·((1+i)^n − 1) / i
 *
 * @param {object} params
 * @param {number} params.capitalInicial - Capital aportado al inicio.
 * @param {number} [params.aportacionPeriodica=0] - Aportación en cada periodo.
 * @param {number} params.tasaAnualPct - Tasa nominal anual en porcentaje.
 * @param {number} params.anios - Duración de la inversión en años.
 * @param {number} [params.periodosPorAnio=12] - Periodos por año (12 = mensual).
 * @returns {{ valorFinal: number, totalAportado: number, interesesGanados: number }}
 */
export function interesCompuesto({
  capitalInicial,
  aportacionPeriodica = 0,
  tasaAnualPct,
  anios,
  periodosPorAnio = 12,
}) {
  const i = tasaPeriodica(tasaAnualPct, periodosPorAnio);
  const n = Math.round(anios * periodosPorAnio);

  let valorFinal;
  if (i === 0) {
    valorFinal = capitalInicial + aportacionPeriodica * n;
  } else {
    const factor = Math.pow(1 + i, n);
    valorFinal = capitalInicial * factor + aportacionPeriodica * ((factor - 1) / i);
  }

  const totalAportado = capitalInicial + aportacionPeriodica * n;
  const interesesGanados = valorFinal - totalAportado;

  return {
    valorFinal,
    totalAportado,
    interesesGanados,
  };
}

/**
 * Calcula la cuota constante de un préstamo con sistema de amortización
 * francés (cuota fija).
 *
 * cuota = P·i / (1 − (1+i)^−n)
 *
 * @param {object} params
 * @param {number} params.importe - Importe (principal) del préstamo.
 * @param {number} params.tasaAnualPct - Tasa nominal anual en porcentaje.
 * @param {number} params.meses - Número total de mensualidades.
 * @returns {{ cuota: number, totalPagado: number, totalIntereses: number }}
 */
export function cuotaPrestamo({ importe, tasaAnualPct, meses }) {
  const i = tasaPeriodica(tasaAnualPct, 12);
  const n = Math.round(meses);

  let cuota;
  if (i === 0) {
    cuota = importe / n;
  } else {
    cuota = (importe * i) / (1 - Math.pow(1 + i, -n));
  }

  const totalPagado = cuota * n;
  const totalIntereses = totalPagado - importe;

  return {
    cuota,
    totalPagado,
    totalIntereses,
  };
}
