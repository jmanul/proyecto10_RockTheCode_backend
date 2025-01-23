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
			"eventId": "6791a1d86d91efc38617ae06",
			"eventName": "Concierto de Jazz Nocturno",
			"eventStatus": "not-start",
			"userId": "678d46ceb6c3a65f6e9bcdbb",
			"userName": "juana",
			"reservedPlaces": 1,
			"ticketPrice": 0,
			"ticketPriceVip": 0,
			"ticketStatus": "unused",
			"_id": "6791a2f8942d680349f90a3d",
			"createdAt": "2025-01-23T02:01:28.422Z",
			"qrCode": "data:image/png;base64,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",
			"updatedAt": "2025-01-23T02:01:28.422Z",
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



