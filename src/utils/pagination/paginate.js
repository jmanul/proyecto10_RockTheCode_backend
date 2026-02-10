/**
 * Utilidad reutilizable para paginación de consultas MongoDB
 * 
 * @param {Object} options - Opciones de paginación
 * @param {Object} options.model - Modelo de Mongoose
 * @param {Object} options.query - Filtros de búsqueda (ej: { eventStatus: 'not-start' })
 * @param {Object} options.populate - Configuración de populate (opcional)
 * @param {Object} options.sort - Ordenamiento (ej: { createdAt: -1 })
 * @param {number} options.page - Número de página (default: 1)
 * @param {number} options.limit - Elementos por página (default: 10)
 * @param {string} options.select - Campos a seleccionar (opcional)
 * 
 * @returns {Object} { data, pagination }
 */
const paginate = async ({
     model,
     query = {},
     populate = null,
     sort = { createdAt: -1 },
     page = 1,
     limit = 10,
     select = null
}) => {
     try {
          // Asegurar valores válidos
          const currentPage = Math.max(1, parseInt(page) || 1);
          const itemsPerPage = Math.max(1, Math.min(100, parseInt(limit) || 10)); // Máximo 100 por página
          const skip = (currentPage - 1) * itemsPerPage;

          // Contar total de documentos
          const totalItems = await model.countDocuments(query);
          const totalPages = Math.ceil(totalItems / itemsPerPage);

          // Construir la consulta
          let queryBuilder = model.find(query)
               .sort(sort)
               .skip(skip)
               .limit(itemsPerPage);

          // Aplicar populate si existe
          if (populate) {
               queryBuilder = queryBuilder.populate(populate);
          }

          // Aplicar select si existe
          if (select) {
               queryBuilder = queryBuilder.select(select);
          }

          // Ejecutar consulta
          const data = await queryBuilder;

          // Construir respuesta de paginación
          const pagination = {
               currentPage,
               itemsPerPage,
               totalItems,
               totalPages,
               hasNextPage: currentPage < totalPages,
               hasPrevPage: currentPage > 1,
               nextPage: currentPage < totalPages ? currentPage + 1 : null,
               prevPage: currentPage > 1 ? currentPage - 1 : null
          };

          return { data, pagination };

     } catch (error) {
          throw new Error(`Error en paginación: ${error.message}`);
     }
};

module.exports = { paginate };
