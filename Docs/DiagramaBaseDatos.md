# Diagrama de base de datos

```mermaid
erDiagram
    CATEGORIA ||--o{ PRODUCTO : clasifica
    PROVEEDOR ||--o{ PRODUCTO : suministra
    PRODUCTO ||--o{ MOVIMIENTO_INVENTARIO : registra
    VENTA ||--|{ DETALLE_VENTA : contiene
    PRODUCTO ||--o{ DETALLE_VENTA : vendido

    CATEGORIA { ObjectId id PK string nombre string descripcion }
    PROVEEDOR { ObjectId id PK string nombre string contacto string telefono string email }
    PRODUCTO { ObjectId id PK string nombre string sku UK number precio number stock number stockMinimo boolean activo ObjectId categoria FK ObjectId proveedor FK }
    MOVIMIENTO_INVENTARIO { ObjectId id PK ObjectId producto FK string tipo number cantidad string motivo number stockAnterior number stockNuevo }
    VENTA { ObjectId id PK number total date createdAt }
    DETALLE_VENTA { ObjectId producto FK number cantidad number precioUnitario number subtotal }
```

MongoDB almacena cada detalle dentro del documento `Venta`; se muestra como entidad separada para explicar la relación lógica. Todas las colecciones incluyen `createdAt` y `updatedAt` automáticos.
