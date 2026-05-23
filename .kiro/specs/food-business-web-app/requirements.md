# Documento de Requerimientos

## Introducción

Aplicación web para un negocio de comida orientada exclusivamente a la vista del cliente. Permite explorar el menú, realizar pedidos en línea y disfrutar de una experiencia visual moderna. No incluye panel administrativo. El frontend es la prioridad principal, con un diseño moderno, una paleta de colores formal y efectos visuales interactivos como el componente `<ParticleBackground/>`. Toda la infraestructura se despliega mediante Docker Compose.

## Glosario

- **Cliente**: Usuario final que visita la aplicación para explorar el menú y realizar pedidos.
- **Producto**: Ítem del menú con nombre, descripción, precio, imagen y categoría.
- **Categoría**: Agrupación lógica de productos (ej. Entradas, Platos Principales, Postres, Bebidas).
- **Pedido**: Conjunto de productos seleccionados por un Cliente con estado de seguimiento.
- **Carrito**: Colección temporal de productos seleccionados por un Cliente antes de confirmar el pedido.
- **Sistema**: La aplicación web de negocio de comida en su totalidad.
- **Frontend**: Interfaz de usuario construida con React en un entorno Vite.
- **Backend**: Servicio de API REST que gestiona la lógica de negocio y acceso a datos.
- **Base_de_Datos**: Instancia de base de datos relacional simple desplegada en Docker.
- **Canvas**: Elemento HTML5 `<canvas>` utilizado para renderizado gráfico 2D mediante la Canvas API.
- **Partícula**: Elemento visual circular animado renderizado sobre el Canvas.
- **ParticleBackground**: Componente React que renderiza un fondo animado con partículas interactivas usando la Canvas API.

---

## Requerimientos

### Requerimiento 1: Visualización del Menú

**User Story:** Como Cliente, quiero explorar el menú del negocio organizado por categorías, para poder encontrar fácilmente los productos que me interesan.

#### Criterios de Aceptación

1. THE Sistema SHALL mostrar todos los Productos disponibles agrupados por Categoría en la página principal del menú.
2. WHEN un Cliente selecciona una Categoría, THE Frontend SHALL filtrar y mostrar únicamente los Productos pertenecientes a esa Categoría.
3. WHEN un Cliente hace clic en un Producto, THE Frontend SHALL mostrar una vista de detalle con nombre, descripción, precio e imagen del Producto.
4. THE Frontend SHALL mostrar el precio de cada Producto en formato de moneda local con dos decimales.
5. IF un Producto no tiene imagen disponible, THEN THE Frontend SHALL mostrar una imagen de marcador de posición predefinida.

---

### Requerimiento 2: Carrito de Compras

**User Story:** Como Cliente, quiero agregar productos a un carrito de compras, para poder revisar mi selección antes de confirmar el pedido.

#### Criterios de Aceptación

1. WHEN un Cliente selecciona "Agregar al Carrito" en un Producto, THE Sistema SHALL añadir ese Producto al Carrito del Cliente con cantidad igual a 1.
2. WHEN un Producto ya existe en el Carrito y el Cliente selecciona "Agregar al Carrito" nuevamente, THE Sistema SHALL incrementar la cantidad de ese Producto en 1.
3. WHEN un Cliente modifica la cantidad de un Producto en el Carrito a 0, THE Sistema SHALL eliminar ese Producto del Carrito.
4. THE Frontend SHALL mostrar el número total de ítems en el Carrito de forma visible en la barra de navegación.
5. THE Frontend SHALL mostrar el subtotal del Carrito actualizado en tiempo real al modificar cantidades.
6. IF el Carrito está vacío, THEN THE Frontend SHALL mostrar un mensaje indicando que el Carrito no contiene productos.

---

### Requerimiento 3: Realización de Pedidos

**User Story:** Como Cliente, quiero confirmar mi pedido desde el carrito, para que el negocio pueda preparar y entregar mi solicitud.

#### Criterios de Aceptación

1. WHEN un Cliente confirma el Pedido desde el Carrito, THE Backend SHALL crear un registro de Pedido con estado "Pendiente" y los Productos seleccionados.
2. WHEN un Pedido es creado exitosamente, THE Frontend SHALL mostrar una pantalla de confirmación con el número de Pedido y el resumen de productos.
3. THE Backend SHALL calcular el total del Pedido sumando el precio unitario de cada Producto multiplicado por su cantidad.
4. IF el Carrito está vacío al intentar confirmar, THEN THE Frontend SHALL mostrar un mensaje de error indicando que se deben agregar productos antes de confirmar.
5. WHEN un Pedido es creado, THE Sistema SHALL vaciar el Carrito del Cliente.

---

### Requerimiento 4: Componente ParticleBackground

**User Story:** Como Cliente, quiero ver un fondo visual animado e interactivo al navegar por la aplicación, para disfrutar de una experiencia estética moderna y envolvente.

#### Criterios de Aceptación

1. THE ParticleBackground SHALL renderizar un Canvas que ocupe el 100% del ancho y alto de su contenedor o ventana, sin usar librerías externas, únicamente la Canvas API de HTML5 y `requestAnimationFrame`.
2. WHEN el componente se monta, THE ParticleBackground SHALL inicializar y animar un conjunto de Partículas circulares flotando a velocidades lentas en direcciones aleatorias sobre un fondo oscuro.
3. WHEN el Canvas es redimensionado por cambio de tamaño de ventana, THE ParticleBackground SHALL ajustar las dimensiones del Canvas y redistribuir las Partículas de forma responsiva.
4. WHEN una Partícula alcanza el borde del Canvas, THE ParticleBackground SHALL invertir la componente de velocidad correspondiente para que la Partícula rebote suavemente sin desaparecer de la pantalla.
5. WHEN el cursor del ratón se mueve sobre el Canvas y una Partícula entra en el radio definido por `repelRadius`, THE ParticleBackground SHALL empujar esa Partícula suavemente en dirección opuesta al cursor, simulando repulsión.
6. WHEN el cursor del ratón se aleja de una Partícula repelida, THE ParticleBackground SHALL restaurar gradualmente la velocidad y dirección original de esa Partícula.
7. THE ParticleBackground SHALL aceptar las siguientes props opcionales con valores por defecto: `particleCount` (cantidad de Partículas), `particleColor` (color de las Partículas), `repelRadius` (radio de repulsión del cursor en píxeles) y `baseSpeed` (velocidad base de las Partículas).
8. WHEN el componente se desmonta, THE ParticleBackground SHALL cancelar el ciclo de `requestAnimationFrame` activo y eliminar todos los event listeners registrados (incluyendo `mousemove` y `resize`) para evitar fugas de memoria.
9. THE ParticleBackground SHALL gestionar su ciclo de vida completo dentro de un `useEffect` de React, incluyendo inicialización del Canvas, registro de eventos y función de limpieza (`cleanup`).

---

### Requerimiento 5: Diseño Visual y Experiencia de Usuario

**User Story:** Como Cliente, quiero una interfaz moderna y visualmente atractiva, para tener una experiencia de navegación agradable y profesional.

#### Criterios de Aceptación

1. THE Frontend SHALL implementar una paleta de colores formal compuesta por tonos neutros oscuros (primario), un color de acento cálido (secundario) y fondos claros.
2. THE Frontend SHALL ser completamente responsivo, adaptando el diseño a resoluciones de pantalla desde 320px hasta 1920px de ancho.
3. THE Frontend SHALL utilizar tipografía sans-serif con jerarquía visual definida: título principal (32px mínimo), subtítulos (20px mínimo) y cuerpo de texto (16px mínimo).
4. WHEN una acción del usuario genera una operación asíncrona, THE Frontend SHALL mostrar un indicador de carga visible hasta que la operación concluya.
5. THE Frontend SHALL aplicar transiciones de animación con duración entre 150ms y 300ms en elementos interactivos como botones, tarjetas y modales.
6. THE Frontend SHALL cumplir con un contraste de color mínimo de 4.5:1 entre texto y fondo según las pautas WCAG 2.1 nivel AA.

---

### Requerimiento 6: Infraestructura con Docker

**User Story:** Como desarrollador, quiero que toda la aplicación se despliegue con Docker Compose, para simplificar la configuración y el despliegue del entorno.

#### Criterios de Aceptación

1. THE Sistema SHALL incluir un archivo `docker-compose.yml` que defina los servicios de Frontend, Backend y Base_de_Datos.
2. WHEN el desarrollador ejecuta `docker-compose up`, THE Sistema SHALL iniciar todos los servicios y dejar la aplicación accesible en el puerto 80 del host.
3. THE Base_de_Datos SHALL persistir sus datos en un volumen de Docker para sobrevivir reinicios del contenedor.
4. THE Backend SHALL leer su configuración de conexión a la Base_de_Datos desde variables de entorno definidas en el archivo `docker-compose.yml`.
5. IF un servicio dependiente no está disponible al iniciar, THEN THE Sistema SHALL reintentar la conexión con un intervalo de 5 segundos hasta un máximo de 10 intentos antes de terminar con error.

---

### Requerimiento 7: API REST del Backend

**User Story:** Como desarrollador, quiero una API REST bien definida, para que el Frontend pueda consumir los datos del negocio de forma predecible.

#### Criterios de Aceptación

1. THE Backend SHALL exponer endpoints REST para las operaciones CRUD de Productos, Categorías y Pedidos.
2. THE Backend SHALL retornar respuestas en formato JSON con estructura consistente que incluya campos `data`, `error` y `status`.
3. WHEN el Backend recibe una solicitud con datos de entrada inválidos, THE Backend SHALL retornar un código HTTP 400 con descripción del error de validación.
4. IF un recurso solicitado no existe, THEN THE Backend SHALL retornar un código HTTP 404 con un mensaje descriptivo.
5. THE Backend SHALL implementar CORS permitiendo solicitudes únicamente desde el origen del Frontend definido en las variables de entorno.
