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

## Base de datos

El proyecto utilizará **MongoDB** como base de datos principal. La información de productos, categorías, proveedores, inventario, ventas, reportes y usuarios se almacenará en colecciones documentales.

MongoDB se eligió porque permite manejar estructuras flexibles, facilita el crecimiento del sistema y se adapta bien a un inventario donde los productos pueden tener datos variables según el giro del negocio.

## Aplicación web, autenticación y permisos

Al abrir `http://localhost:3000` se muestra la interfaz web de StockFácil. La primera cuenta registrada se convierte en administradora; a partir de ese momento solo un administrador puede crear usuarios adicionales.

- **Administrador**: gestiona usuarios, productos, categorías, proveedores, inventario, ventas y reportes.
- **Usuario operativo**: consulta productos y registra movimientos de inventario y ventas.

Las contraseñas se almacenan con hash `bcrypt`, la API utiliza JWT Bearer y la recuperación de contraseña usa enlaces de un solo uso con vigencia de 30 minutos.

## Envío de correos

Al configurar SMTP, el sistema envía:

- Bienvenida para usuarios registrados.
- Recuperación de contraseña.
- Resúmenes de inventario y ventas solicitados desde la interfaz.
- Notificaciones de productos con bajo stock.
- Avisos relacionados con faltantes o movimientos relevantes del inventario.

Estas notificaciones permitirán que los administradores reaccionen con mayor rapidez ante situaciones importantes del negocio.

## Comunicación en tiempo real

StockFácil usa Socket.IO autenticado con JWT para reflejar productos, existencias, ventas y alertas sin recargar la página.

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
- MongoDB v7 o superior en modo replica set (o MongoDB Atlas)

## Instalación y ejecución

```bash
npm install
cp .env.example .env
npm run dev
```

Configure `MONGODB_URI` y cambie `JWT_SECRET` en `.env`. Las transacciones de ventas e inventario requieren MongoDB Atlas o un replica set local; esto evita dejar existencias parcialmente actualizadas. La aplicación y la API estarán disponibles en `http://localhost:3000`.

SMTP es opcional para ejecutar el sistema. Para enviar mensajes reales configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` y `EMAIL_FROM`.

## API REST implementada

| Recurso        | Operaciones                                            |
| -------------- | ------------------------------------------------------ |
| `/categorias`  | GET, GET `/:id`, POST, PUT `/:id`, DELETE `/:id`       |
| `/proveedores` | GET, GET `/:id`, POST, PUT `/:id`, DELETE `/:id`       |
| `/productos`   | GET, GET `/:id`, POST, PUT `/:id`, DELETE `/:id`       |
| `/inventario`  | GET, GET `/:id`, POST `/entrada`, POST `/salida`       |
| `/ventas`      | GET, GET `/:id`, POST                                  |
| `/reportes`    | GET `/stock-bajo`, `/ventas`, `/inventario`            |
| `/auth`        | Registro inicial, login, usuario actual y recuperación |

Las rutas de negocio requieren `Authorization: Bearer <token>`. `POST /reportes/email` envía el resumen al administrador autenticado. Los eventos Socket.IO disponibles son `producto:creado`, `producto:actualizado`, `inventario:actualizado`, `venta:registrada` y `stock:bajo`.

Todas las respuestas son JSON. Los errores usan códigos HTTP `400`, `404`, `409` y `500` según corresponda.

### Demo rápida del CRUD

```bash
# Crear categoría
curl -X POST http://localhost:3000/categorias -H 'Content-Type: application/json' \
  -d '{"nombre":"Bebidas","descripcion":"Bebidas y refrescos"}'

# Copiar el _id de la respuesta en CATEGORIA_ID y crear producto
curl -X POST http://localhost:3000/productos -H 'Content-Type: application/json' \
  -d '{"nombre":"Agua 1L","sku":"AGUA-001","precio":18,"stock":20,"stockMinimo":5,"categoria":"CATEGORIA_ID"}'

curl http://localhost:3000/productos
curl -X PUT http://localhost:3000/productos/PRODUCTO_ID -H 'Content-Type: application/json' -d '{"precio":19}'
curl -X DELETE http://localhost:3000/productos/PRODUCTO_ID
```

El [diagrama de base de datos](Docs/DiagramaBaseDatos.md), la [evidencia del equipo](Docs/EvidenciaEquipo.md) y la [documentación técnica](Docs/DocumentacionStockFacil.md) completan la entrega.

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
