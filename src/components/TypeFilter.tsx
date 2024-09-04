import { Button, Flex } from "@radix-ui/themes";
import React from "react";
import { TypeFilterEnum } from "@/types";

interface Props {
  type: TypeFilterEnum;
  selectType: (type: TypeFilterEnum) => void;
}

const TypeFilter: React.FC<Props> = ({ type, selectType }) => {
  return (
    <Flex align={"center"}>
      <Button
        radius="none"
        variant="soft"
        onClick={() => {
          selectType(TypeFilterEnum.All);
        }}
        className={`${
          type === TypeFilterEnum.All ? "bg-blue-600 text-white" : ""
        } mr-0.5`}
      >
        All
      </Button>
      <Button
        radius="none"
        variant="soft"
        onClick={() => {
          selectType(TypeFilterEnum.Launchpad);
        }}
        className={`${
          type === TypeFilterEnum.Launchpad ? "bg-blue-600 text-white" : ""
        } mr-0.5`}
      >
        Launchpad
      </Button>
      <Button
        radius="none"
        variant="soft"
        onClick={() => {
          selectType(TypeFilterEnum.OpenEdition);
        }}
        className={`${
          type === TypeFilterEnum.OpenEdition ? "bg-blue-600 text-white" : ""
        } mr-0.5`}
      >
        Open Edition
      </Button>
    </Flex>
  );
};

export { TypeFilter };
