import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Title, Select, Box, Flex } from "@mantine/core";
import TradeChart, { TradeType } from "./trade-chart";
import { generateDecrementalIntArray, getCountryName } from "@/utils";

const CountryTradeVisualizer = ({ countries }) => {
  const router = useRouter();
  const { year, country } = router.query;
  const [selectedYear, setSelectedYear] = useState(year ?? "2020");
  useEffect(() => {
    router.push({
      pathname: "/",
      query: { ...router.query, year: selectedYear },
    });
  }, [selectedYear]);
  return (
    <>
      <Flex>
        <Title order={2}>
          {getCountryName(countries, country)}&apos;s National Trade Data for
          year:
        </Title>
        <Box sx={{ width: 150, marginLeft: 16 }}>
          <Select
            defaultValue={selectedYear}
            onChange={setSelectedYear}
            data={generateDecrementalIntArray(2020, 10).map((y) =>
              y.toString()
            )}
          />
        </Box>
      </Flex>
      <TradeChart year={year} country={country} tradeType={TradeType.Export} />
      <TradeChart year={year} country={country} tradeType={TradeType.Import} />
    </>
  );
};

export default CountryTradeVisualizer;
