# API de gestion de eventos

Esta API permite gestionar eventos, usuarios y tickets.

---

## Librerías Utilizadas

- **bcrypt**: Para encriptar contraseñas de manera segura.
- **cloudinary**: Para la gestión de imágenes en la nube.
- **dotenv**: Para gestionar variables de entorno.
- **express**: Framework web para manejar las rutas y middleware.
- **jsonwebtoken**: Para la creación y verificación de tokens JWT.
- **mongoose**: ODM para interactuar con bases de datos MongoDB.
- **multer**: Middleware para manejar la subida de archivos.
- **multer-storage-cloudinary**: Extensión de multer para usar Cloudinary como almacenamiento.
- **node-cron**: Para programar tareas automatizadas.
- **qrcode**: Para la generación de códigos QR.
- **cors**: Para permitir peticiones entre dominios.

---

<div align="center">
<img src="https://res.cloudinary.com/dn6utw1rl/image/upload/v1737506933/default/default-perfil-peoples_wxg3bf.jpg" alt="Cloudinary-logo" width="450" />
</div>

---

## Autenticación

#### **Cuerpo de Registro/Login**
```json
{
  "userName": "string",
  "password": "string"   
}
```

## Endpoints de Autenticación

### **Registrar Usuario**
**Endpoint:** `POST /api/v1/register`

Registra un nuevo usuario en el sistema.

---

### **Iniciar Sesión de Usuario**
**Endpoint:** `GET /api/v1/register/login`

Inicia sesión un usuario existente.

---

## Resumen de Endpoints de Autenticación

| **Método** | **Endpoint**             | **Descripción**              |
| ---------- | ------------------------ | ---------------------------- |
| POST       | `/api/v1/register`       | Registrar un nuevo usuario   |
| GET        | `/api/v1/register/login` | Iniciar sesión de un usuario |

---

## Eventos :

### **Cuerpo del Evento:**

```json
{
  "name": "string",           // Requerido: Nombre del evento
  "type": "string",           // Opcional: Tipo de evento (valores: "music", "sport", "party", "training", "art", "gastronomy", "technology", "others"; por defecto: "others")
  "location": "string",       // Requerido: Ubicación general del evento
  "address": "string",        // Requerido: Dirección específica del evento
  "city": "string",           // Requerido: Ciudad donde ocurre el evento
  "description": "string",    // Requerido: Descripción detallada del evento
  "startDate": "date",        // Requerido: Fecha y hora de inicio del evento
  "endDate": "date",          // Requerido: Fecha y hora de fin del evento
  "image": "string",          // Opcional: URL de la imagen del evento
  "price": "number",          // Opcional: Precio de entrada al evento , por defecto 0
  "maxCapacity": "number"     // Requerido: Capacidad máxima de asistentes
}
```

## Endpoints de Eventos

#### **Obtener Evento por ID**
**Endpoint:** `GET /api/v1/events/:eventId`

- **Autenticación:** Requerida.
- Devuelve los detalles de un evento por su Id.

---

#### **Obtener Eventos por Estado**
**Endpoint:** `GET /api/v1/events/status/:eventStatus`

- **Autenticación:** Requerida.
- Devuelve todos los eventos que coinciden con el estado especificado, pudiendo ser los siguientes: **not-start, postponed, cancelled o finalized.**

---

#### **Obtener Todos los Eventos**
**Endpoint:** `GET /api/v1/events`

- **Autenticación:** Requerida.
- Devuelve todos los eventos disponibles.

---

#### **Crear un Evento**
**Endpoint:** `POST /api/v1/events`

- **Autenticación:** Requerida.
- **Subida de Imagen:** Permitida subida de una Imagen.
- Crea un nuevo evento con los datos proporcionados.

---

#### **Actualizar un Evento**
**Endpoint:** `PUT /api/v1/events/:eventId`

- **Autenticación:** Requerida.
- **Verificación del Creador o administrator:** Requerida.
- **Subida de Imagen:** Permitida subida de 1 imagen.
- Actualiza un evento por su Id con los nuevos datos proporcionados.

---

#### **Eliminar un Evento**
**Endpoint:** `DELETE /api/v1/events/:eventId`

- **Autenticación:** Requerida.
- **Verificación del Creador o administrator:** Requerida.
- Elimina un evento por su Id.

---

## Resumen de Endpoints de Eventos

| **Método** | **Endpoint**             | **Descripción**              |
| ---------- | ------------------------ | ---------------------------- |
| GET       | `/api/v1/events`       | Obtiene todos los eventos   |
| GET        | `/api/v1/events/:eventId` | Obtiene un evento por su Id |
| GET        | `/api/v1/status/events/:eventStatus` | Obtiene un evento por su estado **(not-start, postponed, cancelled, finalized)** |
|POST       | `/api/v1/events`       | Crea un nuevo evento   |
| PUT       | `/api/v1/events/:eventId`       | Actualiza un evento   |
| DELETE       | `/api/v1/events/:eventId`       | Elimina un evento   |

---



