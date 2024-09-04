import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import { CherryServersMarketplace } from "../cherry_servers_marketplace";
import CherryServerIDL from "../programs/idl.json"
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, createMint, getAssociatedTokenAddressSync, getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { Metaplex, Nft, PublicKey, walletAdapterIdentity } from "@metaplex-foundation/js";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { ComputeBudgetProgram, Connection, Keypair, LAMPORTS_PER_SOL, Transaction } from "@solana/web3.js";
import { COLLECTION_ADDRESS } from "@/globals";
const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
import toast from "react-hot-toast";

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

  const getMasterEdition = async (mint: anchor.web3.PublicKey): Promise<anchor.web3.PublicKey> => {
    return (
      anchor.web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mint.toBuffer(),
          Buffer.from("edition"),
        ],
        TOKEN_METADATA_PROGRAM_ID
      )
    )[0];
  };

  const getTokenRecord = async (mint: anchor.web3.PublicKey, ata: anchor.web3.PublicKey): Promise<anchor.web3.PublicKey> => {
    return (
      anchor.web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mint.toBuffer(),
          Buffer.from("token_record"),
          ata.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
      )
    )[0];
  };

  export const mintNFT = async (price: number, wallet: NodeWallet, connection: Connection) => {
    const provider = new AnchorProvider(connection, wallet, {});
  const program = new Program<CherryServersMarketplace>(
    CherryServerIDL as unknown as CherryServersMarketplace,
    provider,
  );
    const mint = await anchor.web3.Keypair.generate();
    const collection = new anchor.web3.PublicKey(COLLECTION_ADDRESS);
    const vault = await anchor.web3.Keypair.generate().publicKey;

    const destination = getAssociatedTokenAddressSync(mint.publicKey, wallet.publicKey);

    const metadata = await getMetadata(mint.publicKey);
    const edition = await getMasterEdition(mint.publicKey);
    const collectionMetadata = await getMetadata(collection);
    const collectionMasterEdition = await getMasterEdition(collection);

    const tokenRecord = await getTokenRecord(mint.publicKey, destination);
    const additionalComputeBudgetInstruction =
    ComputeBudgetProgram.setComputeUnitLimit({
      units: 400000,
    });
    const ix = await program.methods.mintNft(price).accounts({
      user: provider.wallet.publicKey,
      mint: mint.publicKey,
      collection,
      destination,
      vault,
      metadata,
      edition,
      tokenRecord: tokenRecord,
    })
    .preInstructions([additionalComputeBudgetInstruction]).instruction()

    const ix2 = await program.methods.verifyNft().accounts({
        payer: wallet.publicKey,
        metadata: metadata,
        mint: mint.publicKey,
        collectionMint: collection,
        collectionMetadata,
        collectionMasterEdition,
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
    tx.add(ix2);
    const signature = await provider.sendAndConfirm(tx, [mint], {
        skipPreflight: true,
      });

      toast.success("NFT minted successfully");
      return {signature, mint: mint.publicKey.toString()};
  }

