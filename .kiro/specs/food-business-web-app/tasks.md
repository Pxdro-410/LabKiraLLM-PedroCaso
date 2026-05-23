# Plan de Implementación: Food Business Web App

## Resumen

Implementación incremental de la aplicación web de negocio de comida. El plan sigue la arquitectura Feature-Based definida en el diseño: primero la infraestructura base (Docker, estructura de proyecto), luego el backend (modelos, CRUD, endpoints), y finalmente el frontend (componentes UI, features, integración). Cada tarea construye sobre la anterior y termina con la integración completa.

**Stack:**
- Frontend: React 18 + Vite 5, CSS Modules
- Backend: FastAPI (Python 3.12) + SQLAlchemy 2.0 async + Alembic
- Base de datos: PostgreSQL 16
- Infraestructura: Docker Compose + Nginx
- Testing: Vitest + fast-check (frontend), pytest + Hypothesis (backend)

---

## Tareas

- [x] 1. Configurar infraestructura base y estructura de proyecto
  - Crear la estructura de directorios del proyecto: `frontend/`, `backend/`, `nginx/`
  - Crear `docker-compose.yml` con los servicios `db`, `backend` y `frontend` según el diseño
  - Crear `nginx/nginx.conf` con reverse proxy: `/api/*` → backend, `/*` → frontend estático
  - Crear `backend/Dockerfile` con Python 3.12 slim, instalación de dependencias y arranque con Uvicorn
  - Crear `frontend/Dockerfile` multi-stage: build con Node 20 Alpine + servir con Nginx
  - Crear `.env.example` con las variables de entorno requeridas (`POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `FRONTEND_ORIGIN`)
  - _Requerimientos: 6.1, 6.2, 6.3, 6.4_

- [x] 2. Configurar proyecto backend (FastAPI + SQLAlchemy)
  - Crear `backend/requirements.txt` con dependencias fijadas: `fastapi`, `uvicorn[standard]`, `sqlalchemy[asyncio]`, `asyncpg`, `alembic`, `pydantic-settings`, `httpx`, `pytest`, `pytest-asyncio`, `hypothesis`
  - Crear `backend/app/core/config.py` con `Settings` usando `pydantic-settings` para leer variables de entorno
  - Crear `backend/app/core/database.py` con engine async SQLAlchemy y función `connect_with_retry` (máx. 10 intentos, intervalo 5s)
  - Crear `backend/app/main.py` con la aplicación FastAPI, CORS configurado desde `FRONTEND_ORIGIN`, y manejadores globales de excepciones (`RequestValidationError` → 400, `HTTPException` → código correspondiente)
  - Inicializar Alembic en `backend/alembic/`
  - _Requerimientos: 6.4, 6.5, 7.2, 7.3, 7.4, 7.5_

  - [ ]* 2.1 Escribir property test para lógica de reintentos de conexión
    - **Propiedad 13: Lógica de reintentos de conexión**
    - Verificar que para intentos 1–9 se reintenta, y en el intento 10 se lanza `RuntimeError`
    - **Valida: Requerimiento 6.5**

- [x] 3. Implementar modelos SQLAlchemy y migraciones
  - Crear `backend/app/models/category.py` con el modelo `Category` (id, name, description, created_at, relación con products)
  - Crear `backend/app/models/product.py` con el modelo `Product` (id, category_id FK, name, description, price Numeric(10,2), image_url, is_available, created_at)
  - Crear `backend/app/models/order.py` con los modelos `Order` y `OrderItem` (según el diagrama ER del diseño)
  - Crear la migración inicial de Alembic que genere todas las tablas
  - Crear un script de seed `backend/app/seed.py` con datos de ejemplo (categorías y productos) para desarrollo
  - _Requerimientos: 3.1, 3.3, 7.1_

- [x] 4. Implementar schemas Pydantic y operaciones CRUD
  - Crear `backend/app/schemas/category.py` con `CategoryRead`
  - Crear `backend/app/schemas/product.py` con `ProductBase`, `ProductRead`
  - Crear `backend/app/schemas/order.py` con `OrderItemCreate`, `OrderCreate`, `OrderItemRead`, `OrderRead`
  - Crear `backend/app/crud/category.py` con `get_all_categories`
  - Crear `backend/app/crud/product.py` con `get_all_products` (con filtro opcional `category_id`) y `get_product_by_id`
  - Crear `backend/app/crud/order.py` con `create_order` que calcule el total sumando `unit_price × quantity` para cada ítem
  - _Requerimientos: 3.1, 3.3, 7.1, 7.2_

  - [ ]* 4.1 Escribir property test para estructura de respuesta de la API
    - **Propiedad 9: Estructura consistente de respuestas de la API**
    - Verificar que toda respuesta contiene exactamente `data`, `error` y `status` con los tipos correctos
    - **Valida: Requerimiento 7.2**

  - [ ]* 4.2 Escribir property test para validación de entradas inválidas (HTTP 400)
    - **Propiedad 10: Validación de entradas inválidas retorna HTTP 400**
    - Generar con Hypothesis solicitudes con campos faltantes, tipos incorrectos o valores fuera de rango
    - Verificar que el backend retorna HTTP 400 con campo `error` descriptivo
    - **Valida: Requerimiento 7.3**

  - [ ]* 4.3 Escribir property test para recursos inexistentes (HTTP 404)
    - **Propiedad 11: Recursos inexistentes retornan HTTP 404**
    - Generar con Hypothesis IDs de recursos que no existen en la base de datos
    - Verificar que el backend retorna HTTP 404 con mensaje descriptivo en `error`
    - **Valida: Requerimiento 7.4**

- [x] 5. Implementar endpoints REST de la API
  - Crear `backend/app/api/deps.py` con la dependencia `get_db` para inyección de sesión async
  - Crear `backend/app/api/v1/endpoints/categories.py` con `GET /api/v1/categories`
  - Crear `backend/app/api/v1/endpoints/products.py` con `GET /api/v1/products` (con query param `category_id` opcional) y `GET /api/v1/products/{id}`
  - Crear `backend/app/api/v1/endpoints/orders.py` con `POST /api/v1/orders` y `GET /api/v1/orders/{id}`
  - Crear `backend/app/api/v1/router.py` y registrar todos los endpoints en `main.py`
  - Todos los endpoints deben retornar la estructura `{data, error, status}` definida en el diseño
  - _Requerimientos: 7.1, 7.2, 7.3, 7.4_

- [x] 6. Checkpoint — Backend completo
  - Verificar que `docker-compose up db backend` levanta sin errores
  - Verificar que las migraciones se aplican correctamente
  - Verificar que los endpoints responden en `http://localhost:8000/api/v1/`
  - Asegurarse de que todos los tests del backend pasan. Consultar al usuario si hay dudas.

- [x] 7. Configurar proyecto frontend (React + Vite)
  - Crear `frontend/package.json` con dependencias fijadas: `react@18`, `react-dom@18`, `vite@5`, `axios`, `prop-types`, y devDependencies: `vitest`, `@vitest/coverage-v8`, `fast-check`, `@testing-library/react`, `@testing-library/jest-dom`
  - Crear `frontend/vite.config.js` con configuración de Vitest (globals, jsdom environment) y proxy de desarrollo hacia el backend
  - Crear la estructura de directorios completa del frontend según el diseño: `src/components/ui/`, `src/components/layout/`, `src/components/ParticleBackground/`, `src/features/menu/`, `src/features/cart/`, `src/features/orders/`, `src/hooks/`, `src/services/`, `src/styles/`, `src/utils/`
  - _Requerimientos: 5.1, 5.2, 5.3_

- [x] 8. Implementar tokens de diseño y estilos globales
  - Crear `frontend/src/styles/reset.css` con reset CSS moderno
  - Crear `frontend/src/styles/tokens.css` con todas las CSS custom properties del diseño (colores, tipografía, espaciado, bordes, sombras, transiciones)
  - Crear `frontend/src/styles/globals.css` importando reset y tokens, definiendo estilos base para `body`, `html`, tipografía y scrollbar
  - _Requerimientos: 5.1, 5.2, 5.3, 5.5, 5.6_

  - [ ]* 8.1 Escribir property test para contraste de color WCAG 2.1 AA
    - **Propiedad 12: Contraste de color cumple WCAG 2.1 AA**
    - Crear `frontend/src/utils/contrastRatio.js` con la función de cálculo de contraste según WCAG
    - Usar fast-check para verificar que todos los pares (texto, fondo) de los tokens tienen ratio ≥ 4.5:1
    - **Valida: Requerimiento 5.6**

- [x] 9. Implementar utilidades y configuración HTTP
  - Crear `frontend/src/utils/formatCurrency.js` con la función `formatCurrency(price, locale, currency)` que retorna precio con exactamente dos decimales y símbolo de moneda
  - Crear `frontend/src/services/api.js` con instancia de Axios configurada con `baseURL`, interceptor de respuesta que normaliza errores al formato `{data, error, status}`, y manejo de errores de red
  - Crear `frontend/src/hooks/useAsync.js` con hook genérico para operaciones asíncronas (estado: `loading`, `data`, `error`)
  - _Requerimientos: 1.4, 5.4, 7.2_

  - [ ]* 9.1 Escribir property test para formatCurrency
    - **Propiedad 2: Formato de precio con dos decimales**
    - Usar fast-check para generar valores numéricos válidos (incluyendo enteros, decimales, 0.01)
    - Verificar que `formatCurrency` retorna siempre exactamente dos dígitos decimales y el símbolo de moneda
    - **Valida: Requerimiento 1.4**

- [ ] 10. Implementar componentes UI atómicos
  - Crear `frontend/src/components/ui/Button/Button.jsx` y `Button.module.css` con variantes (primary, secondary, ghost), estados (loading, disabled) y transiciones de 150–300ms
  - Crear `frontend/src/components/ui/Spinner/Spinner.jsx` y `Spinner.module.css` para indicador de carga
  - Crear `frontend/src/components/ui/Badge/Badge.jsx` y `Badge.module.css` para mostrar contadores (ej. ítems en carrito)
  - Crear `frontend/src/components/ui/Modal/Modal.jsx` y `Modal.module.css` con overlay, cierre con Escape y accesibilidad (role="dialog", aria-modal)
  - Crear `frontend/src/components/ui/EmptyState/EmptyState.jsx` y `EmptyState.module.css` para estados vacíos con mensaje configurable
  - _Requerimientos: 2.6, 3.4, 5.4, 5.5_

- [~] 11. Implementar componente ParticleBackground
  - Crear `frontend/src/components/ParticleBackground/ParticleBackground.module.css` con `.canvas` posicionado `fixed`, `width: 100%`, `height: 100%`, `z-index: 0`, `background: var(--color-primary-900)`
  - Crear `frontend/src/components/ParticleBackground/ParticleBackground.jsx` implementando:
    - `createParticle(canvasWidth, canvasHeight, baseSpeed)` que genera partícula con posición aleatoria, velocidad angular aleatoria, `originalVx`/`originalVy`, radio y opacidad
    - `useEffect` con inicialización del canvas, registro de `mousemove` y `mouseleave` en el canvas, `resize` en `window`
    - Loop de animación con `requestAnimationFrame`: limpiar canvas, calcular repulsión/restauración por distancia al cursor, rebote en bordes (invertir componente de velocidad y clampear posición), dibujar círculo con `ctx.arc`
    - Props opcionales con defaults: `particleCount=80`, `particleColor='rgba(255,160,80,0.6)'`, `repelRadius=120`, `baseSpeed=0.8`
    - Cleanup en return del `useEffect`: `cancelAnimationFrame`, `removeEventListener` para `resize`, `mousemove` y `mouseleave`
    - Atributo `aria-hidden="true"` en el canvas
  - _Requerimientos: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9_

  - [ ]* 11.1 Escribir property test para rebote de partículas en bordes
    - **Propiedad 7: Rebote de partículas en bordes del canvas**
    - Usar fast-check para generar partículas con posiciones y velocidades arbitrarias y dimensiones de canvas arbitrarias
    - Verificar que tras aplicar la lógica de rebote, la componente de velocidad perpendicular al borde se invierte y la posición queda dentro de los límites
    - **Valida: Requerimiento 4.4**

  - [ ]* 11.2 Escribir property test para repulsión del cursor
    - **Propiedad 8: Repulsión de partículas por el cursor**
    - Usar fast-check para generar partículas dentro del `repelRadius` con posiciones y velocidades arbitrarias
    - Verificar que el producto punto entre el vector cursor→partícula y el delta de velocidad aplicado es positivo (dirección opuesta al cursor)
    - **Valida: Requerimiento 4.5**

- [~] 12. Implementar componentes de layout (Navbar y Footer)
  - Crear `frontend/src/components/layout/Navbar/Navbar.jsx` y `Navbar.module.css` con logo del negocio, navegación principal y Badge con `totalItems` del carrito visible en todo momento
  - Crear `frontend/src/components/layout/Footer/Footer.jsx` y `Footer.module.css` con información básica del negocio
  - _Requerimientos: 2.4, 5.1, 5.2_

- [~] 13. Implementar feature de menú
  - Crear `frontend/src/features/menu/services/menuService.js` con funciones `getCategories()` y `getProducts(categoryId?)` que usan la instancia de Axios de `api.js`
  - Crear `frontend/src/features/menu/hooks/useMenu.js` usando `useAsync` para cargar categorías y productos, con estado de filtro por categoría activa
  - Crear `frontend/src/features/menu/components/CategoryFilter.jsx` y CSS Module con botones de filtro por categoría; al seleccionar una categoría debe filtrar los productos mostrados
  - Crear `frontend/src/features/menu/components/ProductCard.jsx` y CSS Module mostrando imagen (con fallback a `placeholder-food.webp`), nombre, precio formateado con `formatCurrency` y botón "Agregar al Carrito"
  - Crear `frontend/src/features/menu/components/ProductGrid.jsx` y CSS Module con grid responsivo de `ProductCard`
  - Crear `frontend/src/features/menu/components/ProductDetailModal.jsx` y CSS Module usando el componente `Modal` para mostrar detalle completo del producto
  - Crear `frontend/src/features/menu/components/MenuPage.jsx` que compone `CategoryFilter`, `ProductGrid`, `Spinner` (durante carga) y `EmptyState` (si no hay productos)
  - _Requerimientos: 1.1, 1.2, 1.3, 1.4, 1.5, 5.4_

  - [ ]* 13.1 Escribir property test para filtrado de productos por categoría
    - **Propiedad 1: Filtrado de productos por categoría**
    - Usar fast-check para generar listas de productos con `category_id` arbitrarios y una categoría seleccionada
    - Verificar que el resultado contiene únicamente productos con `category_id` igual a la categoría seleccionada
    - **Valida: Requerimiento 1.2**

- [~] 14. Implementar feature de carrito de compras
  - Crear `frontend/src/features/cart/context/CartContext.jsx` con `CartProvider` usando `useReducer` para gestionar el estado del carrito; el reducer debe manejar acciones: `ADD_ITEM` (agrega con cantidad 1 o incrementa), `REMOVE_ITEM`, `UPDATE_QUANTITY` (si qty=0, elimina el ítem), `CLEAR_CART`
  - Calcular `totalItems` (suma de cantidades) y `subtotal` (suma de `price × quantity`) como valores derivados del estado
  - Crear `frontend/src/features/cart/hooks/useCart.js` que consume `CartContext`
  - Crear `frontend/src/features/cart/components/CartItem.jsx` y CSS Module con controles de cantidad (+/-), precio unitario y botón de eliminar
  - Crear `frontend/src/features/cart/components/CartSummary.jsx` y CSS Module con subtotal actualizado en tiempo real
  - Crear `frontend/src/features/cart/components/CartDrawer.jsx` y CSS Module como panel lateral con lista de `CartItem`, `CartSummary`, `EmptyState` (si carrito vacío) y botón "Confirmar Pedido"
  - _Requerimientos: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [ ]* 14.1 Escribir property test para invariante del carrito al agregar productos
    - **Propiedad 3: Invariante del carrito al agregar productos**
    - Usar fast-check para generar estados de carrito y productos arbitrarios
    - Verificar que agregar un producto nuevo resulta en cantidad 1, y agregar uno existente incrementa en 1, sin afectar otros ítems
    - **Valida: Requerimientos 2.1, 2.2**

  - [ ]* 14.2 Escribir property test para eliminación al establecer cantidad cero
    - **Propiedad 4: Eliminación de producto al establecer cantidad cero**
    - Usar fast-check para generar carritos con productos y cantidades arbitrarias
    - Verificar que `updateQuantity(id, 0)` elimina el producto del carrito sin afectar los demás ítems
    - **Valida: Requerimiento 2.3**

  - [ ]* 14.3 Escribir property test para cálculo de totales del carrito
    - **Propiedad 5: Cálculo correcto de totales del carrito**
    - Usar fast-check para generar combinaciones arbitrarias de productos, precios y cantidades
    - Verificar que `totalItems === sum(quantities)` y `subtotal === sum(price × quantity)`
    - **Valida: Requerimientos 2.4, 2.5**

- [~] 15. Checkpoint — Features de menú y carrito
  - Verificar que el menú carga y filtra productos correctamente
  - Verificar que el carrito agrega, modifica y elimina productos con totales correctos
  - Asegurarse de que todos los tests del frontend pasan. Consultar al usuario si hay dudas.

- [~] 16. Implementar feature de pedidos
  - Crear `frontend/src/features/orders/services/orderService.js` con función `createOrder(items)` que hace `POST /api/v1/orders`
  - Crear `frontend/src/features/orders/hooks/useOrder.js` usando `useAsync` para gestionar el estado de creación del pedido
  - Crear `frontend/src/features/orders/components/CheckoutPage.jsx` y CSS Module que muestra el resumen del carrito, botón "Confirmar Pedido" (deshabilitado si carrito vacío con mensaje de error inline), y `Spinner` durante la operación asíncrona
  - Crear `frontend/src/features/orders/components/OrderConfirmation.jsx` y CSS Module que muestra número de pedido, resumen de productos y mensaje de confirmación; al mostrarse debe invocar `clearCart()`
  - _Requerimientos: 3.1, 3.2, 3.3, 3.4, 3.5, 5.4_

  - [ ]* 16.1 Escribir property test para round-trip de creación de pedido
    - **Propiedad 6: Round-trip de creación de pedido**
    - Usar Hypothesis para generar carritos no vacíos con productos y cantidades arbitrarias
    - Verificar que el pedido creado tiene estado "Pendiente", contiene exactamente los mismos productos/cantidades del carrito, el total es correcto, y el carrito queda vacío
    - **Valida: Requerimientos 3.1, 3.3, 3.5**

- [~] 17. Integrar todos los componentes en App.jsx
  - Crear `frontend/src/App.jsx` que compone: `ParticleBackground` como capa de fondo, `CartProvider` envolviendo toda la app, `Navbar` con `Badge` de carrito, `MenuPage` como contenido principal, `CartDrawer` controlado por estado de visibilidad, y rutas a `CheckoutPage` y `OrderConfirmation`
  - Crear `frontend/src/main.jsx` que monta `App` en el DOM con `React.StrictMode`
  - Crear `frontend/index.html` con el punto de entrada, meta viewport y referencia a `main.jsx`
  - Agregar imagen `frontend/public/placeholder-food.webp` como fallback para productos sin imagen
  - _Requerimientos: 1.1, 2.4, 4.1, 4.2, 5.1, 5.2_

- [~] 18. Checkpoint final — Integración completa
  - Verificar que `docker-compose up` levanta todos los servicios sin errores
  - Verificar que la aplicación es accesible en `http://localhost:80`
  - Verificar que el flujo completo funciona: explorar menú → agregar al carrito → confirmar pedido → ver confirmación
  - Asegurarse de que todos los tests (frontend y backend) pasan. Consultar al usuario si hay dudas.

---

## Notas

- Las tareas marcadas con `*` son opcionales y pueden omitirse para un MVP más rápido
- Cada tarea referencia requerimientos específicos para trazabilidad
- Los checkpoints garantizan validación incremental antes de continuar
- Las property tests validan propiedades universales de corrección definidas en el diseño
- Los tests unitarios validan casos específicos y condiciones de borde
- El orden de implementación es: infraestructura → backend → frontend base → features → integración
