import { Box, Button, Flex, Link, Text } from "@radix-ui/themes";
import Image from "next/image";
import React from "react";
import { StatusIndicator } from "./StatusIndicator";

const Hero = () => {
  return (
    <Flex position={"relative"}>
      <Image
        src="/assets/hero-background.png"
        alt="hero"
        height={2880}
        width={916}
        className="w-full h-[430px] absolute z-10 object-cover"
      />
      <Flex
        className="z-20 h-[430px]"
        width={"100%"}
        justify={"center"}
        align={"center"}
        direction={"column"}
      >
        <Text className="text-white text-6xl font-medium">
          Cherry Servers NFT
        </Text>

        <Flex maxWidth={"50%"} mt="6">
          <Text className="text-white font-semibold" align={"center"}>
            orem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sit
            amet lacus nisi. Duis aliquet nulla non lobortis eleifend. Donec
            lacinia nisi in erat dignissim tristique. Praesent interdum
            consequat nulla in consequat. Maecenas pulvinar.
          </Text>
        </Flex>
        <Button size={"3"} className="bg-white text-blue-600" mt="6">
          <Link href={"/mint"}>Go to launchpad</Link>
        </Button>
      </Flex>
    </Flex>
  );
};

export { Hero };
