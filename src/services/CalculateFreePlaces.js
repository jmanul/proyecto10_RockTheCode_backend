

const calculateFreePlaces = (event, reservedPlaces) => {

     const freePlaces = event.maxCapacity - event.totalReservedPlaces;
     if (freePlaces <= 0) {

          throw new Error('soldout');
     }
     if (reservedPlaces > freePlaces) {
          throw new Error(
               `no hay suficientes plazas disponibles, actualmente solo quedan ${freePlaces}`
          )
     };

     return freePlaces;
 
};

module.exports = calculateFreePlaces;