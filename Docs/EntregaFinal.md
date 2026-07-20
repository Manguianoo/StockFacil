# Entrega final de StockFacil

## Resumen ejecutivo

StockFacil es una aplicacion web para que comercios pequenos controlen productos, existencias y ventas desde un solo lugar. El sistema combina una interfaz adaptable, una API REST en TypeScript, persistencia en MongoDB, autenticacion por roles, notificaciones por correo y actualizaciones en tiempo real.

## Cumplimiento de la entrega

| Requisito              | Evidencia                                                                                                            |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Corregir errores       | Validacion de rangos de fecha, cierre controlado del servidor, sanitizacion de contenido visible y endpoint de salud |
| Pulir funcionalidad    | Interfaz por roles, reportes, recuperacion de contrasena, alertas de stock y actualizaciones Socket.IO               |
| Pruebas unitarias      | `src/__tests__/unit/validation.test.ts`                                                                              |
| Pruebas de integracion | `src/__tests__/crud.test.ts` y `src/__tests__/advanced.test.ts`                                                      |
| Preparar despliegue    | `render.yaml`, `engines.node`, `GET /health` y variables en `.env.example`                                           |
| Documentacion final    | Este documento, README, documentacion tecnica, diagrama, evidencia y guion de demo                                   |
| Demo completa          | `Docs/GuionDemoFinal.md` y demo automatizada `npm run demo:advanced`                                                 |
| Presentacion final     | `Docs/PresentacionFinalStockFacil.pptx` y su version PDF                                                             |

## Arquitectura

```text
Navegador
  |-- HTML, CSS y JavaScript
  |-- REST + JWT
  `-- Socket.IO
          |
Servidor Node.js + Express + TypeScript
  |-- rutas y middlewares
  |-- controladores y reglas de negocio
  |-- servicios de correo y tiempo real
  `-- modelos Mongoose
          |
MongoDB replica set / MongoDB Atlas
```

La API y la interfaz se publican desde el mismo servicio. Las entradas, salidas y ventas usan transacciones para que el stock y sus movimientos permanezcan consistentes.

## Funcionalidades terminadas

- registro inicial del administrador, inicio de sesion y usuarios operativos;
- permisos diferenciados para administrador y operativo;
- CRUD de categorias, proveedores y productos;
- entradas y salidas con validacion de stock;
- ventas con calculo de total y descuento transaccional de existencias;
- reportes de ventas, inventario y stock bajo;
- avisos de stock bajo y reportes por correo;
- eventos en tiempo real para productos, inventario y ventas;
- interfaz web adaptable a escritorio y dispositivos moviles;
- recuperacion de contrasena con token temporal;
- respuestas de error uniformes y validacion de identificadores y datos.

## Instalacion y ejecucion local

Requisitos: Node.js 20, npm y MongoDB en replica set.

```bash
npm ci
cp .env.example .env
npm run build
npm start
```

Variables obligatorias:

- `MONGODB_URI`: cadena de conexion a MongoDB Atlas o replica set;
- `JWT_SECRET`: secreto largo y aleatorio;
- `APP_URL`: URL publica de la aplicacion.

Las variables SMTP son opcionales para inventario y ventas, pero son necesarias para correos reales.

## Despliegue en Render

El archivo `render.yaml` define un Web Service con Node 20, compilacion, arranque y health check.

1. Crear un cluster de MongoDB Atlas y permitir conexiones desde Render.
2. En Render, crear un Blueprint a partir del repositorio.
3. Capturar `MONGODB_URI` y `APP_URL`; Render genera `JWT_SECRET`.
4. Agregar las variables SMTP si se demostrara correo real.
5. Confirmar que `GET /health` responda `200` con `database: connected`.
6. Abrir la URL publica y crear la primera cuenta administradora.

No se deben subir secretos al repositorio. El valor de `APP_URL` debe cambiarse a la URL HTTPS final antes de probar recuperacion de contrasena.

## Pruebas y calidad

```bash
npm run test:unit
npm run test:integration
npm run build
npm run lint
npm run format:check
npm test -- --runInBand
```

Las pruebas unitarias verifican campos obligatorios, actualizaciones vacias y fechas. Las pruebas de integracion levantan MongoDB temporal y comprueban CRUD, inventario, ventas, JWT, roles, health check, Socket.IO y SMTP.

## Seguridad aplicada

- contrasenas con bcrypt y JWT con expiracion;
- hash del token de recuperacion y caducidad de 30 minutos;
- autorizacion por roles en el servidor;
- secretos exclusivamente por variables de entorno;
- sanitizacion del contenido que se inserta en tablas y listas del navegador;
- cabeceras CSP, HSTS en produccion, anti-iframe y `nosniff`;
- mensajes de autenticacion que no revelan si existe un correo.

Pendientes recomendados para una version comercial: rate limiting, cookies `httpOnly`, auditoria persistente, cola de correos, respaldos automatizados y separacion por negocio.

## Evidencia y documentos relacionados

- [Documentacion tecnica](DocumentacionStockFacil.md)
- [Diagrama de base de datos](DiagramaBaseDatos.md)
- [Evidencia del equipo](EvidenciaEquipo.md)
- [Demo de funciones avanzadas](DemoFuncionalidadesAvanzadas.md)
- [Guion de demo final](GuionDemoFinal.md)
