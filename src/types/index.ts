export enum MarketplaceTabEnum {
  Items = "items",
  Offers = "offers",
  Pools = "pools",
}

export enum TimeFilterTabEnum {
  LiveAndUpcoming = "live_upcoming",
  Past = "past",
}

export enum TypeFilterEnum {
  All = "all",
  Launchpad = "launchpad",
  OpenEdition = "open_edition",
}

export type RamOption = {
  name: string;
  default: boolean;
  price: number;
  id?: number;
};

export type DiskOption = {
  name: string;
  default: boolean;
  price: number;
  id?: number;
};

export type DiskType = "os" | "data";

export type ItemType = {
  uuid: string;
  name: string;
  description: string;
  available_qty: string;
  price: number;
  cpu: string;
  ram: string[];
  numOS: number;
  numData: number;
  ram_options: {
    standard: RamOption[];
  };
  disks: DiskType[];
  disk_options: {
    [key in DiskType]: DiskOption[];
  };
};
