

# API Guide

## Endpoints Overview

| **Endpoint**                        | **Method** | **Description**                                 | **URL Params**                        | **Body**                                                                                         |
| ----------------------------------- | ---------- | ----------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `/api/users/:userId/event/:eventId` | `POST`     | Add an event to a user and generate a ticket.   | `userId` (String), `eventId` (String) | `{ "reservedPlaces": Number }`                                                                   |
| `/api/users/:userId/event/:eventId` | `DELETE`   | Remove an event from a user and cancel tickets. | `userId` (String), `eventId` (String) | None                                                                                             |
| `/api/events/:eventId/tickets`      | `GET`      | Retrieve all tickets for a specific event.      | `eventId` (String)                    | None                                                                                             |
| `/api/tickets`                      | `POST`     | Create a new ticket for an event.               | None                                  | `{ "userId": String, "eventId": String, "reservedPlaces": Number }`                              |
| `/api/tickets/event/:eventId`       | `GET`      | Retrieve tickets by event ID.                   | `eventId` (String)                    | None                                                                                             |
| `/api/users/:userId/tickets`        | `GET`      | Retrieve tickets for a specific user.           | `userId` (String)                     | None                                                                                             |
| `/api/events/:eventId`              | `GET`      | Get details of a specific event.                | `eventId` (String)                    | None                                                                                             |
| `/api/users/:userId`                | `GET`      | Get details of a specific user.                 | `userId` (String)                     | None                                                                                             |
| `/api/events`                       | `POST`     | Create a new event.                             | None                                  | `{ "name": String, "maxCapacity": Number, "price": Number, "startDate": Date, "endDate": Date }` |
