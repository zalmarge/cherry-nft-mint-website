import { Program, AnchorProvider } from "@coral-xyz/anchor";
import { CherryServersMarketplace } from "../cherry_servers_marketplace";
import CherryServerIDL from "../programs/idl.json"
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { Connection } from "@solana/web3.js";


  export const getNFTListings = async (wallet: NodeWallet, connection: Connection) => {
    const provider = new AnchorProvider(connection, wallet, {});
  const program = new Program<CherryServersMarketplace>(
    CherryServerIDL as unknown as CherryServersMarketplace,
    provider,
  );
  const listings = await program.account.listing.all();
  return listings;

  }

  export const getNFTStakings = async (wallet: NodeWallet, connection: Connection) => {
    const provider = new AnchorProvider(connection, wallet, {});
  const program = new Program<CherryServersMarketplace>(
    CherryServerIDL as unknown as CherryServersMarketplace,
    provider,
  );
  const stakings = await program.account.stake.all();
  return stakings;

  }