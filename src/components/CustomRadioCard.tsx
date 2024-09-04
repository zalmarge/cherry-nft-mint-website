import { Flex } from "@radix-ui/themes";
import React from "react";

interface Props {
  children: React.ReactNode;
  isSelected?: boolean;
  onClick: () => void;
}

const CustomRadioCard: React.FC<Props> = ({
  children,
  isSelected,
  onClick,
}) => {
  return (
    <Flex
      className={`bg-white border-2 p-4 rounded-md ${
        isSelected ? "border-blue-600" : ""
      }`}
      onClick={onClick}
    >
      {children}
    </Flex>
  );
};

export default CustomRadioCard;
