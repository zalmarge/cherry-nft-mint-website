import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import { CherryServersMarketplace } from "../cherry_servers_marketplace";
import CherryServerIDL from "../programs/idl.json"
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, createMint, getAssociatedTokenAddressSync, getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { Metaplex, Nft, PublicKey, walletAdapterIdentity } from "@metaplex-foundation/js";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { ComputeBudgetProgram, Connection, Keypair, LAMPORTS_PER_SOL, Transaction } from "@solana/web3.js";
import { COLLECTION_ADDRESS } from "@/globals";
import toast from "react-hot-toast";
const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");

const getMetadata = async (mint: anchor.web3.PublicKey): Promise<anchor.web3.PublicKey> => {
    return (
      anchor.web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mint.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
      )
    )[0];
  };



  export const delistNFT = async (wallet: NodeWallet, connection: Connection, mint: anchor.web3.PublicKey) => {
    const provider = new AnchorProvider(connection, wallet, {});
  const program = new Program<CherryServersMarketplace>(
    CherryServerIDL as unknown as CherryServersMarketplace,
    provider,
  );
  const listing = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("listing"), mint.toBytes()], program.programId)[0];
    const collection = new anchor.web3.PublicKey(COLLECTION_ADDRESS);

    const metadata = await getMetadata(mint);
    const ownerAta = getAssociatedTokenAddressSync(mint, wallet.publicKey);
    const marketplace = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("config"), collection.toBytes()], program.programId)[0];

    const vault = getAssociatedTokenAddressSync(mint, marketplace, true);
    const ix = await await program.methods
    .delistNft()
    .accountsPartial({
      owner: wallet.publicKey,
      ownerAta,
      mint,
      config: marketplace,
      vault,
      collection: collection,
      listing,
      metadata,
      metadataProgram: TOKEN_METADATA_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: anchor.web3.SystemProgram.programId,
    }).instruction()



    const { blockhash, lastValidBlockHeight } =
      await provider.connection.getLatestBlockhash();
    const txInfo = {
      /** The transaction fee payer */
      feePayer: wallet.publicKey,
      /** A recent blockhash */
      blockhash: blockhash,
      /** the last block chain can advance to before tx is exportd expired */
      lastValidBlockHeight: lastValidBlockHeight,
    };

    const tx = new Transaction(txInfo);
    tx.add(ix);
    const signature = await provider.sendAndConfirm(tx, [], {
        skipPreflight: true,
      });
      toast.success("NFT delisted successfully");

      return signature;
  }