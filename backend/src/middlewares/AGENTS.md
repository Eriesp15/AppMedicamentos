# AGENTS.md

## Propósito
Alojar funciones middleware de Express. Interceptan el ciclo de vida de la petición HTTP antes de llegar a los controladores finales para ejecutar validaciones, controles de seguridad y autenticación.

## Responsabilidades
- Inspeccionar las cabeceras HTTP de las peticiones (`headers`).
- Extraer y decodificar tokens Bearer para validar la identidad de los clientes (`requireAuth`).
- Adjuntar los datos del usuario verificado al objeto `req.user` para su uso posterior en los controladores.
- Detener el flujo de ejecución respondiendo `401 Unauthorized` si el token es inexistente o inválido.

## Archivos principales
| Archivo | Descripción |
|----------|-------------|
| [auth.middleware.js](file:///c:/AppMedicamentos/backend/src/middlewares/auth.middleware.js) | Filtro de seguridad. Extrae el token del header `Authorization`, consulta al servicio de autenticación y autoriza el paso al controlador si la firma es correcta. |

## Dependencias relevantes
- `../services/auth.service` (Invoca `getUserFromToken` para la resolución de credenciales)

## Flujo de trabajo
1. El cliente móvil envía un request a una ruta protegida incluyendo el header `Authorization: Bearer <token>`.
2. `auth.middleware.js` intercepta el request.
3. Si el token está ausente o no tiene el formato Bearer, interrumpe el flujo y responde inmediatamente con un error de autorización.
4. Si el token es verificado, inyecta el usuario correspondiente en `req.user` e invoca a `next()` para ceder el control al controlador.

## Convenciones
- Los middlewares deben invocar de forma obligatoria a `next()` o finalizar el flujo respondiendo al cliente, de lo contrario la conexión del cliente quedará colgada indefinidamente.

## Restricciones
- No manejar lógica de hashing o decodificación criptográfica directamente en esta capa; delegar siempre estas responsabilidades en los módulos criptográficos o servicios de seguridad.

## Relación con otras carpetas
- [routes/](file:///c:/AppMedicamentos/backend/src/routes) → Mapea las rutas protegidas inyectando este middleware de autorización en el flujo de la ruta.
- [services/](file:///c:/AppMedicamentos/backend/src/services) → Provee las funciones de validación de tokens y mapeo de sesiones activas.
