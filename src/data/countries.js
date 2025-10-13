
// paises y sus codigos de pais 
export const countries = [
     { name: "España", code: "ES" },
     // en el futuro:
      { name: "Francia", code: "FR" },
     // { name: "Portugal", code: "PT" },
];

// busca el pais en el array de paises y devuelve un objeto con el pais y su codigo
export function findCountryByName(countryName) {
     if (!countryName) return null;
     console.log(countryName);
     console.log(countryName.trim().toLowerCase());

     const normalized = countryName.trim().toLowerCase();

     const matched = countries.find(
          (c) => c.name.trim().toLowerCase() === normalized
     );

     return matched ? { name: matched.name, code: matched.code } : null;
}

