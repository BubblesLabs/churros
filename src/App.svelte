<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { TezosToolkit } from "@taquito/taquito";
  import { InMemorySigner } from "@taquito/signer";
  import Header from "./components/Header/Header.svelte";
  import StatsHeader from "./components/StatsHeader/StatsHeader.svelte";
  import Router from "./Router.svelte";
  import Footer from "./components/Footer/Footer.svelte";
  import Toast from "./components/Toast/Toast.svelte";
  import store from "./store";
  import contractsStore from "./contractsStore";
  import config from "./config";
  import utils from "./utils";
  import { Protocol } from "./types";
  import WebWorker from "worker-loader!./web-worker/worker";

  let checkIfFlextesaInterval;
  let checkIfRunningInterval;

  const setupEnvironment = async () => {
    if (checkIfFlextesaInterval) clearInterval(checkIfFlextesaInterval);

    try {
      const header = await $store.Tezos.rpc.getBlockHeader();
      if (header) {
        // Blockchain is online
        const webWorker = new WebWorker();
        webWorker.postMessage({
          type: "init",
          payload: {
            blockTime: $store.blockTime,
            blocks: $store.blocks
          }
        });
        webWorker.onmessage = msg => {
          const { data } = msg;
          if (data.type === "store-update") {
            if (data.update === "reset") {
              store.updateChainStatus("not_running");
              store.updateChainDetails({
                chainId: undefined,
                protocolHash: undefined
              });
              store.updateCurrentLevel(undefined);
              store.updateBlockchainLaunched(false);
              store.updateBlockchainProtocol(Protocol.HANGZHOU);
              store.resetBlocks();
              contractsStore.reset();
            } else if (data.update === "updateChainDetails") {
              store[data.update]({ ...$store.chainDetails, ...data.payload });
            } else {
              // updates the store
              store[data.update](data.payload);
            }
          } else if (data.type === "contracts-update") {
            if (data.update === "addNewContract") {
              contractsStore[data.update](...data.payload);
            }
          }
        };

        /*store.updateBlockchainLaunched(true);
        // chain_id
        if (utils.objHasProperty(header, "chain_id")) {
          store.updateChainDetails({
            ...$store.chainDetails,
            chainId: header.chain_id
          });
        }
        // protocol hash
        if (utils.objHasProperty(header, "protocol")) {
          store.updateChainDetails({
            ...$store.chainDetails,
            protocolHash: header.protocol
          });
        }
        // current level
        if (utils.objHasProperty(header, "level")) {
          store.updateCurrentLevel(header.level);
        } else {
          store.updateCurrentLevel(undefined);
        }
        // updates Tquito polling interval
        $store.Tezos.setProvider({
          config: {
            streamerPollingIntervalMilliseconds: $store.blockTime * 1000
          }
        });
        // subscribes to new blocks
        const subscriber = $store.Tezos.stream.subscribe("head");
        subscriber.on("data", async blockHash => {
          store.updateChainStatus("running");
          const block = await $store.Tezos.rpc.getBlock({ block: blockHash });
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
            console.log(block, block.operations);
            // validates protocol
            const protocol = block.metadata.protocol;
            if (protocol.includes("ithaca")) {
              store.updateBlockchainProtocol(Protocol.ITHACA);
            } else if (protocol.includes("hangz")) {
              store.updateBlockchainProtocol(Protocol.HANGZHOU);
            } else if (protocol.includes("granada")) {
              store.updateBlockchainProtocol(Protocol.GRANADA);
            }
            // calculates actual block time
            if ($store.blocks.length > 0) {
              const lastBlockTimestamp = new Date(
                $store.blocks[0].header.timestamp
              ).getTime();
              const newBlockTimestamp = new Date(
                block.header.timestamp
              ).getTime();
              const actualBlockTime = newBlockTimestamp - lastBlockTimestamp;
              store.updateBlockTime(actualBlockTime / 1000);
              if (actualBlockTime > 120_000) {
                // shows idle status
                store.updateChainStatus("idle");
              }
            }
            // saves new block
            // TODO: for now, saved locally, but database should be set
            store.addNewBlock(block);
            // updates level
            if (utils.objHasProperty(block.header, "level")) {
              store.updateCurrentLevel(block.header.level);
            }
            // checks for contract origination
            const newOriginations = utils.checkForOriginationOps(block);
            if (newOriginations.length > 0) {
              contractsStore.addNewContract(
                newOriginations[0].address,
                newOriginations[0].level
              );
            }
            // finds new transactions
            const newTransactions = utils.findNewTransactions(block);
            if (newTransactions.length > 0) {
              store.addNewTransactions(newTransactions);
            }
          }
        });
        subscriber.on("error", err => {
          if (err.name && err.name === "HttpRequestFailed") {
            // Flextesa is probably not running anymore
            store.updateChainStatus("not_running");
            store.updateChainDetails({
              chainId: undefined,
              protocolHash: undefined
            });
            store.updateCurrentLevel(undefined);
            store.updateBlockchainLaunched(false);
            store.updateBlockchainProtocol(Protocol.HANGZHOU);
            store.resetBlocks();
            contractsStore.reset();
          }
        });
        subscriber.off("error", err => {
          console.error("Taquito subscriber error:", err);
        });
        subscriber.on("close", () => {
          console.log("Taquito subscriber closed");
        });*/
      }
    } catch (error) {
      console.error(error);
    }
  };

  onMount(async () => {
    // initializes the Tezos toolkit
    const Tezos = new TezosToolkit(
      `${config.flextesaUrl}:${config.flextesaPort}`
    );
    Tezos.setProvider({
      config: { streamerPollingIntervalMilliseconds: $store.blockTime * 1000 },
      signer: new InMemorySigner(config.accounts.alice.sk)
    });
    store.updateTezos(Tezos);

    // checks if flextesa is running
    try {
      // Flextesa is already running
      await $store.Tezos.rpc.getBlockHeader();
      await setupEnvironment();
    } catch (error) {
      // Flextesa is not running
      if (error.name.includes("HttpRequestFailed")) {
        store.updateChainStatus("off");
        // Flextesa is probably not running yet
      }
    }
    // checks every hour if the blockchain is still running
    checkIfRunningInterval = setInterval(() => {
      if ($store.blocks && $store.blocks.length > 0) {
        const lastTimestamp = new Date(
          $store.blocks[0].header.timestamp
        ).getTime();
        if (Date.now() > lastTimestamp + 60_000 * 60) {
          // no new block has come for one hour
          store.updateChainStatus("idle");
          store.updateBlockTime(60_000 * 60);
        }
      }
    });

    // set an interval to check when Flextesa is started
    checkIfFlextesaInterval = setInterval(async () => {
      try {
        await $store.Tezos.rpc.getBlockHeader();
        if ($store.chainStatus !== "running") {
          //await setupEnvironment();
        }
      } catch (error) {
        store.updateChainStatus("not_running");
      }
    }, 2000);
  });

  onDestroy(() => {
    clearInterval(checkIfFlextesaInterval);
    clearInterval(checkIfRunningInterval);
  });
</script>

<style type="scss">
  main {
    height: 100%;
    display: grid;
    grid-template-rows: 8% 6% 83% 3%;
  }
</style>

<main>
  <Toast />
  <Header />
  <StatsHeader />
  <Router />
  <Footer />
</main>
