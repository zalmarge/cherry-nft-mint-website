import type { Metadata } from "next";
import "@radix-ui/themes/styles.css";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { Box, Flex, Text, Theme } from "@radix-ui/themes";
import { Footer, Header } from "../components";
import Providers from "./providers";

const openSans = Open_Sans({
  subsets: ["latin"],
  preload: true,
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  title: "Cherry Servers NFT",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={openSans.className}>
        <Theme appearance="light" accentColor="blue">
          <Providers>
            <Box
              display={{
                initial: "block",
                md: "none",
              }}
              height={"100vh"}
            >
              <Flex
                direction={"column"}
                justify={"center"}
                align={"center"}
                height={"100vh"}
              >
                <Text className="font-semibold text-lg">
                  Site is not supported on mobile yet!
                </Text>
                <Text className="text-1">Please visit on desktop</Text>
              </Flex>
            </Box>
            <Box
              display={{
                initial: "none",
                md: "block",
              }}
              height={"100vh"}
            >
              <Header />
              {children}
              {/* <Footer /> */}
            </Box>
          </Providers>
        </Theme>
      </body>
    </html>
  );
}
