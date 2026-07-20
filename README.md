# StockFácil

StockFácil es una aplicación de inventario para comercios pequeños. Permite administrar productos, registrar entradas y salidas, capturar ventas y consultar reportes desde una interfaz web.

## Funciones incluidas

- CRUD de productos, categorías y proveedores.
- Movimientos de inventario con validación de existencias.
- Registro de ventas y actualización de stock en una transacción.
- Inicio de sesión con JWT y permisos para administrador y operador.
- Recuperación de contraseña y notificaciones por correo mediante SMTP.
- Actualizaciones en tiempo real con Socket.IO.
- Reportes de ventas, inventario y productos con stock bajo.
- Interfaz web adaptable a computadora y celular.

## Tecnologías

- Node.js, TypeScript y Express 5
- MongoDB con Mongoose
- JWT y bcrypt
- Nodemailer
- Socket.IO
- Jest, Supertest y MongoDB Memory Server

## Preparación

Se necesita Node.js 18 o posterior y una instancia de MongoDB configurada como replica set. MongoDB Atlas también funciona.

```bash
npm install
cp .env.example .env
npm run dev
```

Antes de iniciar, se deben completar `MONGODB_URI` y `JWT_SECRET` en `.env`. Las variables SMTP son opcionales durante el desarrollo, pero se requieren para enviar correos reales.

La aplicación queda disponible en `http://localhost:3000`. La primera cuenta registrada recibe el rol de administrador. Las cuentas siguientes solo pueden ser creadas por un administrador.

## Scripts

| Comando                    | Uso                                                      |
| -------------------------- | -------------------------------------------------------- |
| `npm run dev`              | Inicia el proyecto con recarga automática                |
| `npm run build`            | Compila TypeScript en `dist`                             |
| `npm start`                | Ejecuta la versión compilada                             |
| `npm test`                 | Ejecuta todas las pruebas                                |
| `npm run test:unit`        | Ejecuta solo las pruebas unitarias puras                 |
| `npm run test:integration` | Ejecuta pruebas con API, MongoDB, sockets y SMTP         |
| `npm run demo:advanced`    | Demuestra correo, autenticación de sockets y tiempo real |
| `npm run lint`             | Revisa el código con ESLint                              |
| `npm run format:check`     | Comprueba el formato sin modificar archivos              |

## Rutas principales

| Recurso        | Operaciones                                          |
| -------------- | ---------------------------------------------------- |
| `/auth`        | Registro, login, sesión y recuperación de contraseña |
| `/categorias`  | Consulta y CRUD                                      |
| `/proveedores` | Consulta y CRUD                                      |
| `/productos`   | Consulta y CRUD                                      |
| `/inventario`  | Consulta, entrada y salida                           |
| `/ventas`      | Consulta y registro                                  |
| `/reportes`    | Stock bajo, ventas, inventario y envío por correo    |

Las rutas del negocio reciben el token en `Authorization: Bearer <token>`. Los permisos exactos y el flujo interno se explican en la [documentación técnica](Docs/DocumentacionStockFacil.md).

## Despliegue

El repositorio incluye `render.yaml` para desplegar la aplicacion como un Web Service. El servicio requiere `MONGODB_URI`, `APP_URL` y un `JWT_SECRET`; las variables SMTP son opcionales. El endpoint `GET /health` sirve como comprobacion de disponibilidad y conexion a la base de datos. Los pasos completos estan en la [entrega final](Docs/EntregaFinal.md).

## Documentos de la entrega

- [Demo de funcionalidades avanzadas](Docs/DemoFuncionalidadesAvanzadas.md)
- [Entrega final](Docs/EntregaFinal.md)
- [Guion de demo final](Docs/GuionDemoFinal.md)
- [Documentación técnica](Docs/DocumentacionStockFacil.md)
- [Evidencia del equipo](Docs/EvidenciaEquipo.md)
- [Diagrama de base de datos](Docs/DiagramaBaseDatos.md)
