# Demo de funcionalidades avanzadas

Esta demo comprueba correo, sockets y autenticación sin depender de una cuenta externa ni modificar la base de desarrollo.

## Demo automatizada

```bash
npm install
npm run demo:advanced
```

Durante la ejecución se levantan una base MongoDB temporal, un servidor de StockFácil en un puerto disponible y un servidor SMTP local. La prueba realiza lo siguiente:

1. registra la primera cuenta administradora;
2. abre una conexión Socket.IO usando su JWT;
3. crea una categoría y un producto por la API;
4. comprueba que el cliente reciba `producto:creado`;
5. intenta conectar otro socket sin token y espera el rechazo;
6. envía un correo al servidor SMTP local y comprueba el destinatario y contenido.

El resultado esperado es:

```text
Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
```

## Recorrido manual en la interfaz

1. Copiar `.env.example` como `.env` y completar `MONGODB_URI` y `JWT_SECRET`.
2. Ejecutar `npm run dev` y abrir `http://localhost:3000`.
3. Crear la primera cuenta. Debe aparecer con rol de administrador.
4. Crear una categoría y un producto desde Productos.
5. Abrir otra sesión del navegador, iniciar con una cuenta operativa y registrar una salida.
6. Comprobar en la primera sesión que inventario y stock se actualicen sin recargar manualmente.
7. Intentar crear una categoría con la cuenta operativa. La API debe responder `403` y la interfaz no debe mostrar los controles administrativos.
8. Configurar SMTP y usar “Enviar resumen a mi correo” desde Reportes.

Para mostrar la alerta de stock bajo, se puede crear un producto con `stockMinimo` igual a su existencia y después registrar una salida. El administrador conectado recibe el evento y, si SMTP está configurado, también el correo.
