import type { AppProps } from "next/app";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import "../styles/globals.css";
import Head from "next/head";

// This is the chainId your dApp will work on.
const activeChainId = ChainId.Polygon;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider 
      desiredChainId={activeChainId}
      sdkOptions={{
        gasless: {
          openzeppelin: {
            relayerUrl: "https://api.defender.openzeppelin.com/autotasks/3504672d-f64a-4325-a435-95e68921294f/runs/webhook/f59fc7e6-91d8-468f-9e48-aaa2748579b3/GHREZzNatwfDy4inRXqWCA",
          },
        },
      }}
    >
      <Head>
        <title>Nas.io Community Pass</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Web3 Philippines Minting DApp for Nas.io Community Pass."
        />
        <meta
          name="keywords"
          content="web3ph, web3phl, minting, nas.io, community, pass"
        />
      </Head>
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
