

const calculateFreePlaces = (pass, reservedPlaces) => {

     const freePlaces = pass.maxCapacityPass - pass.totalReservedPlacesPass;
     if (freePlaces <= 0) {

          throw new Error('soldout!!, ya no hay plazas disponibles');
     }
     if (reservedPlaces > freePlaces) {
          throw new Error(
               `no hay suficientes plazas disponibles, actualmente solo quedan ${freePlaces}`
          )
     };
     
     let totalFreePLaces = freePlaces - reservedPlaces;
     return totalFreePLaces
 
};

module.exports = calculateFreePlaces;