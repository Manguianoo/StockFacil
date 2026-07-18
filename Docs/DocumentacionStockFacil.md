# Documentación técnica de StockFácil

## Alcance actual

La aplicación cubre el flujo básico de un inventario: alta de catálogos, movimientos de mercancía, ventas, reportes y control de usuarios. La API y la interfaz web se sirven desde el mismo proceso de Express.

## Organización del proyecto

```text
public/                 interfaz web
src/
  config/               conexión a MongoDB y Socket.IO
  controllers/          reglas de cada recurso
  middlewares/          autenticación y manejo de errores
  models/               esquemas de Mongoose
  routes/               rutas de Express
  services/             JWT, correo, sockets y alertas
  __tests__/            pruebas de integración y demo avanzada
```

`src/index.ts` conecta la base de datos, crea el servidor HTTP y monta Socket.IO. `src/app.ts` prepara Express y puede utilizarse por separado en las pruebas. La lógica compartida de autenticación está en `src/services/authService.ts`, por lo que HTTP y sockets validan los tokens de la misma manera.

## Autenticación y permisos

Las contraseñas se guardan con bcrypt. Al iniciar sesión se entrega un JWT con vigencia de ocho horas. El middleware busca el encabezado `Authorization` y carga al usuario activo antes de permitir el acceso.

La primera cuenta del sistema recibe el rol `administrador`. Después de ese registro, solo un administrador puede crear cuentas adicionales.

| Acción                               | Administrador | Operador |
| ------------------------------------ | :-----------: | :------: |
| Consultar productos y catálogos      |      Sí       |    Sí    |
| Registrar entradas, salidas y ventas |      Sí       |    Sí    |
| Crear, editar o eliminar catálogos   |      Sí       |    No    |
| Consultar y enviar reportes          |      Sí       |    No    |
| Crear usuarios                       |      Sí       |    No    |

La recuperación de contraseña genera un token aleatorio. En la base de datos solo se conserva su hash y caduca a los 30 minutos.

## Correos

Nodemailer usa las variables `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS` y `EMAIL_FROM`. Si SMTP no está configurado, el servidor sigue funcionando y registra que el mensaje fue omitido.

Los correos se usan en estos casos:

- bienvenida al crear una cuenta;
- enlace para restablecer la contraseña;
- aviso de stock bajo para administradores;
- resumen de ventas e inventario solicitado desde Reportes.

Las notificaciones automáticas se envían sin bloquear la respuesta HTTP. El endpoint de reporte sí espera el resultado y devuelve `503` cuando no existe una configuración SMTP.

## Comunicación en tiempo real

Socket.IO comparte el servidor HTTP de Express. Cada cliente manda el JWT en `handshake.auth.token`; una cuenta inexistente, inactiva o con token inválido no puede conectarse.

| Evento                   | Momento en que se emite                   |
| ------------------------ | ----------------------------------------- |
| `producto:creado`        | Después de guardar un producto            |
| `producto:actualizado`   | Después de editar un producto             |
| `inventario:actualizado` | Al confirmar una entrada o salida         |
| `venta:registrada`       | Al confirmar una venta                    |
| `stock:bajo`             | Cuando una operación deja stock en mínimo |

La interfaz escucha estos eventos y vuelve a consultar los datos. Esto evita mantener dos implementaciones distintas de las reglas del inventario en cliente y servidor.

## Consistencia de inventario

Las salidas y ventas validan que exista stock suficiente. MongoDB ejecuta la actualización del producto, el movimiento y la venta dentro de una transacción. Por esa razón se requiere un replica set o MongoDB Atlas.

Una venta toma el precio guardado en el producto, calcula los subtotales, descuenta existencias y genera un movimiento por cada producto. Si cualquier escritura falla, MongoDB revierte el conjunto completo.

## Errores y validación

Los controladores validan campos obligatorios y relaciones antes de escribir. Los esquemas aplican longitudes, valores mínimos, listas permitidas e índices únicos. El middleware de errores convierte los problemas conocidos en respuestas JSON:

- `400`: datos o identificadores inválidos;
- `401`: falta autenticación;
- `403`: el rol no tiene permiso;
- `404`: recurso inexistente;
- `409`: duplicado, dependencia o stock insuficiente;
- `500`: error no controlado;
- `503`: correo solicitado sin SMTP disponible.

## Pruebas

`crud.test.ts` comprueba categorías, productos, inventario, ventas, validaciones y permisos. `advanced.test.ts` levanta servicios locales temporales y demuestra:

1. conexión de Socket.IO con JWT;
2. rechazo de un socket sin token;
3. recepción del evento `producto:creado`;
4. envío de un mensaje a un servidor SMTP de prueba.

```bash
npm test -- --runInBand
npm run demo:advanced
```

Las pruebas usan una base MongoDB temporal en modo replica set y no modifican los datos del entorno de desarrollo.

## Aspectos pendientes para producción

- El token del navegador se conserva en `localStorage`; una versión pública debería evaluar cookies `httpOnly` y protección CSRF.
- Los eventos se transmiten a todos los usuarios conectados. Si el sistema maneja varios negocios, se necesitan salas separadas por negocio.
- Los correos automáticos no tienen cola ni reintentos persistentes.
- Falta agregar rate limiting para login y recuperación de contraseña.
