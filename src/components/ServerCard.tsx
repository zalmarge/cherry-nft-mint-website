"use client";

import { delistNFT } from "@/onChain/instructions/delist";
import { listNFT } from "@/onChain/instructions/list";
import { purchaseNFT } from "@/onChain/instructions/purchase";
import { stakeNFT } from "@/onChain/instructions/stake";
import { unstakeNFT } from "@/onChain/instructions/unstake";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import {
  Badge,
  Box,
  Button,
  DropdownMenu,
  Flex,
  Grid,
  IconButton,
  Separator,
  Table,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Connection, PublicKey } from "@solana/web3.js";
import clsx from "clsx";
import {
  CheckIcon,
  ChevronsUpDown,
  Grid3X3Icon,
  LayoutGrid,
  ListIcon,
  PlusIcon,
  DollarSignIcon,
  RotateCw,
  SearchIcon,
  XIcon,
  ArrowDownIcon,
  ArrowUpIcon,
} from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import toast from "react-hot-toast";

const imagePlaceholders = [
  "GrayCoin.png",
  "DarkGrayCoin.png",
  "EmeraldCoin.png",
];

interface Props {
  id: number;
  lastPrice: number;
  mint: string;
  addToCart?: (mint: string) => void;
  isAddedToCart?: boolean;
  removeFromCart?: (mint: string) => void;
  rarity?: number;
  floorDifference?: number;
  owner?: string;
  listedTime?: string;
  randomImage?: string;
  nft: any;
}

const ServerCard: React.FC<Props> = ({
  id,
  mint,
  addToCart,
  isAddedToCart,
  removeFromCart,
  randomImage,
  nft,
}) => {
  const [hovered, setHovered] = useState(false);
  const { wallet, publicKey } = useWallet();
  const { connection } = useConnection();
  const [hoveredAdded, setHoveredAdded] = useState(false);

  const handleStakeNFT = async () => {
    await stakeNFT(
      wallet.adapter as unknown as NodeWallet,
      connection,
      new PublicKey(nft.id)
    );
    const response = await fetch("/api/updateToken", {
      method: "POST",
      body: JSON.stringify({
        publicKey: nft.id,
        wallet: publicKey?.toBase58(),
        action: "stake",
      }),
    });
    console.log(response);
    window.location.reload();
  };

  const handleUnstakeNFT = async () => {
    await unstakeNFT(
      wallet.adapter as unknown as NodeWallet,
      connection,
      new PublicKey(nft.id)
    );
    const response = await fetch("/api/updateToken", {
      method: "POST",
      body: JSON.stringify({
        publicKey: nft.id,
        wallet: publicKey?.toBase58(),
        action: "unstake",
      }),
    });
    window.location.reload();
  };

  const handleListNFT = async () => {
    await listNFT(
      wallet.adapter as unknown as NodeWallet,
      connection,
      new PublicKey(nft.id)
    );
    const response = await fetch("/api/updateToken", {
      method: "POST",
      body: JSON.stringify({
        publicKey: nft.id,
        wallet: publicKey?.toBase58(),
        action: "list",
      }),
    });
    window.location.reload();
  };

  const handleDelistNFT = async () => {
    await delistNFT(
      wallet.adapter as unknown as NodeWallet,
      connection,
      new PublicKey(nft.id)
    );
    const response = await fetch("/api/updateToken", {
      method: "POST",
      body: JSON.stringify({
        publicKey: nft.id,
        wallet: publicKey?.toBase58(),
        action: "delist",
      }),
    });
    window.location.reload();
  };

  const handlePurchaseNFT = async () => {
    await purchaseNFT(
      wallet.adapter as unknown as NodeWallet,
      connection,
      new PublicKey(nft.id),
      nft.listingAccount
    );
    const response = await fetch("/api/updateToken", {
      method: "POST",
      body: JSON.stringify({
        publicKey: nft.id,
        wallet: publicKey?.toBase58(),
        action: "buy",
      }),
    });
    window.location.reload();
  };

  return (
    <Flex
      direction={"column"}
      className={`bg-white p-1 border-2 relative rounded-[4px] ${
        hovered ? "border-blue-500 text-blue" : "border-gray-300 text-gray-500"
      }`}
      align={"center"}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {wallet && nft.ownedByUser && (
        <>
          <Flex
            className={`absolute top-5 right-16 justify-end p-1 bg-blue-100 rounded-2xl cursor-pointer ${
              hoveredAdded ? "bg-rose-100" : ""
            } ${!hoveredAdded && isAddedToCart ? "bg-green-100" : ""}`}
            onClick={handleListNFT}
          >
            <ListIcon></ListIcon>
          </Flex>
          <Flex
            className={`absolute top-5 right-5 justify-end p-1 bg-blue-100 rounded-2xl cursor-pointer ${
              hoveredAdded ? "bg-rose-100" : ""
            } ${!hoveredAdded && isAddedToCart ? "bg-green-100" : ""}`}
            onClick={handleStakeNFT}
          >
            <ArrowDownIcon />
          </Flex>
        </>
      )}
      {wallet && nft.listedByUser && (
        <Flex
          className={`absolute top-5 right-5 justify-end p-1 bg-blue-100 rounded-2xl cursor-pointer ${
            hoveredAdded ? "bg-rose-100" : ""
          } ${!hoveredAdded && isAddedToCart ? "bg-green-100" : ""}`}
          onClick={handleDelistNFT}
        >
          <XIcon></XIcon>
        </Flex>
      )}

      {wallet && nft.stakedByUser && (
        <Flex
          className={`absolute top-5 right-5 justify-end p-1 bg-blue-100 rounded-2xl cursor-pointer ${
            hoveredAdded ? "bg-rose-100" : ""
          } ${!hoveredAdded && isAddedToCart ? "bg-green-100" : ""}`}
          onClick={handleUnstakeNFT}
        >
          <ArrowUpIcon />
        </Flex>
      )}
      <Image
        // src={listing.content.links.image}
        src={`/assets/${randomImage}`}
        alt="Random Coin"
        width={260}
        height={260}
      />
      <Flex
        direction={"column"}
        className="absolute bottom-3 m-auto py-2 rounded-[4px] overflow-hidden backdrop-blur-[5px]"
        minWidth={"92%"}
      >
        <div className="absolute inset-0 bg-[#D9D9DF] opacity-50 z-0"></div>
        <div className="flex flex-col justify-between px-2 items-center z-10 w-full">
          {hovered && (
            <Flex className="flex flex-col w-full">
              {nft.content.metadata.attributes.map((attribute: any) => (
                <Flex align={"center"} justify={"between"} width={"100%"} p="1">
                  <Text className="font-semibold text-sm">
                    {attribute.trait_type}
                  </Text>
                  <Flex align={"center"}>
                    <Text className="font-semibold text-sm" mr="2px">
                      {attribute.value}
                    </Text>
                  </Flex>
                </Flex>
              ))}
            </Flex>
          )}
          <div className="flex justify-between w-full">
            <Flex className="flex justify-center items-center gap-2">
              <Badge>#{id}</Badge>
              <Text className="font-semibold">
                {nft.listed ? nft.price.toFixed(2) + " SOL" : "Not For Sale"}
              </Text>
            </Flex>
            {nft.listed && !nft.listedByUser && (
              <Flex
                className={`justify-end p-1 bg-blue-100 rounded-2xl cursor-pointer ${
                  hoveredAdded ? "bg-rose-100" : ""
                } ${!hoveredAdded && isAddedToCart ? "bg-green-100" : ""}`}
                onClick={handlePurchaseNFT}
              >
                <DollarSignIcon color="var(--blue-9)" size={"18px"} />
              </Flex>
            )}
          </div>
        </div>
      </Flex>
    </Flex>
  );
};

const ServerItem: React.FC<Props> = ({
  id,
  lastPrice,
  mint,
  addToCart,
  isAddedToCart,
  removeFromCart,
  rarity = 80,
  floorDifference = 0.01,
  owner = "F83qn",
  listedTime = "32m",
  nft,
}) => {
  const [hovered, setHovered] = useState(false);
  const [hoveredAdded, setHoveredAdded] = useState(false);
  const { publicKey } = useWallet();

  const randomImage =
    imagePlaceholders[Math.floor(Math.random() * imagePlaceholders.length)];

  const buttonStyles = {
    backgroundColor: "var(--blue-9)",
    color: "white",
    fontWeight: 600,
    width: "100%",
    padding: "0 10px",
    height: "28px",
    fontSize: "10px",
    borderRadius: "4px",
  };

  const hoverStyles = {
    ...buttonStyles,
    backgroundColor: "var(--blue-9)",
    color: "white",
  };

  const handleCartClick = () => {
    if (isAddedToCart) {
      removeFromCart && removeFromCart(mint);
      setHoveredAdded(false);
      toast("Removed");
    } else {
      addToCart && addToCart(mint);
      toast("Added");
    }
  };

  return (
    <Table.Row
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`hover:bg-gray-100`}
    >
      <Table.Cell className="p-0 pl-2">
        <Flex align={"center"} height={"100%"}>
          <Flex
            className={`mr-2 p-1 bg-blue-100 rounded-2xl cursor-pointer ${
              hoveredAdded ? "bg-rose-100" : ""
            } ${!hoveredAdded && isAddedToCart ? "bg-green-100" : ""}`}
            onClick={handleCartClick}
          >
            {isAddedToCart ? (
              <Flex
                onMouseEnter={() => setHoveredAdded(true)}
                onMouseLeave={() => setHoveredAdded(false)}
              >
                {hoveredAdded ? (
                  <XIcon color="var(--red-9)" size={"14px"} />
                ) : (
                  <CheckIcon color="var(--green-9)" size={"14px"} />
                )}
              </Flex>
            ) : (
              <PlusIcon color="var(--blue-9)" size={"14px"} />
            )}
          </Flex>
          <Flex className="bg-gray-100 p-2 rounded">
            <Image
              src={`/assets/${randomImage}`}
              alt="Random Coin"
              width={16}
              height={16}
            />
          </Flex>
          <Flex px="2">
            <Text size={"2"} className="font-semibold opacity-60">
              #{id}
            </Text>
          </Flex>
        </Flex>
      </Table.Cell>
      <Table.Cell className="p-0" align="center">
        <Flex justify="center" align="center" height="100%">
          <Text size={"2"}>{nft.price.toFixed(2)}</Text>
          <Text size={"2"} className="opacity-60 ml-1">
            SOL
          </Text>
        </Flex>
      </Table.Cell>
      <Table.Cell className="p-0" align="center">
        <Flex justify="center" align="center" height="100%">
          <Text size={"2"}>{owner}</Text>
        </Flex>
      </Table.Cell>
      <Table.Cell className="p-0 pr-2" align="center">
        <Flex justify="center" align="center" height="100%">
          <Text size={"2"}>{listedTime}</Text>
        </Flex>
      </Table.Cell>
      <Table.Cell className="p-0 pr-4" align="right">
        <Flex justify="end" align="center" height="100%">
          {publicKey ? (
            <Button
              size={"1"}
              className={clsx(
                "w-24",
                isAddedToCart && hoveredAdded && "bg-[var(--red-9)]",
                isAddedToCart && !hoveredAdded && "bg-[var(--green-9)]"
              )}
              onMouseEnter={() => setHoveredAdded(true)}
              onMouseLeave={() => setHoveredAdded(false)}
              onClick={handleCartClick}
            >
              {isAddedToCart
                ? hoveredAdded
                  ? "Remove"
                  : "In Cart"
                : "Add to Cart"}
            </Button>
          ) : (
            <WalletMultiButton style={buttonStyles}>
              Connect Wallet
            </WalletMultiButton>
          )}
        </Flex>
      </Table.Cell>
    </Table.Row>
  );
};

const ServerCardGrid = ({ nfts }: { nfts: any[] }) => {
  const [layout, setLayout] = useState<"large" | "small" | "stack">("large");
  const [cart, setCart] = useState<Array<String>>([]);
  const [priceFilter, setPriceFilter] = useState<"low_to_high" | "high_to_low">(
    "low_to_high"
  );
  const [refresh, setRefresh] = useState(false);
  const cards = Array.from({ length: 20 }, (_, index) => index);

  const addToCart = (mint: string) => {
    setCart((prev) => {
      if (!prev.includes(mint)) {
        return [...prev, mint];
      }
      return prev;
    });
  };

  const removeFromCart = (mint: string) => {
    setCart((prev) => prev.filter((item) => item !== mint));
  };

  return (
    <>
      <Flex className="px-4" align={"center"}>
        <Box
          p="2"
          className={`mr-[1px] ${
            layout === "large" ? "bg-blue-700" : "bg-gray-100"
          }`}
          onClick={() => setLayout("large")}
        >
          <LayoutGrid
            className={`m-1 text-blue-700 ${
              layout === "large" ? "text-white" : ""
            }`}
            size={"20px"}
          />
        </Box>
        <Box
          p="2"
          className={`mr-[1px] ${
            layout === "small" ? "bg-blue-700" : "bg-gray-100"
          }`}
          onClick={() => setLayout("small")}
        >
          <Grid3X3Icon
            className={`m-1 text-blue-700 ${
              layout === "small" ? "text-white" : ""
            }`}
            size={"20px"}
          />
        </Box>
        <Box
          p="2"
          className={`mr-[1px] ${
            layout === "stack" ? "bg-blue-700" : "bg-gray-100"
          }`}
          onClick={() => setLayout("stack")}
        >
          <ListIcon
            className={`m-1 text-blue-700 ${
              layout === "stack" ? "text-white" : ""
            }`}
            size={"20px"}
          />
        </Box>
        <Separator
          className="h-[70px] w-[1px]"
          orientation={"vertical"}
          ml="4"
        />
        <TextField.Root
          className="h-[70px] w-[62vw] shadow-none rounded-none"
          placeholder="Search items"
        >
          <TextField.Slot>
            <SearchIcon height="16" width="16" />
          </TextField.Slot>
        </TextField.Root>
        <Flex ml="auto">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger className="w-[220px]">
              <Button variant="soft" className="bg-gray-100" size={"3"}>
                <Text className="text-blue-700 font-semibold">
                  Price:{" "}
                  {priceFilter === "low_to_high"
                    ? "Low to High"
                    : "High to Low"}
                </Text>
                <ChevronsUpDown size={"18"} className="-ml-2" />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content
              variant="soft"
              color="blue"
              className="w-[220px]"
            >
              <DropdownMenu.Item onClick={() => setPriceFilter("low_to_high")}>
                Low to High
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => setPriceFilter("high_to_low")}>
                High to Low
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </Flex>
      </Flex>
      <Separator className="w-full" />
      {layout !== "stack" && (
        <Grid
          columns={{
            initial: "1",
            md: layout === "large" ? "4" : "6",
            lg: layout === "large" ? "5" : "7",
          }}
          gap={"3"}
          my="4"
          align={"center"}
          px="4"
        >
          {nfts?.map((nft, index) => (
            <ServerCard
              id={35}
              lastPrice={32.89}
              mint={`${index}`}
              key={index}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              isAddedToCart={cart.includes(`${index}`)}
              nft={nft}
              randomImage={
                imagePlaceholders[
                  Math.floor(Math.random() * imagePlaceholders.length)
                ]
              }
            />
          ))}
        </Grid>
      )}
      {layout === "stack" && (
        <Flex direction={"column"} align={"center"} mt="2" px="4">
          <Table.Root className="w-full">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell className="opacity-60">
                  Item
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="opacity-60" align="center">
                  Listing Price
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="opacity-60" align="center">
                  Owner
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="opacity-60" align="center">
                  Listed Time
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell
                  className="opacity-60 w-32"
                  align="right"
                ></Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {nfts.map((nft, index) => (
                <ServerItem
                  id={35}
                  lastPrice={32.89}
                  mint={`${index}`}
                  key={index}
                  addToCart={addToCart}
                  removeFromCart={removeFromCart}
                  isAddedToCart={cart.includes(`${index}`)}
                  nft={nft}
                />
              ))}
            </Table.Body>
          </Table.Root>
        </Flex>
      )}
    </>
  );
};

export { ServerCard, ServerCardGrid };
