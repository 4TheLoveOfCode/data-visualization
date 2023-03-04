import { useRouter } from "next/router";
import React from "react";
import { useFetch } from "usehooks-ts";
import { Treemap } from "d3plus-react";

export const TradeType = {
  Export: "Exporter",
  Import: "Importer",
};

const TradeToTreemapDataConverter = (trade) => ({
  id: trade["HS2 ID"],
  parent: trade.HS2,
  value: trade["Trade Value"],
});

const getTradeApiUrl = (tradeType, country, year = 2020) =>
  `https://oec.world/olap-proxy/data.jsonrecords?${
    TradeType[tradeType]
  }+Country=${country}&Year=${year.toString()}&cube=trade_i_baci_a_92&drilldowns=HS2&measures=Trade+Value&token=6e4305fa8187405a83a49c15de8dac1e`;

const TradeChart = (props) => {
  const { tradeType, country, year } = props;
  const { data: tradeData, error } = useFetch(
    getTradeApiUrl(tradeType, country, parseInt(year))
  );

  if (!Boolean(tradeData)) return "";

  return (
    <>
      <Treemap
        config={{
          data: tradeData.data.map(TradeToTreemapDataConverter),
        }}
      />
    </>
  );
};

export default TradeChart;
