# Diagrama de base de datos

```mermaid
erDiagram
    USUARIO ||--o{ VENTA : registra
    USUARIO ||--o{ MOVIMIENTO_INVENTARIO : registra
    CATEGORIA ||--o{ PRODUCTO : clasifica
    PROVEEDOR ||--o{ PRODUCTO : suministra
    PRODUCTO ||--o{ MOVIMIENTO_INVENTARIO : genera
    VENTA ||--|{ DETALLE_VENTA : contiene
    PRODUCTO ||--o{ DETALLE_VENTA : vendido

    USUARIO {
        ObjectId id PK
        string nombre
        string email UK
        string passwordHash
        string rol
        boolean activo
    }
    CATEGORIA {
        ObjectId id PK
        string nombre UK
        string descripcion
    }
    PROVEEDOR {
        ObjectId id PK
        string nombre
        string contacto
        string telefono
        string email
    }
    PRODUCTO {
        ObjectId id PK
        string nombre
        string sku UK
        number precio
        number stock
        number stockMinimo
        boolean activo
        ObjectId categoria FK
        ObjectId proveedor FK
    }
    MOVIMIENTO_INVENTARIO {
        ObjectId id PK
        ObjectId producto FK
        ObjectId registradoPor FK
        string tipo
        number cantidad
        string motivo
        number stockAnterior
        number stockNuevo
    }
    VENTA {
        ObjectId id PK
        ObjectId registradaPor FK
        number total
        date createdAt
    }
    DETALLE_VENTA {
        ObjectId producto FK
        number cantidad
        number precioUnitario
        number subtotal
    }
```

Los detalles se guardan dentro del documento de venta; se separan en el diagrama para mostrar su relación con productos. Mongoose agrega `createdAt` y `updatedAt` a las colecciones.
