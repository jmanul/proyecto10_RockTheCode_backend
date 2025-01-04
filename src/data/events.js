const eventDate = [
     {
          name: "Concierto en la Alhambra",
          type: "Music",
          location: "La Alhambra",
          adress: "Calle Real de la Alhambra, s/n",
          city: "Granada",
          description: "Un concierto mágico en uno de los lugares más emblemáticos de España.",
          startDate: "2025-01-15T20:00:00",
          endDate: "2025-01-15T23:00:00",
          attendees: []
     },
     {
          name: "Maratón de Madrid",
          type: "Sport",
          location: "Parque del Retiro",
          adress: "Plaza de la Independencia, 7",
          city: "Madrid",
          description: "Un evento deportivo para los amantes del running en el corazón de la capital.",
          startDate: "2025-03-10T08:00:00",
          endDate: "2025-03-10T14:00:00",
          attendees: []
     },
     {
          name: "Fiesta Mayor de Sitges",
          type: "Party",
          location: "Plaza del Ayuntamiento",
          adress: "Plaza del Ayuntamiento, 1",
          city: "Sitges",
          description: "Celebración tradicional con música, bailes y fuegos artificiales.",
          startDate: "2025-07-23T18:00:00",
          endDate: "2025-07-23T23:59:00",
          attendees: []
     },
     {
          name: "Taller de fotografía en el Guggenheim",
          type: "Training",
          location: "Museo Guggenheim",
          adress: "Avenida Abandoibarra, 2",
          city: "Bilbao",
          description: "Aprende técnicas avanzadas de fotografía en un entorno único.",
          startDate: "2025-02-05T10:00:00",
          endDate: "2025-02-05T14:00:00",
          attendees: []
     },
     {
          name: "Feria del libro de Barcelona",
          type: "Others",
          location: "Paseo de Gracia",
          adress: "Paseo de Gracia, 15",
          city: "Barcelona",
          description: "Encuentra libros y autores increíbles en esta feria literaria.",
          startDate: "2025-04-21T10:00:00",
          endDate: "2025-04-23T19:00:00",
          attendees: []
     },
     {
          name: "Concierto de Flamenco en Sevilla",
          type: "Music",
          location: "Teatro Lope de Vega",
          adress: "Avenida de María Luisa, s/n",
          city: "Sevilla",
          description: "Disfruta del arte flamenco en su máxima expresión.",
          startDate: "2025-02-14T20:00:00",
          endDate: "2025-02-14T22:30:00",
          attendees: []
     },
     {
          name: "Carrera Popular de Valencia",
          type: "Sport",
          location: "Ciudad de las Artes y las Ciencias",
          adress: "Avenida del Professor López Piñero, 7",
          city: "Valencia",
          description: "Evento deportivo para disfrutar en familia.",
          startDate: "2025-03-25T09:00:00",
          endDate: "2025-03-25T12:00:00",
          attendees: []
     },
     {
          name: "Carnaval de Cádiz",
          type: "Party",
          location: "Centro Histórico de Cádiz",
          adress: "Plaza de San Juan de Dios, s/n",
          city: "Cádiz",
          description: "Una de las celebraciones más divertidas y coloridas de España.",
          startDate: "2025-02-10T18:00:00",
          endDate: "2025-02-18T23:59:00",
          attendees: []
     },
     {
          name: "Curso de cocina gallega",
          type: "Training",
          location: "Centro Gastronómico de Santiago",
          adress: "Rúa de San Francisco, 12",
          city: "Santiago de Compostela",
          description: "Aprende a preparar los platos más tradicionales de Galicia.",
          startDate: "2025-05-05T10:00:00",
          endDate: "2025-05-05T13:00:00",
          attendees: []
     },
     {
          name: "Feria de Abril en Barcelona",
          type: "Others",
          location: "Parc del Fòrum",
          adress: "Carrer de la Pau, 12",
          city: "Barcelona",
          description: "Una versión de la Feria de Abril andaluza en la ciudad condal.",
          startDate: "2025-04-20T18:00:00",
          endDate: "2025-04-25T23:59:00",
          attendees: []
     },
     {
          name: "Concierto sinfónico en Valencia",
          type: "Music",
          location: "Palau de les Arts Reina Sofía",
          adress: "Avenida del Professor López Piñero, 1",
          city: "Valencia",
          description: "Una noche mágica con la orquesta sinfónica de Valencia.",
          startDate: "2025-06-10T20:00:00",
          endDate: "2025-06-10T22:00:00",
          attendees: []
     },
     {
          name: "Torneo de pádel en Málaga",
          type: "Sport",
          location: "Complejo Deportivo La Rosaleda",
          adress: "Paseo Martiricos, 2",
          city: "Málaga",
          description: "Compite o disfruta como espectador en este torneo de pádel.",
          startDate: "2025-07-15T09:00:00",
          endDate: "2025-07-15T18:00:00",
          attendees: []
     },
     {
          name: "Fiesta de San Juan en Alicante",
          type: "Party",
          location: "Playa del Postiguet",
          adress: "Avenida de Villajoyosa, s/n",
          city: "Alicante",
          description: "Celebra la mágica noche de San Juan en la playa.",
          startDate: "2025-06-23T22:00:00",
          endDate: "2025-06-24T02:00:00",
          attendees: []
     },
     {
          name: "Taller de pintura al aire libre",
          type: "Training",
          location: "Parque del Retiro",
          adress: "Plaza de la Independencia, 7",
          city: "Madrid",
          description: "Aprende a plasmar paisajes urbanos en tus lienzos.",
          startDate: "2025-09-15T10:00:00",
          endDate: "2025-09-15T13:00:00",
          attendees: []
     },
     {
          name: "Festival de cine de San Sebastián",
          type: "Others",
          location: "Kursaal",
          adress: "Avenida de Zurriola, 1",
          city: "San Sebastián",
          description: "Descubre lo mejor del cine en este prestigioso festival.",
          startDate: "2025-09-20T10:00:00",
          endDate: "2025-09-27T23:59:00",
          attendees: []
     },
     {
          name: "Festival de Jazz en Madrid",
          type: "Music",
          location: "Teatro Real",
          adress: "Plaza de Isabel II, s/n",
          city: "Madrid",
          description: "Una noche de jazz con artistas nacionales e internacionales.",
          startDate: "2025-03-15T19:30:00",
          endDate: "2025-03-15T22:00:00",
          attendees: []
     },
     {
          name: "Maratón de Barcelona",
          type: "Sport",
          location: "Avenida de la Reina María Cristina",
          adress: "Avenida de la Reina María Cristina, s/n",
          city: "Barcelona",
          description: "Participa o anima en una de las carreras más importantes de España.",
          startDate: "2025-04-07T08:00:00",
          endDate: "2025-04-07T14:00:00",
          attendees: []
     },
     {
          name: "Fiesta Mayor de Gràcia",
          type: "Party",
          location: "Barrio de Gràcia",
          adress: "Carrer Gran de Gràcia, 120",
          city: "Barcelona",
          description: "Calles decoradas y actividades culturales en el corazón de Gràcia.",
          startDate: "2025-08-15T10:00:00",
          endDate: "2025-08-21T23:59:00",
          attendees: []
     },
     {
          name: "Curso de fotografía nocturna",
          type: "Training",
          location: "Cabo de Gata",
          adress: "Parque Natural de Cabo de Gata-Níjar",
          city: "Almería",
          description: "Aprende a capturar estrellas y paisajes nocturnos.",
          startDate: "2025-05-12T20:00:00",
          endDate: "2025-05-12T23:00:00",
          attendees: []
     },
     {
          name: "Feria del Libro de Madrid",
          type: "Others",
          location: "Parque del Retiro",
          adress: "Paseo de Fernán Núñez, s/n",
          city: "Madrid",
          description: "Encuentra autores, presentaciones y miles de libros en esta feria anual.",
          startDate: "2025-06-01T10:00:00",
          endDate: "2025-06-15T21:00:00",
          attendees: []
     },
     {
          name: "Concierto de Rock en Gijón",
          type: "Music",
          location: "Plaza Mayor de Gijón",
          adress: "Plaza Mayor, s/n",
          city: "Gijón",
          description: "Disfruta de las mejores bandas de rock en directo.",
          startDate: "2025-07-20T21:00:00",
          endDate: "2025-07-20T23:30:00",
          attendees: []
     },
     {
          name: "Campeonato de Surf en Fuerteventura",
          type: "Sport",
          location: "Playa de Sotavento",
          adress: "Costa Calma, s/n",
          city: "Fuerteventura",
          description: "Los mejores surfistas del mundo se reúnen en las playas de Canarias.",
          startDate: "2025-08-05T09:00:00",
          endDate: "2025-08-07T18:00:00",
          attendees: []
     },
     {
          name: "Noche de San Valentín en Granada",
          type: "Party",
          location: "Mirador de San Nicolás",
          adress: "Calle Mirador de San Nicolás, 1",
          city: "Granada",
          description: "Una velada romántica con vistas a la Alhambra.",
          startDate: "2025-02-14T20:00:00",
          endDate: "2025-02-14T23:59:00",
          attendees: []
     },
     {
          name: "Taller de cerámica en Toledo",
          type: "Training",
          location: "Centro de Artesanía Toledana",
          adress: "Calle Trinidad, 18",
          city: "Toledo",
          description: "Crea tus propias piezas de cerámica en este taller único.",
          startDate: "2025-04-10T10:00:00",
          endDate: "2025-04-10T14:00:00",
          attendees: []
     },
     {
          name: "Semana Santa en Sevilla",
          type: "Others",
          location: "Casco Antiguo",
          adress: "Calle Sierpes, s/n",
          city: "Sevilla",
          description: "Vive la tradición y solemnidad de la Semana Santa sevillana.",
          startDate: "2025-03-29T18:00:00",
          endDate: "2025-04-05T23:59:00",
          attendees: []
     }
];


module.exports = eventDate;