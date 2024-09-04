"use client";

import { Avatar, Box, Button, Flex, Separator, Text } from "@radix-ui/themes";
import { FolderOpen, PlusIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
export const WalletMultiButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);
const Header = () => {
  const pathname = usePathname();
  const isServers = useMemo(() => pathname === "/", [pathname]);
  const isNetwork = useMemo(() => pathname === "/network", [pathname]);
  const isStorages = useMemo(() => pathname === "/storages", [pathname]);
  const buttonStyles = {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "var(--accent-a3)",
    color: "var(--blue-10)",
    fontWeight: 600,
    width: "160px",
    padding: "20px 10px",
    height: "20px",
    fontSize: "14px",
  };
  return (
    <Flex
      align={"center"}
      justify={"between"}
      height={"60px"}
      px="5"
      className="border-b-[0.5px] border-b-slate-300 w-full sticky top-0 z-50 bg-white"
    >
      {/* LEFT */}
      <Flex align={"center"} height={"100%"}>
        {/* LOGO */}
        <Link href={"/"}>
          <Box pr="5">
            <Image
              alt=""
              src="/cherry.svg"
              width={200}
              height={200}
              className="w-8 h-8"
            />
          </Box>
        </Link>
        {/* TEAM */}

        <Separator orientation={"vertical"} className="h-full" />
        {/* NAVIGATION */}
        <Flex align={"center"} px="5">
          <Box mx="2">
            <Link
              href={"/"}
              className={`font-semibold cursor-pointer ${
                isServers ? "text-red" : ""
              }`}
            >
              Servers
            </Link>
          </Box>{" "}
        </Flex>
        <Separator orientation={"vertical"} className="h-full" />
        {/* INSTANCE */}
        <Flex align={"center"} px="5">
          <Button asChild>
            <Link href={"/mint"}>
              New instance
              <PlusIcon size={"18"} />
            </Link>
          </Button>
        </Flex>
      </Flex>
      {/* Right */}
      <Flex align={"center"} height={"100%"}>
        <WalletMultiButton style={buttonStyles} />

        <Separator orientation={"vertical"} className="h-full" ml="5" />
        <Flex pl={"5"}>
          <Avatar fallback="V" radius="full" />
        </Flex>
      </Flex>
    </Flex>
  );
};

export { Header };
