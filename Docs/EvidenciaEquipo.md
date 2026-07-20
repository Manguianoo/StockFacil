# Evidencia del trabajo del equipo

Este documento resume lo que se puede comprobar en Git. No se asignan actividades que no aparezcan en el historial del repositorio.

## Distribución observada

| Integrante      | Trabajo identificable en los commits                                                                                |
| --------------- | ------------------------------------------------------------------------------------------------------------------- |
| Manguianoo      | Creó el repositorio, la estructura inicial, el archivo de entorno y las primeras versiones del README y documentos. |
| Daniel Gonzalez | Actualizó la documentación e implementó MongoDB, CRUD, pruebas, autenticación, interfaz, correo y Socket.IO.        |

La captura del tablero entregada por el equipo se conserva en [TableroJira.png](TableroJira.png). El historial de Git es la referencia utilizada para relacionar cambios con autores.

## Commits principales

| Commit    | Autor           | Fecha      | Cambio registrado                             |
| --------- | --------------- | ---------- | --------------------------------------------- |
| `8fbb6ae` | Manguianoo      | 2026-07-02 | Estructura inicial                            |
| `d63f563` | Manguianoo      | 2026-07-02 | Archivo de configuración de ejemplo           |
| `976ccfc` | Manguianoo      | 2026-07-02 | Documentación inicial                         |
| `3217bee` | Daniel Gonzalez | 2026-07-02 | Actualización de documentación                |
| `3ce60c5` | Daniel Gonzalez | 2026-07-11 | API CRUD con MongoDB                          |
| `019c87b` | Daniel Gonzalez | 2026-07-16 | Autenticación, funciones avanzadas e interfaz |
| `465f941` | Daniel Gonzalez | 2026-07-18 | Demo automatizada de correo y sockets         |

Los datos pueden comprobarse con:

```bash
git log --format="%h | %an | %ad | %s" --date=short
git shortlog -sne --all
git show --stat COMMIT
```

## Comprobación de la entrega

```bash
npm install
npm run build
npm run lint
npm run format:check
npm test -- --runInBand
npm run demo:advanced
```

Las pruebas generales cubren CRUD, inventario, ventas, validaciones y permisos. La demo avanzada comprueba el correo SMTP y la comunicación Socket.IO con y sin autenticación.

## Archivos de evidencia

- `Docs/TableroJira.png`: captura del tablero del equipo.
- `Docs/DiagramaER_EQ3.jpg`: diagrama entregado por el equipo.
- `Docs/DiagramaBaseDatos.md`: versión del modelo que corresponde al código actual.
- `src/__tests__/crud.test.ts`: evidencia automatizada del CRUD y permisos.
- `src/__tests__/advanced.test.ts`: evidencia automatizada de correo y sockets.
- `src/__tests__/unit/validation.test.ts`: evidencia de pruebas unitarias aisladas.
- `render.yaml`: configuracion reproducible de despliegue y health check.
