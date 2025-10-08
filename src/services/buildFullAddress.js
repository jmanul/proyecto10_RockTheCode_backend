

export const buildFullAddress = (eventData) => {
     const parts = [
          eventData.address,
          eventData.location,
          eventData.city,
          eventData.postalCode,
          eventData.country?.code
     ].filter(Boolean);

     return parts.map(p => p.trim()).join(', ');
}