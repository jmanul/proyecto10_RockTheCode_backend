
// convierte a booleano otros valores que reciba por ejemplo de un input checkbox de un input 
export const toBoolean = (value) => {
   
     if (typeof value === 'string') {
          const v = value.trim().toLowerCase();
          if (['true', '1', 'yes', 'si', 'sí', 'on', 'privado', 'Privado'].includes(v))
          return true;
          if (['false', '0', 'no', 'off','Público', 'Publico' , 'público', 'publico'].includes(v)) return false;
     }

     
     return Boolean(value);
};