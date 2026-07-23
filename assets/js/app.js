/**
 * Lógica de interfaz: conecta los formularios con el núcleo de cálculo.
 */
import { interesCompuesto, cuotaPrestamo } from './finance.js';
import { formatoEuro } from './format.js';

/** Lee el valor numérico de un input por su id. */
function num(id) {
  const el = document.getElementById(id);
  return el ? parseFloat(el.value) : NaN;
}

/** Escribe un resultado de tipo "clave: valor" en un contenedor. */
function pintarResultado(contenedorId, filas) {
  const cont = document.getElementById(contenedorId);
  if (!cont) return;
  cont.innerHTML = filas
    .map(
      ([etiqueta, valor, destacado]) => `
        <div class="resultado__fila${destacado ? ' resultado__fila--destacado' : ''}">
          <span class="resultado__etiqueta">${etiqueta}</span>
          <span class="resultado__valor">${valor}</span>
        </div>`
    )
    .join('');
  cont.hidden = false;
}

// --- Calculadora de interés compuesto ---------------------------------------
const formInteres = document.getElementById('form-interes');
if (formInteres) {
  formInteres.addEventListener('submit', (e) => {
    e.preventDefault();
    const { valorFinal, totalAportado, interesesGanados } = interesCompuesto({
      capitalInicial: num('ic-capital'),
      aportacionPeriodica: num('ic-aportacion'),
      tasaAnualPct: num('ic-tasa'),
      anios: num('ic-anios'),
      periodosPorAnio: 12,
    });
    pintarResultado('resultado-interes', [
      ['Total aportado', formatoEuro(totalAportado)],
      ['Intereses ganados', formatoEuro(interesesGanados)],
      ['Valor final', formatoEuro(valorFinal), true],
    ]);
  });
}

// --- Calculadora de cuota de préstamo ---------------------------------------
const formPrestamo = document.getElementById('form-prestamo');
if (formPrestamo) {
  formPrestamo.addEventListener('submit', (e) => {
    e.preventDefault();
    const { cuota, totalPagado, totalIntereses } = cuotaPrestamo({
      importe: num('cp-importe'),
      tasaAnualPct: num('cp-tasa'),
      meses: num('cp-meses'),
    });
    pintarResultado('resultado-prestamo', [
      ['Total intereses', formatoEuro(totalIntereses)],
      ['Total a pagar', formatoEuro(totalPagado)],
      ['Cuota mensual', formatoEuro(cuota), true],
    ]);
  });
}
