# Requirements Document

## Introduction

Sistema web para la gestión integral de un negocio de videojuegos. La aplicación permite administrar el inventario de productos (videojuegos, consolas y accesorios), registrar ventas, gestionar clientes y generar reportes básicos de negocio. Está compuesta por un frontend en React, un backend en Express (Node.js) y se despliega mediante Docker Compose.

## Glossary

- **Sistema**: La aplicación web completa de gestión de tienda de videojuegos.
- **Producto**: Artículo disponible en la tienda (videojuego, consola o accesorio).
- **Inventario**: Conjunto de productos con sus cantidades y precios disponibles en la tienda.
- **Venta**: Transacción comercial que registra la compra de uno o más productos por parte de un cliente.
- **Cliente**: Persona registrada en el sistema que puede realizar compras.
- **Usuario_Admin**: Persona con acceso completo al sistema para gestionar inventario, ventas y clientes.
- **API**: Interfaz de programación del backend Express que expone los endpoints REST.
- **Dashboard**: Pantalla principal con métricas y resumen del negocio.

---

## Requirements

### Requirement 1: Autenticación de Usuarios

**User Story:** Como Usuario_Admin, quiero iniciar sesión de forma segura, para que solo personal autorizado pueda acceder al sistema.

#### Acceptance Criteria

1. WHEN un Usuario_Admin envía credenciales válidas (usuario y contraseña), THE Sistema SHALL autenticar al usuario y devolver un token JWT con expiración de 8 horas.
2. WHEN un Usuario_Admin envía credenciales inválidas, THE Sistema SHALL rechazar el acceso y devolver un mensaje de error descriptivo.
3. WHILE un Usuario_Admin tiene una sesión activa, THE Sistema SHALL incluir el token JWT en cada solicitud a la API para verificar la identidad.
4. IF el token JWT ha expirado o es inválido, THEN THE Sistema SHALL redirigir al Usuario_Admin a la pantalla de inicio de sesión.
5. THE Sistema SHALL almacenar las contraseñas usando un algoritmo de hash seguro (bcrypt con salt rounds mínimo de 10).

---

### Requirement 2: Gestión de Inventario

**User Story:** Como Usuario_Admin, quiero gestionar el inventario de productos, para que pueda mantener actualizado el catálogo y las existencias de la tienda.

#### Acceptance Criteria

1. THE Sistema SHALL permitir crear un Producto con los campos: nombre, categoría (videojuego, consola, accesorio), plataforma, precio de compra, precio de venta, cantidad en stock y descripción opcional.
2. WHEN un Usuario_Admin solicita la lista de productos, THE Sistema SHALL devolver todos los productos con paginación de 20 elementos por página.
3. WHEN un Usuario_Admin actualiza los datos de un Producto existente, THE Sistema SHALL persistir los cambios y devolver el Producto actualizado.
4. WHEN un Usuario_Admin elimina un Producto, THE Sistema SHALL marcarlo como inactivo en lugar de eliminarlo físicamente de la base de datos.
5. IF la cantidad en stock de un Producto llega a cero, THEN THE Sistema SHALL marcar el Producto como "sin stock" y mostrarlo visualmente diferenciado en el Inventario.
6. THE Sistema SHALL permitir buscar productos por nombre, categoría o plataforma.
7. WHEN un Usuario_Admin registra una Venta, THE Sistema SHALL decrementar automáticamente la cantidad en stock de cada Producto vendido.

---

### Requirement 3: Gestión de Clientes

**User Story:** Como Usuario_Admin, quiero registrar y gestionar clientes, para que pueda llevar un historial de compras y datos de contacto.

#### Acceptance Criteria

1. THE Sistema SHALL permitir registrar un Cliente con los campos: nombre completo, correo electrónico, teléfono y dirección opcional.
2. THE Sistema SHALL validar que el correo electrónico de un Cliente sea único en el sistema.
3. WHEN un Usuario_Admin solicita la lista de clientes, THE Sistema SHALL devolver todos los clientes activos con paginación de 20 elementos por página.
4. WHEN un Usuario_Admin actualiza los datos de un Cliente, THE Sistema SHALL persistir los cambios y devolver el Cliente actualizado.
5. WHEN un Usuario_Admin elimina un Cliente, THE Sistema SHALL marcarlo como inactivo sin eliminar su historial de ventas.
6. THE Sistema SHALL permitir buscar clientes por nombre o correo electrónico.

---

### Requirement 4: Registro de Ventas

**User Story:** Como Usuario_Admin, quiero registrar ventas, para que pueda llevar un control de los ingresos y el historial de transacciones.

#### Acceptance Criteria

1. WHEN un Usuario_Admin registra una Venta, THE Sistema SHALL asociarla a un Cliente existente o permitir registrarla como venta anónima.
2. THE Sistema SHALL permitir agregar uno o más Productos a una Venta, especificando la cantidad de cada uno.
3. WHEN se registra una Venta, THE Sistema SHALL calcular automáticamente el total sumando (precio de venta × cantidad) de cada Producto incluido.
4. IF la cantidad solicitada de un Producto en una Venta supera el stock disponible, THEN THE Sistema SHALL rechazar la operación y devolver un mensaje de error indicando el stock disponible.
5. WHEN una Venta es registrada exitosamente, THE Sistema SHALL generar un identificador único de transacción y registrar la fecha y hora.
6. THE Sistema SHALL permitir consultar el historial de ventas con filtros por rango de fechas y por Cliente.
7. WHEN un Usuario_Admin consulta el detalle de una Venta, THE Sistema SHALL mostrar los productos vendidos, cantidades, precios unitarios y total.

---

### Requirement 5: Dashboard y Reportes

**User Story:** Como Usuario_Admin, quiero ver un resumen del negocio en el Dashboard, para que pueda tomar decisiones informadas rápidamente.

#### Acceptance Criteria

1. WHEN un Usuario_Admin accede al Dashboard, THE Sistema SHALL mostrar el total de ventas del día actual, la semana actual y el mes actual.
2. WHEN un Usuario_Admin accede al Dashboard, THE Sistema SHALL mostrar los 5 productos más vendidos del mes actual.
3. WHEN un Usuario_Admin accede al Dashboard, THE Sistema SHALL mostrar el número total de clientes registrados y el número de ventas del mes.
4. IF un Producto tiene stock menor o igual a 5 unidades, THEN THE Sistema SHALL mostrarlo en una sección de alertas de stock bajo en el Dashboard.
5. THE Sistema SHALL permitir exportar el historial de ventas de un rango de fechas seleccionado en formato CSV.

---

### Requirement 6: Infraestructura y Despliegue

**User Story:** Como Usuario_Admin, quiero que la aplicación sea fácil de desplegar, para que pueda ejecutarla en cualquier entorno con un solo comando.

#### Acceptance Criteria

1. THE Sistema SHALL incluir un archivo `docker-compose.yml` que levante todos los servicios necesarios (frontend, backend y base de datos) con un único comando.
2. THE Sistema SHALL utilizar variables de entorno para toda configuración sensible (credenciales de base de datos, secreto JWT, puertos).
3. WHEN el servicio de backend inicia, THE Sistema SHALL ejecutar automáticamente las migraciones de base de datos pendientes.
4. THE Sistema SHALL exponer el frontend en el puerto 3000 y el backend en el puerto 4000 por defecto, configurables mediante variables de entorno.
5. WHERE el entorno es de desarrollo, THE Sistema SHALL habilitar hot-reload tanto en el frontend como en el backend.
