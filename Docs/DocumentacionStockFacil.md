# StockFácil

Sistema web para la administración de inventario en microempresas como tiendas de abarrotes, papelerías, misceláneas y pequeños comercios familiares.

## Descripción

StockFácil permite registrar productos, controlar entradas y salidas de mercancía, consultar existencias, detectar productos con bajo stock y registrar ventas básicas. Es una alternativa accesible para negocios que actualmente dependen de libretas, hojas de cálculo o conteos manuales.

La solución estará orientada a microempresas que necesitan una herramienta sencilla, rápida y de bajo costo para operar su inventario diario sin requerir infraestructura compleja.

## Tecnologías

- **Node.js** — entorno de ejecución
- **TypeScript** — lenguaje principal
- **Express 5** — framework para el servidor
- **MongoDB** — base de datos
- **ESLint** — linter
- **Prettier** — formato de código
- **Jest** — pruebas

## Estado de implementación

La aplicación ya cuenta con interfaz web adaptable, conexión MongoDB mediante Mongoose, modelos persistentes, CRUD, autenticación JWT, permisos por rol, correo SMTP opcional, actualizaciones con Socket.IO, validaciones, transacciones, manejo centralizado de errores y pruebas de integración.

### Arquitectura

- `src/config`: conexión y ciclo de vida de MongoDB.
- `src/models`: esquemas de categorías, proveedores, productos, movimientos y ventas.
- `src/controllers`: reglas del negocio y operaciones persistentes.
- `src/routes`: endpoints REST.
- `src/middlewares`: respuestas de errores y rutas inexistentes.
- `src/__tests__`: demo automatizada del CRUD con MongoDB temporal.
- `src/services`: correo, eventos en tiempo real y alertas de stock.
- `public`: interfaz web de administración y operación.

### Reglas y validaciones

- Los campos obligatorios se validan antes de escribir.
- SKU y nombre de categoría son únicos.
- Precios y existencias no aceptan números negativos.
- Categorías y proveedores referenciados deben existir.
- No se permiten salidas o ventas sin stock suficiente.
- Las ventas calculan el total desde el precio guardado del producto y descuentan inventario.
- No se elimina una categoría o proveedor que todavía tenga productos asociados.
- Identificadores inválidos, duplicados y recursos inexistentes producen respuestas HTTP consistentes.

## Base de datos

El proyecto utiliza **MongoDB** como base de datos principal. La información de productos, categorías, proveedores, inventario y ventas se almacena en colecciones documentales. Los reportes se calculan sobre esos datos.

MongoDB se eligió porque permite manejar estructuras flexibles, facilita el crecimiento del sistema y se adapta bien a un inventario donde los productos pueden tener datos variables según el giro del negocio.

## Roles y permisos

StockFácil aplica roles mediante tokens JWT y middleware de autorización:

- **Administrador**: podrá gestionar usuarios, productos, categorías, proveedores, inventario, ventas y reportes. También tendrá acceso a la configuración general del sistema.
- **Usuario operativo**: podrá consultar productos, registrar movimientos de inventario y capturar ventas, pero no podrá modificar configuraciones sensibles ni administrar usuarios.

Esta separación ayuda a proteger la información del negocio y evita que usuarios operativos realicen cambios administrativos por error.

## Envío de correos

El sistema envía correos mediante SMTP configurable para apoyar procesos importantes del negocio, como:

- Confirmación de usuarios registrados.
- Envío de reportes de inventario o ventas.
- Notificaciones de productos con bajo stock.
- Avisos relacionados con faltantes o movimientos relevantes del inventario.

Estas notificaciones permitirán que los administradores reaccionen con mayor rapidez ante situaciones importantes del negocio.

## Comunicación en tiempo real

StockFácil utiliza Socket.IO para reflejar cambios relevantes sin que el usuario tenga que recargar manualmente la página.

Esta funcionalidad será útil para actualizar existencias, mostrar alertas de bajo stock, registrar ventas recientes y mantener sincronizada la información cuando varias personas estén usando el sistema al mismo tiempo.

## Diferenciador competitivo

StockFácil se diferencia de otros sistemas de inventario porque está pensado específicamente para microempresas y pequeños comercios locales. A diferencia de soluciones más complejas o costosas, el sistema busca ofrecer:

- Interfaz sencilla para usuarios sin experiencia técnica.
- Funciones enfocadas en inventario, ventas básicas y alertas de stock.
- Bajo costo de implementación y operación.
- Roles claros para separar administración y operación.
- Notificaciones y reportes útiles para la toma de decisiones.
- Actualización en tiempo real para negocios con más de un usuario operativo.

El objetivo es que StockFácil sea una herramienta práctica para negocios que necesitan digitalizar su operación sin adoptar un sistema empresarial demasiado amplio o difícil de mantener.

## Requisitos previos

- Node.js v18 o superior
- npm v9 o superior

## Scripts

| Comando                | Descripción                                                  |
| ---------------------- | ------------------------------------------------------------ |
| `npm run dev`          | Inicia el servidor en modo desarrollo con recarga automática |
| `npm run build`        | Compila el proyecto TypeScript a JavaScript                  |
| `npm run build:clean`  | Limpia la carpeta `dist/` y compila de nuevo                 |
| `npm start`            | Inicia el servidor en modo producción                        |
| `npm run lint`         | Revisa el código con ESLint                                  |
| `npm run lint:fix`     | Corrige automáticamente los errores de ESLint                |
| `npm run format`       | Formatea el código con Prettier                              |
| `npm run format:check` | Verifica el formato sin modificar archivos                   |
| `npm test`             | Corre las pruebas                                            |
