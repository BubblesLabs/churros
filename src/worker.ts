import { TezosToolkit } from "@taquito/taquito";
import { Protocol } from "./types";
import utils from "./utils";
import config from "./config";

const ctx: Worker = self as any;

//ctx.postMessage("hello from the web worker");

ctx.onmessage = async ev => {
  const msg = ev.data;
  if (msg.type === "init") {
    const { blockTime, blocks } = msg.payload;
    const Tezos = new TezosToolkit(
      `${config.flextesaUrl}:${config.flextesaPort}`
    );
    const header = await Tezos.rpc.getBlockHeader();
    //store.updateBlockchainLaunched(true);
    ctx.postMessage({
      type: "store-update",
      update: "updateBlockchainLaunched",
      payload: true
    });
    // chain_id
    if (utils.objHasProperty(header, "chain_id")) {
      /*store.updateChainDetails({
        ...localStore.chainDetails,
        chainId: header.chain_id
      });*/
      ctx.postMessage({
        type: "store-update",
        update: "updateChainDetails",
        payload: { chainId: header.chain_id }
      });
    }
    // protocol hash
    if (utils.objHasProperty(header, "protocol")) {
      /*store.updateChainDetails({
        ...localStore.chainDetails,
        protocolHash: header.protocol
      });*/
      ctx.postMessage({
        type: "store-update",
        update: "updateChainDetails",
        payload: { protocolHash: header.protocol }
      });
    }
    // current level
    if (utils.objHasProperty(header, "level")) {
      //store.updateCurrentLevel(header.level);
      ctx.postMessage({
        type: "store-update",
        update: "updateCurrentLevel",
        payload: header.level
      });
    } else {
      //store.updateCurrentLevel(undefined);
      ctx.postMessage({
        type: "store-update",
        update: "updateCurrentLevel",
        payload: undefined
      });
    }
    // updates Tquito polling interval
    Tezos.setProvider({
      config: {
        streamerPollingIntervalMilliseconds: blockTime * 1000
      }
    });
    // subscribes to new blocks
    const subscriber = Tezos.stream.subscribe("head");
    subscriber.on("data", async blockHash => {
      //store.updateChainStatus("running");
      ctx.postMessage({
        type: "store-update",
        update: "updateChainStatus",
        payload: "running"
      });
      const block = await Tezos.rpc.getBlock({ block: blockHash });
      // validates block properties
      const validBlockProperties = [
        "chain_id",
        "hash",
        "header",
        "metadata",
        "operations",
        "protocol"
      ];
      if (
        validBlockProperties
          .map(prop => utils.objHasProperty(block, prop))
          .reduce((a, b) => a && b)
      ) {
        //console.log(block, block.operations);
        // validates protocol
        const protocol = block.metadata.protocol;
        if (protocol.includes("ithaca")) {
          //store.updateBlockchainProtocol(Protocol.ITHACA);
          ctx.postMessage({
            type: "store-update",
            update: "updateBlockchainProtocol",
            payload: Protocol.ITHACA
          });
        } else if (protocol.includes("hangz")) {
          //store.updateBlockchainProtocol(Protocol.HANGZHOU);
          ctx.postMessage({
            type: "store-update",
            update: "updateBlockchainProtocol",
            payload: Protocol.HANGZHOU
          });
        } else if (protocol.includes("granada")) {
          //store.updateBlockchainProtocol(Protocol.GRANADA);
          ctx.postMessage({
            type: "store-update",
            update: "updateBlockchainProtocol",
            payload: Protocol.GRANADA
          });
        }
        // calculates actual block time
        if (blocks.length > 0) {
          const lastBlockTimestamp = new Date(
            blocks[0].header.timestamp
          ).getTime();
          const newBlockTimestamp = new Date(block.header.timestamp).getTime();
          const actualBlockTime = newBlockTimestamp - lastBlockTimestamp;
          //store.updateBlockTime(actualBlockTime / 1000);
          ctx.postMessage({
            type: "store-update",
            update: "updateBlockTime",
            payload: actualBlockTime / 1000
          });
          if (actualBlockTime > 120_000) {
            // shows idle status
            //store.updateChainStatus("idle");
            ctx.postMessage({
              type: "store-update",
              update: "updateChainStatus",
              payload: "idle"
            });
          }
        }
        // saves new block
        // TODO: for now, saved locally, but database should be set
        //store.addNewBlock(block);
        ctx.postMessage({
          type: "store-update",
          update: "addNewBlock",
          payload: block
        });
        // updates level
        if (utils.objHasProperty(block.header, "level")) {
          //store.updateCurrentLevel(block.header.level);
          ctx.postMessage({
            type: "store-update",
            update: "updateCurrentLevel",
            payload: block.header.level
          });
        }
        // checks for contract origination
        const newOriginations = utils.checkForOriginationOps(block);
        if (newOriginations.length > 0) {
          /*contractsStore.addNewContract(
            newOriginations[0].address,
            newOriginations[0].level
          );*/
          ctx.postMessage({
            type: "contracts-update",
            update: "addNewContract",
            payload: [newOriginations[0].address, newOriginations[0].level]
          });
        }
        // finds new transactions
        const newTransactions = utils.findNewTransactions(block);
        if (newTransactions.length > 0) {
          //store.addNewTransactions(newTransactions);
          ctx.postMessage({
            type: "store-update",
            update: "addNewTransactions",
            payload: newTransactions
          });
        }
      }
    });
    subscriber.on("error", err => {
      if (err.name && err.name === "HttpRequestFailed") {
        // Flextesa is probably not running anymore
        ctx.postMessage({
          type: "store-update",
          update: "reset",
          payload: undefined
        });
        /*store.updateChainStatus("not_running");
        store.updateChainDetails({
          chainId: undefined,
          protocolHash: undefined
        });
        store.updateCurrentLevel(undefined);
        store.updateBlockchainLaunched(false);
        store.updateBlockchainProtocol(Protocol.HANGZHOU);
        store.resetBlocks();
        contractsStore.reset();*/
      }
    });
    subscriber.off("error", err => {
      console.error("Taquito subscriber error:", err);
    });
    subscriber.on("close", () => {
      console.log("Taquito subscriber closed");
    });
  }
};

export {};
