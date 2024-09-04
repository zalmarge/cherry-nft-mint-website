"use client";

import { Hero, ServerCardGrid, TypeFilter } from "@/components";
import { COLLECTION_ADDRESS } from "@/globals";
import {
  getNFTsByCollection,
  getNFTsForOwnerByCollection,
} from "@/onChain/helpers";
import { getNFTListings, getNFTStakings } from "@/onChain/instructions/queries";
import { MarketplaceTabEnum, TypeFilterEnum } from "@/types";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { Box, Flex, Tabs, Text } from "@radix-ui/themes";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [nfts, setNfts] = useState<any[]>([]);
  const { connection } = useConnection();
  const { wallet } = useWallet();

  useEffect(() => {
    const fetchAll = async () => {
      const myNFTs = await getNFTsForOwnerByCollection(
        wallet.adapter.publicKey.toString(),
        COLLECTION_ADDRESS
      );
      const myNFTIDs = myNFTs.map((nft) => nft.id);

      const allNFTs = await getNFTsByCollection(COLLECTION_ADDRESS);
      const listedNFTs = await getNFTListings(
        wallet.adapter as unknown as NodeWallet,
        connection
      );

      const listedIDs = listedNFTs.map((listing) =>
        listing.account.mint.toString()
      );
      const stakedNFTs = await getNFTStakings(
        wallet.adapter as unknown as NodeWallet,
        connection
      );
      const stakedIDs = stakedNFTs.map((stake) =>
        stake.account.mint.toString()
      );
      const nftsWithListings = allNFTs.map((nft) => ({
        ...nft,
        listed: listedIDs.includes(nft.id),
        staked: stakedIDs.includes(nft.id),
        price:
          listedNFTs
            .find((listing) => listing.account.mint.toString() === nft.id)
            ?.account.price.toNumber() /
          10 ** 9,
        ownedByUser: myNFTIDs.includes(nft.id),
        stakedByUser:
          stakedIDs.includes(nft.id) &&
          stakedNFTs
            .find((stake) => stake.account.mint.toString() === nft.id)
            ?.account.owner.toString() === wallet.adapter.publicKey.toString(),
        listedByUser:
          listedIDs.includes(nft.id) &&
          listedNFTs
            .find((listing) => listing.account.mint.toString() === nft.id)
            ?.account.owner.toString() === wallet.adapter.publicKey.toString(),
        listingAccount:
          listedIDs.includes(nft.id) &&
          listedNFTs.find(
            (listing) => listing.account.mint.toString() === nft.id
          )?.account.owner,
        stakingAccount:
          stakedIDs.includes(nft.id) &&
          stakedNFTs.find((stake) => stake.account.mint.toString() === nft.id)
            ?.account.owner,
      }));

      setNfts(nftsWithListings);
    };
    if (wallet && wallet.adapter.publicKey) fetchAll();
  }, [wallet, wallet?.adapter?.publicKey]);

  return (
    <main className="">
      <Hero />
      <Flex className="w-full">
        <Box mb="9" className="w-full">
          <ServerCardGrid nfts={nfts} />
        </Box>
      </Flex>
    </main>
  );
}
