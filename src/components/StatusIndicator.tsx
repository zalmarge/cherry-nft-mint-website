import { Box, Flex, Text } from "@radix-ui/themes";
import React from "react";

const StatusIndicator = () => {
  return (
    <Flex
      className="bg-[#5773F1] rounded-[50px] select-none"
      p="1"
      py="3"
      align={"center"}
    >
      <Flex
        className="bg-[#D4E3C7] rounded-xl w-5 h-5 justify-center items-center"
        mx="2"
      >
        <Box className="bg-[#6EA544] rounded-xl w-2.5 h-2.5"></Box>
      </Flex>
      <Flex align={"center"}>
        <Text className="text-white text-sm font-medium opacity-70">
          Live ends:
        </Text>
        <Text className="text-white text-sm font-semibold" mx="2">
          Indefinite
        </Text>
      </Flex>
    </Flex>
  );
};

export { StatusIndicator };
