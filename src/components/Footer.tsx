"use client";

import { Box, Flex, Separator, Text } from "@radix-ui/themes";
import { MessageCircle, Settings } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const Footer = () => {
  const [isComingSoon, setIsComingSoon] = useState(false);
  return (
    <Flex
      align={"center"}
      justify={"between"}
      className="bottom-0 fixed w-full bg-white px-2 border-t-[1px] border-t-slate-300 select-none"
      height={"44px"}
    >
      <Flex align={"center"} height={"100%"}>
        <Flex align={"center"} px="3" height={"100%"}>
          <Flex
            className="bg-[#D4E3C7] rounded-xl w-4 h-4 justify-center items-center"
            mr="1"
          >
            <Box className="bg-[#6EA544] rounded-xl w-2 h-2"></Box>
          </Flex>
          <Text size={"2"}>Live Data</Text>
        </Flex>
        <Separator orientation={"vertical"} className="h-full" />
        <Flex align={"center"} px="3" height={"100%"}>
          <Text size={"2"} className="opacity-70">
            Total Vol:
          </Text>
          <Text size={"2"} className="font-medium" ml="1">
            64,396,996
          </Text>
          <Text size={"2"} className="opacity-70" ml="1">
            SOL
          </Text>
        </Flex>
      </Flex>
      <Flex align={"center"} height={"100%"}>
        <Flex align={"center"} px="3">
          {/* SOLANA */}
          <Flex align={"center"}>
            <svg className={"mr-1"} width={"20px"} height={"20px"}>
              <use xlinkHref={"/assets/customIcons.svg#solana-gray"} />
            </svg>
            <Text size={"2"}>152.01</Text>
          </Flex>
        </Flex>
        <Separator orientation={"vertical"} className="h-full" />
        <Flex align={"center"} px="3">
          <Text size={"2"} className="opacity-70" mr="1">
            TPS:
          </Text>
          <Text size={"2"} className="font-medium">
            2413
          </Text>
        </Flex>
        <Separator orientation={"vertical"} className="h-full" />
        <Flex align={"center"} px="3">
          <Settings size={"20px"} />
        </Flex>
        <Separator orientation={"vertical"} className="h-full" />
        <Flex
          align={"center"}
          px="3"
          onClick={() => {
            toast("Coming Soon!", {
              position: "bottom-right",
              className: "mb-10",
            });
          }}
        >
          <MessageCircle size={"20px"} />
          <Text size={"2"} ml="1">
            Support
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export { Footer };
