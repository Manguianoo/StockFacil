# Guion de demo final de StockFacil

Duracion sugerida: 7 a 9 minutos. Grabar a 1080p y ocultar favoritos, notificaciones y valores secretos.

## Preparacion

1. Confirmar que la URL publica y `/health` respondan correctamente.
2. Tener listas una cuenta administradora y una operativa.
3. Crear una categoria `Bebidas` y dejar abierto el formulario de producto.
4. Abrir una segunda ventana o perfil con la cuenta operativa.
5. Verificar que no aparezcan secretos, cadenas de conexion ni paneles del proveedor.

## Recorrido

### 1. Problema y propuesta — 45 segundos

Explicar que los comercios pequenos suelen registrar inventario en hojas o libretas, lo cual provoca diferencias de stock y poca visibilidad. Presentar StockFacil como un control centralizado de productos, movimientos y ventas.

### 2. Acceso y roles — 60 segundos

- Iniciar sesion como administrador.
- Mostrar el nombre, rol y estado de tiempo real.
- Entrar a Usuarios y explicar que el administrador crea cuentas.
- Cambiar brevemente a la sesion operativa y mostrar que Reportes, Usuarios y altas de catalogos no aparecen.

### 3. Producto e inventario — 90 segundos

- Crear `Agua mineral 600 ml`, SKU `AGUA-600`, precio `$18`, stock `12` y minimo `5`.
- Mostrar que aparece en Productos y en el resumen.
- Registrar una entrada de 8 unidades con motivo `Compra a proveedor`.
- Mostrar el historial y el cambio de 12 a 20.

### 4. Venta y consistencia — 90 segundos

- Desde la cuenta operativa registrar una venta de 3 unidades.
- Mostrar que la venta totaliza `$54` y el stock baja a 17.
- Regresar a la sesion administradora y señalar que se actualizo sin recargar gracias a Socket.IO.
- Intentar una salida mayor al stock y mostrar el mensaje `Stock insuficiente`.

### 5. Alertas y reportes — 75 segundos

- Crear o ajustar un producto para que alcance su stock minimo.
- Registrar una salida y mostrar la alerta de stock bajo en el resumen.
- Entrar a Reportes y mostrar cantidad de ventas, ingresos y movimientos.
- Si SMTP esta configurado, enviar el resumen al correo del administrador.

### 6. Calidad tecnica — 60 segundos

Mostrar una terminal con:

```bash
npm run test:unit
npm test -- --runInBand
```

Explicar que las pruebas cubren validaciones puras, CRUD, permisos, transacciones, health check, tiempo real y correo con servicios temporales.

### 7. Despliegue y cierre — 45 segundos

- Abrir `/health` en la URL publica y mostrar `status: ok`.
- Resumir la arquitectura: navegador, Express/TypeScript y MongoDB Atlas.
- Cerrar con el beneficio: decisiones de inventario con datos actuales y menos errores manuales.

## Lista de verificacion antes de entregar el video

- [ ] El texto es legible y el cursor no tapa datos importantes.
- [ ] Se ve la URL publica al menos una vez.
- [ ] Se muestran administrador y operativo.
- [ ] Se demuestra una validacion fallida.
- [ ] Se demuestra el cambio de stock despues de una venta.
- [ ] Se muestran reportes, pruebas y health check.
- [ ] No aparecen contrasenas, tokens ni variables de entorno.
