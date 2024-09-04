import { Flex, Separator, Text } from "@radix-ui/themes";
import Image from "next/image";
import React from "react";

interface Props {
  tier: 1 | 2 | 3;
  ram: {
    cores: number;
    ghz: number;
  };
  storage: {
    quantity: number;
    capacity: number;
    measurement: string;
    type: string;
    raidLevel: string;
  };
  os: string;
  gpu: {
    type: string;
    cores: number;
    ghz: number;
  };
  isSelected?: boolean;
  onSelect?: () => void;
  disabled?: boolean;
}

const TierCard: React.FC<Props> = ({
  tier,
  ram,
  storage,
  gpu,
  os,
  isSelected = false,
  disabled = false,
  onSelect,
}) => {
  return (
    <Flex
      direction={"column"}
      minWidth={"392px"}
      className={`bg-white border-2 rounded-sm hover:border-blue-500 ${
        isSelected ? "border-blue-500" : ""
      } ${disabled ? "opacity-50 cursor-not-allowed select-none" : ""}`}
      onClick={disabled ? () => {} : onSelect}
    >
      <Flex p="4">
        <Text className="uppercase font-semibold" size={"1"}>
          Tier {tier}
        </Text>
      </Flex>
      <Image
        src={`/assets/Tier${tier}.svg`}
        alt=""
        width={512}
        height={512}
        className="w-52 h-5w-52 self-center mb-10"
      />
      <Separator orientation={"horizontal"} className="w-full" />
      <Flex align={"center"} justify={"between"} width={"100%"} p="4">
        <Text className="font-semibold text-sm">RAM</Text>
        <Flex align={"center"}>
          <Text className="font-semibold text-sm" mr="1">
            {ram.cores} cores
          </Text>
          <Text className="font-semibold text-sm" mr="1">
            @
          </Text>
          <Text className="font-semibold text-sm" mr="2px">
            {ram.ghz}
          </Text>
          <Text className="font-semibold text-sm">GHz</Text>
        </Flex>
      </Flex>
      <Separator orientation={"horizontal"} className="w-full" />
      <Flex align={"center"} justify={"between"} width={"100%"} p="4">
        <Text className="font-semibold text-sm">GPU</Text>
        <Flex align={"center"}>
          <Text className="font-semibold text-sm" mr="1">
            {gpu.type}
          </Text>
          <Text className="font-semibold text-sm" mr="1">
            {gpu.cores} cores
          </Text>
          <Text className="font-semibold text-sm" mr="1">
            @
          </Text>
          <Text className="font-semibold text-sm" mr="2px">
            {gpu.ghz}
          </Text>
          <Text className="font-semibold text-sm">GHz</Text>
        </Flex>
      </Flex>
      <Separator orientation={"horizontal"} className="w-[96%]" mx="2" />
      <Flex align={"center"} justify={"between"} width={"100%"} p="4">
        <Text className="font-semibold text-sm">Storage</Text>
        <Flex align={"center"}>
          <Text className="font-semibold text-sm" mr="1">
            {storage.quantity}x
          </Text>
          <Text className="font-semibold text-sm" mr="1">
            {storage.capacity}
            {storage.measurement}
          </Text>
          <Text className="font-semibold text-sm" mr="1">
            {storage.type}
          </Text>
          <Text className="font-semibold text-sm">{storage.raidLevel}</Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default TierCard;
