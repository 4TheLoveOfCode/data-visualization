import React, { useState, useEffect } from "react";
import { useDebounce, useFetch } from "usehooks-ts";
import { Anchor, List, Navbar, TextInput } from "@mantine/core";

const countriesUrl = `https://oec.world/olap-proxy/members?cube=trade_i_baci_a_92&level=Country&locale=en`;

const filterCountries = (countries, searchText) => {
  if (!Boolean(searchText)) return [];
  return countries.filter((c) => {
    return c["EN Label"]?.toLowerCase().includes(searchText.toLowerCase());
  });
};

const OECSearchBar = () => {
  // I thought about using getServerSideProps from the index page,
  // and pass the countries as props here, but at the end I preferreed this approach

  const { data: oecCountries, error } = useFetch(countriesUrl);
  const [search, setSearch] = useState("");
  const [filteredCountries, setFilteredCountries] = useState([]);
  const debouncedSearch = useDebounce(search, 300);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };
  useEffect(() => {
    if (oecCountries) {
      setFilteredCountries(filterCountries(oecCountries.data, debouncedSearch));
    }
  }, [debouncedSearch, oecCountries]);

  return (
    <Navbar p="xs" width={{ base: 300 }}>
      <TextInput
        placeholder="Search by country"
        value={search}
        onChange={handleSearchChange}
        disabled={!Boolean(oecCountries) || Boolean(error)}
      />
      <List
        sx={{
          listStyle: "none",
        }}
      >
        {filteredCountries.map((country) => (
          <List.Item key={country.ID}>
            <Anchor href={`/?country=${country.ID}`}>
              {country["EN Label"]}
            </Anchor>
          </List.Item>
        ))}
      </List>
      {error && <span>search is unavailable, please reload</span>}
    </Navbar>
  );
};

export default OECSearchBar;
