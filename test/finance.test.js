import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  tasaPeriodica,
  interesCompuesto,
  cuotaPrestamo,
} from '../assets/js/finance.js';

/** Aproximación con tolerancia para comparar decimales. */
function cerca(actual, esperado, tolerancia = 0.01) {
  assert.ok(
    Math.abs(actual - esperado) <= tolerancia,
    `Se esperaba ~${esperado} pero se obtuvo ${actual}`
  );
}

test('tasaPeriodica convierte anual a mensual en tanto por uno', () => {
  cerca(tasaPeriodica(12, 12), 0.01);
  cerca(tasaPeriodica(6, 12), 0.005);
});

test('interesCompuesto: sin interés suma capital y aportaciones', () => {
  const r = interesCompuesto({
    capitalInicial: 1000,
    aportacionPeriodica: 100,
    tasaAnualPct: 0,
    anios: 1,
  });
  cerca(r.valorFinal, 1000 + 100 * 12);
  cerca(r.totalAportado, 2200);
  cerca(r.interesesGanados, 0);
});

test('interesCompuesto: solo capital inicial capitaliza correctamente', () => {
  const r = interesCompuesto({
    capitalInicial: 1000,
    aportacionPeriodica: 0,
    tasaAnualPct: 12,
    anios: 1,
  });
  // 1000 * (1.01)^12 ≈ 1126.83
  cerca(r.valorFinal, 1126.83, 0.1);
});

test('cuotaPrestamo: cuota francesa conocida', () => {
  const r = cuotaPrestamo({ importe: 10000, tasaAnualPct: 6, meses: 12 });
  // Cuota mensual ≈ 860.66
  cerca(r.cuota, 860.66, 0.1);
  cerca(r.totalPagado, 860.66 * 12, 1);
  assert.ok(r.totalIntereses > 0);
});

test('cuotaPrestamo: sin interés reparte el importe en cuotas iguales', () => {
  const r = cuotaPrestamo({ importe: 12000, tasaAnualPct: 0, meses: 12 });
  cerca(r.cuota, 1000);
  cerca(r.totalIntereses, 0);
});
