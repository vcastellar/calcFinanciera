# CalcFinanciera

Base de una web de **calculadoras financieras**, sencilla y transparente.
Sin frameworks ni paso de compilación: HTML, CSS y JavaScript (módulos ES).

## Calculadoras incluidas

- **Interés compuesto** — valor futuro de un ahorro con aportaciones periódicas.
- **Cuota de préstamo** — cuota mensual e intereses (sistema de amortización francés).

## Estructura

```
index.html              Página principal con los formularios
assets/
  css/styles.css        Estilos
  js/finance.js         Núcleo de cálculo (funciones puras, testeables)
  js/format.js          Formato de moneda
  js/app.js             Conexión formularios ↔ cálculo
scripts/serve.js        Servidor estático para desarrollo
test/finance.test.js    Tests del núcleo de cálculo
```

## Desarrollo

Requiere Node.js 18+ (solo para el servidor de desarrollo y los tests; la web
funciona abriendo `index.html` directamente en el navegador).

```bash
npm run dev     # servidor local en http://localhost:3000
npm test        # ejecuta los tests (node --test)
```

## Extender

Cada nueva calculadora se añade en tres pasos:

1. Añade la función de cálculo en `assets/js/finance.js` (pura, sin DOM).
2. Añade su test en `test/finance.test.js`.
3. Añade el formulario en `index.html` y conéctalo en `assets/js/app.js`.

## Aviso

Los resultados son orientativos y no constituyen asesoramiento financiero.
