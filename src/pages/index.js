import Head from "next/head";
import Image from "next/image";
import { AppShell, Header } from "@mantine/core";
import OECSearchBar from "@/components/oec-searchbar";
import { useRouter } from "next/router";
import TradeChart, { TradeType } from "@/components/trade-chart";

export default function Home() {
  const router = useRouter();
  const { country, year } = router.query;

  return (
    <>
      <Head>
        <title>D3 Data Visualization</title>
        <meta
          name="description"
          content="A technical challenge about data visualization and nextjs"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppShell
        padding="md"
        navbar={<OECSearchBar />}
        header={
          <Header height={60} p="xs">
            <Image src="/oec.svg" alt="oec" width="70" height="24" />
          </Header>
        }
        styles={(theme) => ({
          main: {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
          },
        })}
      >
        {country && (
          <TradeChart
            year={year}
            country={country}
            tradeType={TradeType.Export}
          />
        )}

        {country && (
          <TradeChart
            year={year}
            country={country}
            tradeType={TradeType.Import}
          />
        )}
      </AppShell>
    </>
  );
}
