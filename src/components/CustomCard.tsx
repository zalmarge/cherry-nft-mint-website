import { DiskOption, RamOption } from "@/types";
import { Flex, Select, Slider, Text } from "@radix-ui/themes";
import React from "react";

type Option = DiskOption | RamOption;

type SelectProps = {
  type: "select";
  title: string;
  subtext?: string;
  options: Option[];
  onChange: (value: string) => void;
  icon?: string;
};

type SliderProps = {
  type: "slider";
  title: string;
  subtext?: string;
  options?: never;
  onChange: (option: Option) => void;
  icon?: string;
};

type Props = SelectProps | SliderProps;

const CustomCard: React.FC<Props> = ({
  title,
  subtext,
  type,
  options,
  onChange,
  icon,
}) => {
  if (type === "slider") {
    return (
      <Flex direction="column" width="100%">
        <Text weight="bold">{title}</Text>
        {subtext && (
          <Text size="1" mt="2" className="opacity-60 font-medium">
            {subtext}
          </Text>
        )}
        <Slider defaultValue={[50]} mt="4" />
      </Flex>
    );
  }

  return (
    <Flex direction="column" width="100%">
      <Flex align={"center"}>
        {icon && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/assets/customIcons.svg#${icon}`}
            alt={`os-logo-${icon}`}
            height={16}
            width={16}
            style={{ display: "block", marginRight: "8px" }} // Optional: add styles if needed
          />
        )}
        <Text weight="bold">{title}</Text>
      </Flex>
      {subtext && (
        <Text size="1" mt="2" className="opacity-60 font-medium">
          {subtext}
        </Text>
      )}
      <Select.Root
        defaultValue={options[0].name}
        onValueChange={(value) => onChange(value)}
      >
        <Select.Trigger className="mt-2" />
        <Select.Content>
          <Select.Group>
            {options.map((option, index) => (
              <Select.Item key={index} value={option.name}>
                <Flex align={"center"} justify={"between"}>
                  <Text className="font-semibold text-xs">{option.name}</Text>
                  {
                    <Text className="font-semibold text-[10px] opacity-70 ml-1">
                      ({option.price === 0 ? "Included" : `${option.price} SOL`}
                      )
                    </Text>
                  }
                </Flex>
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </Flex>
  );
};

export default CustomCard;
