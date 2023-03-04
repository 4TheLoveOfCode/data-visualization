import Head from "next/head";
import Image from "next/image";
import { Anchor, AppShell, Header, Center, Text } from "@mantine/core";
import OECSearchBar from "@/components/oec-searchbar";
import { useRouter } from "next/router";
import TradeChart, { TradeType } from "@/components/trade-chart";
import { fetchData, getCountryName } from "@/utils";
import CountryTradeVisualizer from "@/components/country-trade-visualizer";

function Index(props) {
  const router = useRouter();
  const { country } = router.query;
  const { countries } = props;

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
        navbar={<OECSearchBar countries={countries} />}
        header={
          <Header height={60} p="xs">
            <Anchor href="/">
              <Image src="/oec.svg" alt="oec" width="105" height="36" />
            </Anchor>
          </Header>
        }
        styles={(theme) => ({
          main: {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
            paddingRight: 16,
          },
        })}
      >
        {country ? (
          <CountryTradeVisualizer countries={countries} />
        ) : (
          <Center maw={400} h={100} mx="auto">
            <Text fz="xl" ta="center">
              Type in the searchbar to check a country&apos;s National Trade
              Data
            </Text>
          </Center>
        )}
      </AppShell>
    </>
  );
}

const countriesUrl = `https://oec.world/olap-proxy/members?cube=trade_i_baci_a_92&level=Country&locale=en`;

export async function getServerSideProps(context) {
  let countries;

  try {
    countries = (await fetchData(countriesUrl)).data;
  } catch (e) {
    console.log(e);
  }

  return {
    props: {
      countries,
    },
  };
}

export default Index;
