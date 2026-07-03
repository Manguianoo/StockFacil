# StockFácil 

Sistema web para la administración de inventario en microempresas como tiendas de abarrotes, papelerías, misceláneas y pequeños comercios familiares.

## Descripción

StockFácil permite registrar productos, controlar entradas y salidas de mercancía, consultar existencias, detectar productos con bajo stock y registrar ventas básicas. Es una alternativa accesible para negocios que actualmente dependen de libretas, hojas de cálculo o conteos manuales.

## Tecnologías

- **Node.js** — entorno de ejecución
- **TypeScript** — lenguaje principal
- **Express 5** — framework para el servidor
- **MongoDB** — base de datos
- **ESLint** — linter
- **Prettier** — formato de código
- **Jest** — pruebas

## Requisitos previos

- Node.js v18 o superior
- npm v9 o superior

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor en modo desarrollo con recarga automática |
| `npm run build` | Compila el proyecto TypeScript a JavaScript |
| `npm run build:clean` | Limpia la carpeta `dist/` y compila de nuevo |
| `npm start` | Inicia el servidor en modo producción |
| `npm run lint` | Revisa el código con ESLint |
| `npm run lint:fix` | Corrige automáticamente los errores de ESLint |
| `npm run format` | Formatea el código con Prettier |
| `npm run format:check` | Verifica el formato sin modificar archivos |
| `npm test` | Corre las pruebas |

