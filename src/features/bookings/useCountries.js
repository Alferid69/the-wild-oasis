import { useEffect, useState } from "react";

export function useCountries() {
  const [countries, setCountries] = useState([]);
  useEffect(function () {
    async function fetchCountries() {
      const res = await fetch("https://restcountries.com/v3.1/all");
      const data = await res.json();
      const countriesData = data?.map((country) => ({
        name: country.name.common,
        flag: country.flags.svg,
      })).sort((a, b) => a.name.localeCompare(b.name)); // Sort the countries by name;
      setCountries(countriesData)
      
    }
    fetchCountries();
  }, []);

  return  countries;

}
