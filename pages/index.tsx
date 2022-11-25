import {
  useClaimedNFTSupply,
  useContractMetadata,
  useUnclaimedNFTSupply,
  useActiveClaimCondition,
  Web3Button,
  useContract,
} from "@thirdweb-dev/react";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import type { NextPage } from "next";
import { useState } from "react";
import styles from "../styles/Theme.module.css";

// Put Your NFT Drop Contract address from the dashboard here
const signatureDropAddress = "0xeb628a3f3141c6f6384c2a62d58968f740f16c2a";

const Home: NextPage = () => {
  const { contract: signatureDrop } = useContract(
    signatureDropAddress,
    "signature-drop"
    );

  // The amount the user claims
  const [quantity, setQuantity] = useState(1); // default to 1

  // Load contract metadata
  const { data: contractMetadata } = useContractMetadata(signatureDrop);

  // Load claimed supply and unclaimed supply
  const { data: unclaimedSupply } = useUnclaimedNFTSupply(signatureDrop);
  const { data: claimedSupply } = useClaimedNFTSupply(signatureDrop);

  // Load the active claim condition
  const { data: activeClaimCondition } = useActiveClaimCondition(signatureDrop);

  // Check if there's NFTs left on the active claim phase
  const isNotReady =
    activeClaimCondition &&
    parseInt(activeClaimCondition?.availableSupply) === 0;

  // Check if there's any NFTs left
  const isSoldOut = unclaimedSupply?.toNumber() === 0;

  // Check price
  const price = parseUnits(
    activeClaimCondition?.currencyMetadata.displayValue || "0",
    activeClaimCondition?.currencyMetadata.decimals
  );

  // Multiply depending on quantity
  const priceToMint = price.mul(quantity);

  // Loading state while we fetch the metadata
  if (!signatureDrop || !contractMetadata) {
    return <div className={styles.container}>⏳ Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.mintInfoContainer}>
        <div className={styles.infoSide}>
          <a href="https://web3philippines.org" target="_blank" rel="noreferrer">
            <img
              src="/web3phl.png"
              alt="Web3 Philippines Logo"
              width={250}
              className={styles.buttonGapTop}
            />
          </a>
          {/* Title of your NFT Collection */}
          <h1>Community Pass (Nas.io)</h1>
          {/* Description of your NFT Collection */}
          <p className={styles.description}>
            Unique <b>non-fungible token</b> and <b>non-transferable pass</b> for Web3 Philippines community members to enter the Nas.io community-building platform. Our official partnership with the Nas.io platform.<br/><br/>
            <a href="https://web3philippines.org/discord" target="_blank" rel="noreferrer" className={styles.link}>
              <b>Got the Nas Community Pass?</b>
            </a> 🎫 <br/><br/>
            Join our Discord and claim your role in <b>#nas-pass</b> channel.
          </p>
        </div>

        <div className={styles.imageSide}>
          {/* Image Preview of NFTs */}
          <a href="https://opensea.io/collection/web3phl-community-pass" target="_blank" rel="noreferrer">
            <img
              className={styles.image}
              src={contractMetadata?.image}
              alt={`${contractMetadata?.name} preview image`}
            />
          </a>

          {/* Amount claimed so far */}
          <div className={styles.mintCompletionArea}>
            <div className={styles.mintAreaLeft}>
              <p>Total Minted</p>
            </div>
            <div className={styles.mintAreaRight}>
              {claimedSupply && unclaimedSupply ? (
                <p>
                  {/* Claimed supply so far */}
                  <b>{claimedSupply?.toNumber()}</b>
                  {" / "}
                  {
                    // Add unclaimed and claimed supply to get the total supply
                    claimedSupply?.toNumber() + unclaimedSupply?.toNumber()
                  }
                </p>
              ) : (
                // Show loading state if we're still loading the supply
                <p>⏳ Loading...</p>
              )}
            </div>
          </div>

          {/* Show claim button or connect wallet button */}
          {
            // Sold out or show the claim button
            isSoldOut ? (
              <div>
                <h2>❌ Sold Out</h2>
              </div>
            ) : isNotReady ? (
              <div>
                <h2>Not ready to be minted yet</h2>
              </div>
            ) : (
              <>
                <div className={styles.mintContainer}>
                  <Web3Button
                    contractAddress={signatureDropAddress}
                    action={async (contract) =>
                      await contract.erc721.claim(quantity)
                    }
                    // If the function is successful, we can do something here.
                    onSuccess={(result) =>
                      alert(
                        `Successfully minted ${result.length} NFT${
                          result.length > 1 ? "s" : ""
                        }!`
                      )
                    }
                    // If the function fails, we can do something here.
                    onError={(error) => alert(error?.message)}
                    accentColor="#f213a4"
                    colorMode="dark"
                  >
                    {`Mint${quantity > 1 ? ` ${quantity}` : ""}${
                      activeClaimCondition?.price.eq(0)
                        ? " (Free)"
                        : activeClaimCondition?.currencyMetadata.displayValue
                        ? ` (${formatUnits(
                            priceToMint,
                            activeClaimCondition.currencyMetadata.decimals
                          )} ${activeClaimCondition?.currencyMetadata.symbol})`
                        : ""
                    }`}
                  </Web3Button>
                </div>
                <p className={styles.notice}>
                  You only need one access pass.<br/>
                  Not tradable and transferable. ⚠️
                </p>
              </>
            )
          }
        </div>
      </div>
      {/* Powered by thirdweb */}{" "}
      <div className={styles.partnerImageContainer}>
        <img
          src="/polygon.png"
          alt="Polygon Logo"
          width={135}
        />
        <img
          src="/thirdweb.png"
          alt="thirdweb Logo"
          width={135}
        />
        <img
          src="/nas.png"
          alt="Nas.io Logo"
          width={135}
        />
      </div>
    </div>
  );
};

export default Home;
