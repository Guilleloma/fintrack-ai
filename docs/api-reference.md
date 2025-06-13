# FinTrack AI - Documentación de API

Esta documentación describe los endpoints disponibles en la API de FinTrack AI para el seguimiento y gestión de activos financieros.

## Base URL

```
http://localhost:3001/api
```

## Endpoints

### Activos

#### Obtener todos los activos

```
GET /assets
```

Devuelve una lista de todos los activos registrados con información resumida, incluyendo su valor actual, valor inicial y ganancia/pérdida calculada.

**Respuesta exitosa (200 OK)**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Depósito Bancario",
      "category_id": 1,
      "category_name": "Efectivo y equivalentes",
      "platform": "Banco Santander",
      "current_value": 10000,
      "initial_value": 10000,
      "currency": "EUR",
      "gain_loss": 0,
      "gain_loss_percentage": 0
    }
  ]
}
```

#### Obtener un activo por ID

```
GET /assets/:id
```

Devuelve información detallada de un activo específico, incluyendo su historial de valores.

**Parámetros de ruta**

- `id` - ID del activo (número entero)

**Respuesta exitosa (200 OK)**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Depósito Bancario",
    "category_id": 1,
    "category_name": "Efectivo y equivalentes",
    "platform": "Banco Santander",
    "current_value": 10000,
    "initial_value": 10000,
    "currency": "EUR",
    "history": [
      {
        "value": 10000,
        "date": "2025-06-11"
      }
    ]
  }
}
```

**Respuesta de error (404 Not Found)**

```json
{
  "success": false,
  "message": "Activo no encontrado"
}
```

#### Crear un nuevo activo

```
POST /assets
```

Crea un nuevo activo en la base de datos.

**Cuerpo de la solicitud**

```json
{
  "name": "Depósito Bancario",
  "category_id": 1,
  "platform": "Banco Santander",
  "current_value": 10000,
  "initial_value": 10000,
  "currency": "EUR"
}
```

**Campos requeridos**

- `name` - Nombre del activo (string)
- `category_id` - ID de la categoría (número entero)
- `current_value` - Valor actual del activo (número)

**Campos opcionales**

- `platform` - Plataforma o institución donde se encuentra el activo (string)
- `initial_value` - Valor inicial del activo (número). Si no se proporciona, se usa el valor actual.
- `currency` - Moneda del activo (string). Valor por defecto: "EUR"

**Respuesta exitosa (201 Created)**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Depósito Bancario",
    "category_id": 1,
    "platform": "Banco Santander",
    "current_value": 10000,
    "initial_value": 10000,
    "currency": "EUR"
  }
}
```

**Respuesta de error (400 Bad Request)**

```json
{
  "success": false,
  "errors": [
    {
      "msg": "El nombre es obligatorio",
      "param": "name",
      "location": "body"
    }
  ]
}
```

#### Actualizar un activo existente

```
PUT /assets/:id
```

Actualiza un activo existente en la base de datos.

**Parámetros de ruta**

- `id` - ID del activo (número entero)

**Cuerpo de la solicitud**

```json
{
  "name": "Depósito Bancario Actualizado",
  "current_value": 12000
}
```

**Campos opcionales** (al menos uno debe ser proporcionado)

- `name` - Nombre del activo (string)
- `category_id` - ID de la categoría (número entero)
- `platform` - Plataforma o institución (string)
- `current_value` - Valor actual del activo (número)
- `initial_value` - Valor inicial del activo (número)
- `currency` - Moneda del activo (string)

**Respuesta exitosa (200 OK)**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Depósito Bancario Actualizado",
    "category_id": 1,
    "platform": "Banco Santander",
    "current_value": 12000,
    "initial_value": 10000,
    "currency": "EUR"
  }
}
```

**Respuesta de error (404 Not Found)**

```json
{
  "success": false,
  "message": "Activo no encontrado"
}
```

#### Eliminar un activo

```
DELETE /assets/:id
```

Elimina un activo y su historial de valores de la base de datos.

**Parámetros de ruta**

- `id` - ID del activo (número entero)

**Respuesta exitosa (200 OK)**

```json
{
  "success": true,
  "message": "Activo eliminado correctamente"
}
```

**Respuesta de error (404 Not Found)**

```json
{
  "success": false,
  "message": "Activo no encontrado"
}
```

### Categorías

#### Obtener todas las categorías

```
GET /assets/categories/all
```

Devuelve una lista de todas las categorías de activos disponibles.

**Respuesta exitosa (200 OK)**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Efectivo y equivalentes"
    },
    {
      "id": 2,
      "name": "Acciones"
    },
    {
      "id": 3,
      "name": "Fondos de inversión"
    },
    {
      "id": 4,
      "name": "Criptomonedas"
    },
    {
      "id": 5,
      "name": "Bienes raíces"
    },
    {
      "id": 6,
      "name": "Otros"
    }
  ]
}
```

## Códigos de estado

- `200 OK` - La solicitud se ha completado correctamente
- `201 Created` - El recurso se ha creado correctamente
- `400 Bad Request` - La solicitud contiene datos inválidos o falta información requerida
- `404 Not Found` - El recurso solicitado no existe
- `500 Internal Server Error` - Error interno del servidor

## Formato de respuesta

Todas las respuestas siguen un formato estándar:

- Para respuestas exitosas:
  ```json
  {
    "success": true,
    "data": { ... } // o un array de objetos
  }
  ```

- Para respuestas de error:
  ```json
  {
    "success": false,
    "message": "Mensaje de error" // o un array de errores
  }
  ```
