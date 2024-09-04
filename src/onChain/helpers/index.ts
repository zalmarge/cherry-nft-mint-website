import axios from 'axios';

const url = "https://devnet.helius-rpc.com/?api-key=fccd1363-df30-4684-a9da-64298f1e14e6"

export const getNFTsForOwnerByCollection = async (owner: String, collection: String) => {
    const response = await axios.post(url, {
      jsonrpc: '2.0',
      id: 'my-id',
      method: 'getAssetsByOwner',
      params: {
        ownerAddress: owner,
        page: 1, // Starts at 1
        limit: 1000,
      },
    });

    const { result } = await response.data;
    const nfts = [];
    console.log(result);

    for (const results of result.items) {
      if (results.grouping[0] != null && results.grouping[0].group_key == 'collection' && results.grouping[0].group_value == collection) {
        console.log("\nFound Collection!");
        console.log("\nNFT Address: ", results.id);
        console.log("\nNFT URI: ", results.content.json_uri);
        console.log("\nNFT Metadata: \nSymbol: ", results.content.metadata.symbol, "\nAttributes: ", results.content.metadata.attributes);
        console.log("\nNFT Image: ", results.content.links.image);
        nfts.push(results);
      }
    }
    return nfts;
  };

  export const getNFTsByCollection = async (collection: String) => {
    const response = await axios.post(url, {
      jsonrpc: '2.0',
      id: 'my-id',
      method: 'getAssetsByGroup',
      params: {
        groupKey: "mint",
        groupValue: collection,
        page: 1, // Starts at 1
        limit: 1000,
      },
    });

    const { result } = await response.data;
    console.log(result);

    // for (const results of result.items) {
    //   if (results.grouping[0] != null && results.grouping[0].group_key == 'collection' && results.grouping[0].group_value == collection) {
    //     console.log("\nFound Collection!");
    //     console.log("\nNFT Address: ", results.id);
    //     console.log("\nNFT URI: ", results.content.json_uri);
    //     console.log("\nNFT Metadata: \nSymbol: ", results.content.metadata.symbol, "\nAttributes: ", results.content.metadata.attributes);
    //     console.log("\nNFT Image: ", results.content.links.image);
    //   }
    // }
    return result.items;
  };
