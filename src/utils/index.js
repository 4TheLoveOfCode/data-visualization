export async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

export const getCountryName = (countries, countryId) => {
  const result = countries.find((c) => c.ID === countryId);
  return Boolean(result) ? result["EN Label"] : "";
};

export const generateDecrementalIntArray = (initialValue, size) => {
  return Array.from({ length: size }, (_, i) => initialValue - i);
};
