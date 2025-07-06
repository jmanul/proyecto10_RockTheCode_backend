

const calculateFreePlaces = (pass, reservedPlaces) => {

     const freePlaces = pass.maxCapacityPass - pass.totalReservedPlacesPass;
     
     let totalFreePLaces = freePlaces - reservedPlaces;
     return  totalFreePLaces 
 
};

module.exports = calculateFreePlaces;