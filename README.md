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

```json

	{
		"_id": "6791a1d86d91efc38617ae06",
		"name": "Concierto de Jazz Nocturno",
		"type": "music",
		"location": "Teatro de la Ciudad",
		"adress": "Calle del Sol 123",
		"city": "Barcelona",
		"description": "Un espectáculo único con los mejores artistas de jazz.",
		"startDate": "2025-03-15T19:00:00.000Z",
		"endDate": "2025-03-15T22:00:00.000Z",
		"eventStatus": "not-start",
		"image": "https://res.cloudinary.com/dn6utw1rl/image/upload/v1736008149/default/default-image-event_zk7dcu.webp",
		"createdBy": "67784a087790d458a8eaef58",
		"isPaid": false,
		"soldOut": false,
		"price": 0,
		"priceVip": 0,
		"maxCapacity": 200,
		"totalReservedPlaces": 0,
		"attendees": [],
		"ticketsSold": [],
		"__v": 0,
		"createdAt": "2025-01-23T01:56:40.502Z",
		"updatedAt": "2025-01-23T01:56:40.502Z"
	}

```

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

| **Método** | **Endpoint**                         | **Descripción**                                                                  |
| ---------- | ------------------------------------ | -------------------------------------------------------------------------------- |
| GET        | `/api/v1/events`                     | Obtiene todos los eventos                                                        |
| GET        | `/api/v1/events/:eventId`            | Obtiene un evento por su Id                                                      |
| GET        | `/api/v1/status/events/:eventStatus` | Obtiene un evento por su estado **(not-start, postponed, cancelled, finalized)** |
| POST       | `/api/v1/events`                     | Crea un nuevo evento                                                             |
| PUT        | `/api/v1/events/:eventId`            | Actualiza un evento                                                              |
| DELETE     | `/api/v1/events/:eventId`            | Elimina un evento                                                                |

---

## Tickets :

### **Cuerpo del Ticket:**

```json
{
  "eventId": "string",          // Requerido: ID del evento asociado al ticket
  "userId": "string",           // Requerido: ID del usuario que posee el ticket
  "reservedPlaces": "number",   // Requerido: Número de lugares reservados
  "ticketStatus": "string"      // Opcional: Estado del ticket valores: **"unused", "used", "cancelled"**, por defecto: "unused")
}
```

## Endpoints de Tickets

#### **Modifica el status de un Ticket**
**Endpoint:** `PUT /api/v1/tickets/status/:ticketId`

- **Autenticación:** Requerida.
- **Verificación del administrator:** Requerida.
- modifica el status de un ticket a **"used" o "cancelled"**

```json

{
		"ticketPriceVip": 0,
		"_id": "678ec472463a66112c09c83f",
		"eventId": "678ec43ce124c363dac94a53",
		"eventName": "Concierto de Jazz Nocturno",
		"eventStatus": "cancelled",
		"userId": "67784a087790d458a8eaef58",
		"userName": "admin",
		"reservedPlaces": 10,
		"ticketPrice": 0,
     	"ticketPriceVip": 0,
     	"ticketStatus": "used",
		"createdAt": "2025-01-20T21:47:30.731Z",
		"qrCode": "data:image/png;base64,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",
		"updatedAt": "2025-01-21T00:23:46.787Z",
		"__v": 0
	}

```

---

#### **Crear un Ticket**
**Endpoint:** `POST /api/v1/tickets`

- **Autenticación:** Requerida.
- **Verificación del Creador o administrator:** Requerida.
- Crea un nuevo ticket asociado a un evento y usuario.

---

#### **Obtener Tickets por Evento**
**Endpoint:** `GET /api/v1/tickets/event/:eventId`

- **Autenticación:** Requerida.
- **Verificación del Creador o administrator:** Requerida.
- Devuelve todos los tickets asociados a un evento.

---

#### **Obtener Tickets por Usuario**
**Endpoint:** `GET /api/v1/tickets/user/:userId`

- **Autenticación:** Requerida.
- **Verificación del Usuario autenticado:** Requerida.
- Devuelve todos los tickets asociados a un usuario.

---

#### **Obtener Tickets por Evento y Usuario**
**Endpoint:** `GET /api/v1/tickets/event/:eventId/user/:userId`

- **Autenticación:** Requerida.
- **Verificación del Creador o administrator:** Requerida.
- Devuelve todos los tickets asociados a un evento y usuario específicos.

---

## Resumen de Endpoints de Tickets

| **Método** | **Endpoint**                                  | **Descripción**                                            |
| ---------- | --------------------------------------------- | ---------------------------------------------------------- |
| POST       | `/api/v1/tickets`                             | Crea un nuevo ticket                                       |
| PUT        | `/api/v1/tickets/status/:ticketId`            | Modifica el status de un ticket a **"used" o "cancelled"** |
| GET        | `/api/v1/tickets/event/:eventId`              | Obtiene todos los tickets de un evento                     |
| GET        | `/api/v1/tickets/user/:userId`                | Obtiene todos los tickets de un usuario                    |
| GET        | `/api/v1/tickets/event/:eventId/user/:userId` | Obtiene todos los tickets de un usuario en un evento       |

---

# Usuarios

---

## **Cuerpo de la Solicitud para Usuarios**

```json
{
  "userName": "string",       // Requerido: Nombre de usuario único
  "password": "string",       // Requerido: Contraseña del usuario
  "email": "string",          // Requerido: Correo electrónico único
  "avatar": "file"           // Opcional: Imagen de perfil 
}
```

---

## **Endpoints de Usuarios**

### **Obtener Usuario por ID**
**Endpoint:** `GET /api/v1/users/:userId`

- **Autenticación:** Requerida.
- **Autorización:** solo el usuario con mismo id o ser administrator.
- Devuelve los detalles de un usuario específico.
  
```json
	{
		"_id": "67784a087790d458a8eaef58",
		"userName": "admin",
		"roll": "administrator",
		"avatar": "https://res.cloudinary.com/dn6utw1rl/image/upload/v1736101747/users-events/q12bgop3r1axv9war6nm.jpg",
		"createdAt": "2025-01-03T20:35:20.592Z",
		"updatedAt": "2025-01-21T22:52:02.985Z",
		"__v": 0,
		"eventsIds": [
			{
				"_id": "678ec43ce124c363dac94a54",
				"name": "Feria Gastronómica",
				"startDate": "2027-07-11T11:00:00.000Z"
			}
		],
		"email": "manul@gmail.com",
		"ticketsIds": [
			"678ec472463a66112c09c83f",
			"678ec518a8b958ffce88c4fc",
			"678ec57d85052bf246ddaab1"
		]
	}

```

---

### **Obtener Todos los Usuarios**
**Endpoint:** `GET /api/v1/users`

- **Autenticación:** Requerida.
- **Autorización:** Solo los administradores pueden acceder.
- Devuelve la lista de todos los usuarios registrados.

---

### **Crear un Usuario**
**Endpoint:** `POST /api/v1/users`

- **Autenticación:** Requerida.
- **Autorización:** Solo los administradores pueden crear usuarios por este metodo.
- **Subida de Imagen:** Permitida para cargar un avatar.
- Crea un nuevo usuario en el sistema.

---

### **Actualizar el Rol de un Usuario**
**Endpoint:** `PUT /api/v1/users/roll/:userId`

- **Autenticación:** Requerida.
- **Autorización:** Solo los administradores pueden modificar el rol.
- Actualiza el rol de un usuario específico.

---

### **Actualizar Contraseña del Usuario**
**Endpoint:** `PUT /api/v1/users/password/:userId`

- **Autenticación:** Requerida.
- **Autorización:** solo el usuario con mismo id o administrador.
- Actualiza la contraseña del usuario.

---

### **Actualizar un Usuario**
**Endpoint:** `PUT /api/v1/users/:userId`

- **Autenticación:** Requerida.
- **Autorización:** solo el usuario con mismo id o administrador.
- **Subida de Imagen:** Permitida para cargar un avatar.
- Actualiza los datos de un usuario específico.

---

### **Agregar un Evento a un Usuario**
**Endpoint:** `PUT /api/v1/users/:userId/events/:eventId`

- **Autenticación:** Requerida.
- **Autorización:** solo el usuario con mismo id o administrador.
- Agrega un evento al historial del usuario.

---

### **Eliminar un Evento de un Usuario**
**Endpoint:** `DELETE /api/v1/users/:userId/events/:eventId`

- **Autenticación:** Requerida.
- **Autorización:** solo el usuario con mismo id o administrador.
- Elimina un evento del historial del usuario.

---

### **Eliminar un Usuario**
**Endpoint:** `DELETE /api/v1/users/:userId`

- **Autenticación:** Requerida.
- **Autorización:** solo el usuario con mismo id o administrador.
- Elimina un usuario del sistema.

---

## **Resumen de Endpoints de Usuarios**

| **Método** | **Endpoint**                            | **Descripción**                                               |
| ---------- | --------------------------------------- | ------------------------------------------------------------- |
| GET        | `/api/v1/users/:userId`                 | Obtiene un usuario por su ID                                  |
| GET        | `/api/v1/users`                         | Obtiene todos los usuarios                                    |
| POST       | `/api/v1/users`                         | Crea un nuevo usuario                                         |
| PUT        | `/api/v1/users/roll/:userId`            | Actualiza el rol de un usuario                                |
| PUT        | `/api/v1/users/password/:userId`        | Actualiza la contraseña de un usuario                         |
| PUT        | `/api/v1/users/:userId`                 | Actualiza los datos de un usuario                             |
| PUT        | `/api/v1/users/:userId/events/:eventId` | Agrega un evento a la lista eventos de un usuario             |
| DELETE     | `/api/v1/users/:userId/events/:eventId` | Elimina un evento de la lista de eventos de un usuario        |
| DELETE     | `/api/v1/users/:userId`                 | Elimina un usuario siempre que no tenga eventos sin finalizar |



