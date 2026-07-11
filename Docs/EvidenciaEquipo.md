# Evidencia del trabajo del equipo

## Integrantes identificados en Git

| Integrante      | Evidencia                                                                                      |
| --------------- | ---------------------------------------------------------------------------------------------- |
| Manguianoo      | Creació la estructura inicial, README, archivo de entorno y documentación del proyecto.        |
| Daniel Gonzalez | Actualizó documentación e implementó conexión, modelos, CRUD, validaciones, errores y pruebas. |

La evidencia verificable se encuentra en el historial del repositorio:

```bash
git log --format="%h | %an | %ad | %s" --date=short
```

## Comprobación técnica

```bash
npm install
npm run build
npm run lint
npm test -- --runInBand
```

Las pruebas automatizadas levantan una instancia temporal de MongoDB y demuestran: CRUD de categorías, alta de productos, entradas/salidas, validaciones, manejo de stock insuficiente y registro de ventas.
