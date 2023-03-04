import { useRouter } from "next/router";
import React from "react";
import { useFetch } from "usehooks-ts";
import { Treemap } from "d3plus-react";
import { Title, Loader, Text } from "@mantine/core";
import _ from "lodash";

export const TradeType = {
  Export: "Exporter",
  Import: "Importer",
};

const TradeToTreemapDataConverter = (trade) => ({
  id: trade.HS2,
  parent: trade["HS2 ID"],
  value: trade["Trade Value"],
});

const getTradeApiUrl = (tradeType, country, year = "2020") =>
  `https://oec.world/olap-proxy/data.jsonrecords?${tradeType}+Country=${country}&Year=${year}&cube=trade_i_baci_a_92&drilldowns=HS2&measures=Trade+Value&token=6e4305fa8187405a83a49c15de8dac1e`;

const TradeChart = (props) => {
  const { tradeType, country, year } = props;
  const lastYear = year ? (parseInt(year) - 1).toString() : "2019";
  const dataUrl = getTradeApiUrl(tradeType, country, year);
  const lastYearDataUrl = getTradeApiUrl(tradeType, country, lastYear);
  const { data: tradeData, error: tradeError } = useFetch(dataUrl);
  const { data: lastYearTradeData, error: lastYearError } =
    useFetch(lastYearDataUrl);
  const thisYearMax = tradeData
    ? _.orderBy(tradeData.data, ["Trade Value"], ["desc"])[0]
    : null;
  const lastYearMax = lastYearTradeData
    ? _.orderBy(lastYearTradeData.data, ["Trade Value"], ["desc"])[0]
    : null;

  return (
    <>
      <Title order={3}>
        {tradeType === TradeType.Export ? "Exports" : "Imports"}
      </Title>
      {thisYearMax &&
        lastYearMax &&
        thisYearMax["HS2 ID"] !== lastYearMax["HS2 ID"] && (
          <Text fs="italic">
            {`${year} most ${
              tradeType === TradeType.Export ? "exported" : "imported"
            } goods were ${thisYearMax.HS2}, vs ${lastYear} which were ${
              lastYearMax.HS2
            }`}
          </Text>
        )}
      {!Boolean(tradeData) ? (
        <Loader />
      ) : (
        <Treemap
          config={{
            data: tradeData.data.map(TradeToTreemapDataConverter),
          }}
        />
      )}
    </>
  );
};

export default TradeChart;
