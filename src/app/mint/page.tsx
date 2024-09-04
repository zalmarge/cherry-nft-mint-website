"use client";

import CustomCard from "@/components/CustomCard";
import CustomRadioCard from "@/components/CustomRadioCard";
import TierCard from "@/components/TierCard";
import { mintNFT } from "@/onChain/instructions/mint";
import { DiskOption, DiskType, ItemType, RamOption } from "@/types";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import {
  Badge,
  Box,
  Button,
  Checkbox,
  DropdownMenu,
  Flex,
  Grid,
  RadioCards,
  Select,
  Separator,
  Text,
  TextField,
  Tooltip,
} from "@radix-ui/themes";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair } from "@solana/web3.js";
import { Database, InfoIcon, RotateCw } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
export type ConfigType = {
  uuid: string;
  tier: 1 | 2 | 3;
  ramOptions: RamOption[];
  dataDiskOptions: DiskOption[];
  osDiskOptions: DiskOption[];
};

const Mint = () => {
  const { wallet, publicKey } = useWallet();
  const { connection } = useConnection();
  const [productData, setProductData] = useState<ItemType[] | null>(null);
  const [currentTierOptions, setCurrentTierOptions] = useState<ItemType | null>(
    null
  );
  const [userEmail, setUserEmail] = useState("");
  const [mintCost, setMintCost] = useState(0);
  const [usingCustomConfig, setUsingCustomConfig] = useState(false);
  const [config, setConfig] = useState<ConfigType>({
    uuid: "2b65f69d-48b9-11ef-98b2-0242ac120005",
    tier: 1,
    ramOptions: [{ name: "384GB", price: 0, default: true, id: 0 }],
    dataDiskOptions: [
      { name: "4TB NVMe", price: 0, default: true, id: 0 },
      { name: "4TB NVMe", price: 0, default: true, id: 1 },
    ],
    osDiskOptions: [
      { name: "1TB NVMe", price: 0, default: true, id: 0 },
      { name: "1TB NVMe", price: 0, default: true, id: 1 },
    ],
  });

  const handleDiskChange = (
    os: boolean,
    diskId: number,
    selectedValue: string
  ) => {
    console.log("config", config);
    const newOption = currentTierOptions.disk_options[os ? "os" : "data"].find(
      (disk) => disk.name === selectedValue
    );
    const filteredOptions = os
      ? config.osDiskOptions.filter((disk) => disk.id !== diskId)
      : config.dataDiskOptions.filter((disk) => disk.id !== diskId);
    const newOptions = os
      ? [...filteredOptions, { ...newOption, id: diskId }]
      : [...filteredOptions, { ...newOption, id: diskId }];
    if (os) {
      setConfig((prev) => ({
        ...prev,
        osDiskOptions: newOptions,
      }));
    } else {
      setConfig((prev) => {
        // debugger;
        return {
          ...prev,
          dataDiskOptions: newOptions,
        };
      });
    }
  };

  const handleRamChange = (ramId: number, selectedValue: string) => {
    const newOption = currentTierOptions.ram_options.standard.find(
      (ram) => ram.name === selectedValue
    );
    const filteredOptions = config.ramOptions.filter((ram) => ram.id !== ramId);
    const newOptions = [...filteredOptions, { ...newOption, id: ramId }];

    setConfig((prev) => {
      // debugger;
      return {
        ...prev,
        ramOptions: newOptions,
      };
    });
  };

  console.log(config);

  const handleBuyNFT = async (price: number) => {
    const { signature, mint } = await mintNFT(
      price,
      wallet.adapter as unknown as NodeWallet,
      connection
    );
    console.log(signature, mint);
    const sendProductOrder = async () => {
      const response = await fetch("/api/sendProductOrder", {
        method: "POST",
        body: JSON.stringify({
          product: config,
          email: userEmail,
          publicKey: mint,
          wallet: publicKey?.toBase58(),
        }),
      });
      console.log(response);
    };
    sendProductOrder();
  };

  useEffect(() => {
    const fetchProductData = async () => {
      const productData = await fetch("/api/getProducts");
      console.log("productData", productData);
      const data: ItemType[] = (await productData.json()).productData;
      console.log("productData", data);

      const newData = data.map((product: ItemType) => {
        return {
          ...product,
          numOS: product.disks.reduce(
            (acc: number, disk: DiskType) => acc + (disk === "os" ? 1 : 0),
            0
          ),
          numData: product.disks.reduce(
            (acc: number, disk: DiskType) => acc + (disk === "data" ? 1 : 0),
            0
          ),
        };
      });
      setProductData(newData);
      const newDataIndex: number =
        newData[0].available_qty === "0"
          ? newData[1].available_qty === "0"
            ? 2
            : 1
          : 0;
      const currProduct = newData[0];
      console.log("currProduct", currProduct);
      setCurrentTierOptions(currProduct);
      setConfig((prev) => ({
        ...prev,
        uuid: currProduct.uuid,
        tier: (1 + newDataIndex) as 1 | 2 | 3,
        ramOptions: currProduct.ram.map((ram, index) => ({
          ...currProduct.ram_options.standard.find((option) => option.default),
          id: index,
        })),
        dataDiskOptions: currProduct.disks
          .filter((disk) => disk === "data")
          .map((disk, index) => ({
            ...currProduct.disk_options.data.find((option) => option.default),
            id: index,
          })),
        osDiskOptions: currProduct.disks
          .filter((disk) => disk === "os")
          .map((disk, index) => ({
            ...currProduct.disk_options.os.find((option) => option.default),
            id: index,
          })),
      }));
    };
    fetchProductData();
  }, []);

  useEffect(() => {
    const basePrice = currentTierOptions?.price ?? 0;
    const ramPrice = config.ramOptions.reduce((acc, ram) => acc + ram.price, 0);
    const diskPrice = config.dataDiskOptions.reduce(
      (acc, disk) => acc + disk.price,
      0
    );
    const osDiskPrice = config.osDiskOptions.reduce(
      (acc, disk) => acc + disk.price,
      0
    );
    const totalPrice = basePrice + ramPrice + diskPrice + osDiskPrice;
    setMintCost(totalPrice);
  }, [config, currentTierOptions]);

  return (
    <Flex
      direction={"column"}
      className="px-20 mb-20"
      width={"100%"}
      height={"calc(100% - 60px)"}
    >
      <Grid
        columns={{
          initial: "1",
          md: "3",
        }}
        gap={"3"}
        my="4"
        align={"center"}
      >
        <TierCard
          isSelected={config.tier === 1}
          disabled={!productData || productData[0].available_qty === "0"}
          onSelect={() => {
            const currProduct = productData.find(
              (product: any) => product.name === "Lightweigth"
            );
            setConfig((prev) => ({
              ...prev,
              uuid: currProduct.uuid,
              tier: 1,
              ramOptions: currProduct.ram.map((ram) => ({
                ...currProduct.ram_options.standard.find(
                  (option) => option.default
                ),
              })),
              dataDiskOptions: currProduct.disks
                .filter((disk) => disk === "data")
                .map((disk) => ({
                  ...currProduct.disk_options.data.find(
                    (option) => option.default
                  ),
                })),
              osDiskOptions: currProduct.disks
                .filter((disk) => disk === "os")
                .map((disk) => ({
                  ...currProduct.disk_options.os.find(
                    (option) => option.default
                  ),
                })),
            }));
            setCurrentTierOptions(currProduct);
          }}
          tier={1}
          gpu={{
            type: "RTX 4070",
            cores: 12,
            ghz: 1.8,
          }}
          ram={{ cores: 4, ghz: 4.0 }}
          storage={{
            quantity: 1,
            capacity: 1,
            measurement: "TB",
            type: "NVMe",
            raidLevel: "NO RAID",
          }}
          os="Windows"
        />
        <TierCard
          isSelected={config.tier === 2}
          disabled={!productData || productData[1].available_qty === "0"}
          onSelect={() => {
            const currProduct = productData.find(
              (product: any) => product.name === "Midweight"
            );
            setConfig((prev) => ({
              ...prev,
              uuid: currProduct.uuid,
              tier: 2,
              ramOptions: currProduct.ram.map((ram) => ({
                ...currProduct.ram_options.standard.find(
                  (option) => option.default
                ),
              })),
              dataDiskOptions: currProduct.disks
                .filter((disk) => disk === "data")
                .map((disk) => ({
                  ...currProduct.disk_options.data.find(
                    (option) => option.default
                  ),
                })),
              osDiskOptions: currProduct.disks
                .filter((disk) => disk === "os")
                .map((disk) => ({
                  ...currProduct.disk_options.os.find(
                    (option) => option.default
                  ),
                })),
            }));
            setCurrentTierOptions(currProduct);
          }}
          os="Ubuntu"
          tier={2}
          ram={{ cores: 8, ghz: 4.5 }}
          gpu={{
            type: "RTX 4080",
            cores: 18,
            ghz: 1.8,
          }}
          storage={{
            quantity: 2,
            capacity: 1,
            measurement: "TB",
            type: "NVMe",
            raidLevel: "RAID 0",
          }}
        />
        <TierCard
          isSelected={config.tier === 3}
          disabled={!productData || productData[2].available_qty === "0"}
          onSelect={() => {
            const currProduct = productData.find(
              (product: any) => product.name === "Heavyweigth"
            );
            setConfig((prev) => ({
              ...prev,
              tier: 3,
              uuid: currProduct.uuid,
              ramOptions: currProduct.ram.map((ram) => ({
                ...currProduct.ram_options.standard.find(
                  (option) => option.default
                ),
              })),
              dataDiskOptions: currProduct.disks
                .filter((disk) => disk === "data")
                .map((disk) => ({
                  ...currProduct.disk_options.data.find(
                    (option) => option.default
                  ),
                })),
              osDiskOptions: currProduct.disks
                .filter((disk) => disk === "os")
                .map((disk) => ({
                  ...currProduct.disk_options.os.find(
                    (option) => option.default
                  ),
                })),
            }));
            setCurrentTierOptions(currProduct);
          }}
          os="Linux"
          tier={3}
          ram={{ cores: 16, ghz: 4.7 }}
          gpu={{
            type: "RTX 4090",
            cores: 24,
            ghz: 1.8,
          }}
          storage={{
            quantity: 4,
            capacity: 1,
            measurement: "TB",
            type: "NVMe",
            raidLevel: "RAID 1",
          }}
        />
      </Grid>

      <Flex direction={"column"} align={"center"} width={"100%"}>
        <Flex direction={"column"} width={"50%"}>
          <h1 className="font-bold text-2xl">Hardware Configuration</h1>

          <Flex
            align={"center"}
            mt="2"
            className="bg-white border p-4 rounded"
            justify={"between"}
          >
            <Flex align={"center"}>
              <Checkbox
                checked={usingCustomConfig}
                onCheckedChange={() => setUsingCustomConfig(!usingCustomConfig)}
              />
              <Flex gap="1" direction={"column"} ml="4">
                <Text size={"1"} className="font-bold">
                  Customize Hardware configuration
                </Text>
                <Text size={"1"} className="opacity-60">
                  Custom hardware configuration servers deployment may take{" "}
                  <span className="font-bold">up to 24-48 hours</span> due to
                  manual review
                </Text>
              </Flex>
            </Flex>
          </Flex>
          {usingCustomConfig && (
            <>
              {/* DISK OS */}

              <Flex mt="6">
                <Text className="font-bold min-w-[120px]">Disk (OS)</Text>
                <Grid columns="3" gap="4" rows="repeat(2)" width="auto" ml="9">
                  {Array.from({ length: currentTierOptions.numOS }).map(
                    (_, index) => (
                      <CustomRadioCard
                        key={index}
                        isSelected={true}
                        onClick={() => {
                          console.log("clicked");
                        }}
                      >
                        <Flex className="w-[240px] max-w-[240px]">
                          <CustomCard
                            title={`Disk #${index + 1}`}
                            type="select"
                            options={currentTierOptions.disk_options.os}
                            onChange={(value) =>
                              handleDiskChange(true, index, value)
                            }
                          />
                        </Flex>
                      </CustomRadioCard>
                    )
                  )}
                </Grid>
              </Flex>
              <Separator className="w-full opacity-40" my="6" />
              {/* DISK Data */}

              <Flex>
                <Text className="font-bold min-w-[120px]">Disk (Data)</Text>
                <Grid columns="3" gap="4" rows="repeat(2)" width="auto" ml="9">
                  {Array.from({ length: currentTierOptions.numData }).map(
                    (_, index) => (
                      <CustomRadioCard
                        key={index}
                        isSelected={true}
                        onClick={() => {
                          console.log("clicked");
                        }}
                      >
                        <Flex className="w-[240px] max-w-[240px]">
                          <CustomCard
                            title={`Disk #${index + 1}`}
                            type="select"
                            options={currentTierOptions.disk_options.data}
                            onChange={(value) =>
                              handleDiskChange(false, index, value)
                            }
                          />
                        </Flex>
                      </CustomRadioCard>
                    )
                  )}
                </Grid>
              </Flex>
              <Separator className="w-full opacity-40" my="6" />
              {/* RAM */}

              <Flex>
                <Text className="font-bold min-w-[120px]">RAM</Text>
                <Grid columns="3" gap="4" rows="repeat(2)" width="auto" ml="9">
                  {Array.from({ length: currentTierOptions.ram.length }).map(
                    (_, index) => (
                      <CustomRadioCard
                        key={index}
                        isSelected={true}
                        onClick={() => {
                          console.log("clicked");
                        }}
                      >
                        <Flex className="w-[240px] max-w-[240px]">
                          <CustomCard
                            title={`RAM #${index + 1}`}
                            type="select"
                            options={currentTierOptions.ram_options.standard}
                            onChange={(value) => handleRamChange(index, value)}
                          />
                        </Flex>
                      </CustomRadioCard>
                    )
                  )}
                </Grid>
              </Flex>
            </>
          )}
          <Separator className="w-full opacity-40" my="6" />
        </Flex>
        <Flex
          className="max-w-[40%] min-w-[40%] self-center"
          direction={"column"}
        >
          <TextField.Root placeholder="Enter your email for updates" />
          <Separator className="w-full opacity-40" my="6" />
        </Flex>

        <Flex
          className="max-w-[40%] min-w-[40%] self-center mb-4"
          direction={"column"}
        >
          <Flex
            className="bg-white py-4 border rounded-md"
            direction={"column"}
          >
            <Flex align={"center"} mb="2" px="4">
              <Database size={"12"} className="mr-1" />
              <Text size={"1"} className="font-semibold" mr="2">
                Tier {config.tier} Token
              </Text>
              <Badge color="blue" className="text-xs">
                Tier {config.tier}
              </Badge>
            </Flex>
            <Separator className="w-full opacity-40" my="2" />
            <Flex align={"center"} justify={"between"} px="4" pt="2">
              <Text className="text-blue-700 text-lg font-bold">
                Amount to pay
              </Text>
              <Text className="text-blue-700 text-lg font-bold">
                {mintCost} SOL
              </Text>
            </Flex>
          </Flex>
          <Button
            className="mt-2 h-9"
            onClick={() => {
              handleBuyNFT(mintCost);
            }}
            disabled={mintCost === 0 || !publicKey}
          >
            Mint
          </Button>
        </Flex>
        <Flex justify={"center"} align={"center"} className="bottom-0 sticky">
          <Separator className="w-full opacity-40" />
          <Image
            alt=""
            src="/cherry.svg"
            width={200}
            height={200}
            className="w-4 h-4 grayscale opacity-60"
          />
          <Separator className="w-full opacity-40" />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Mint;
