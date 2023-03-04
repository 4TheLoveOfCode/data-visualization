import React, { useState, useEffect } from "react";
import { useDebounce, useFetch } from "usehooks-ts";
import { useRouter } from "next/router";
import { Anchor, List, Navbar, TextInput, CloseButton } from "@mantine/core";
import { getCountryName } from "@/utils";

const countriesUrl = `https://oec.world/olap-proxy/members?cube=trade_i_baci_a_92&level=Country&locale=en`;

const filterCountries = (countries, searchText) => {
  if (!Boolean(searchText)) return [];
  return countries.filter((c) => {
    return c["EN Label"]?.toLowerCase().includes(searchText.toLowerCase());
  });
};

const OECSearchBar = ({ countries }) => {
  const router = useRouter();
  const { country } = router.query;

  const { data: oecCountries, error } = useFetch(countriesUrl);
  const [search, setSearch] = useState(getCountryName(countries, country));
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
        rightSection={
          Boolean(search) ? (
            <CloseButton
              title="Clear"
              size="sm"
              onClick={() => {
                setSearch("");
              }}
            />
          ) : null
        }
      />
      <List
        sx={{
          listStyle: "none",
        }}
      >
        {filteredCountries.map((country) => (
          <List.Item key={country.ID}>
            <Anchor href={`/?country=${country.ID}&year=2020`}>
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
