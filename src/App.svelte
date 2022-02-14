<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { TezosToolkit } from "@taquito/taquito";
  import Header from "./components/Header/Header.svelte";
  import StatsHeader from "./components/StatsHeader/StatsHeader.svelte";
  import Router from "./Router.svelte";
  import Footer from "./components/Footer/Footer.svelte";
  import Toast from "./components/Toast/Toast.svelte";
  import store from "./store";
  import config from "./config";
  import utils from "./utils";
  import { Protocol } from "./types";

  let checkIfFlextesaInterval;

  const setupEnvironment = async () => {
    if (checkIfFlextesaInterval) clearInterval(checkIfFlextesaInterval);

    try {
      const header = await $store.Tezos.rpc.getBlockHeader();
      if (header) {
        // Blockchain is online
        store.updateBlockchainLaunched(true);
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
            // saves new block
            // TODO: for now, saved locally, but database should be set
            store.addNewBlock(block);
            // updates level
            if (utils.objHasProperty(block.header, "level")) {
              store.updateCurrentLevel(block.header.level);
            }
          }
        });
        subscriber.on("error", err => {
          if (err.name && err.name === "HttpRequestFailed") {
            // Flextesa is probably not running anymore
            store.updateChainDetails({
              chainId: undefined,
              protocolHash: undefined
            });
            store.updateCurrentLevel(undefined);
            store.updateBlockchainLaunched(false);
            store.updateBlockchainProtocol(Protocol.HANGZHOU);
            store.resetBlocks();
          }
        });
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
      config: { streamerPollingIntervalMilliseconds: $store.blockTime * 1000 }
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
        // Flextesa is probably not running yet
        // set an interval to check when Flextesa is started
        checkIfFlextesaInterval = setInterval(async () => {
          try {
            await $store.Tezos.rpc.getBlockHeader();
            await setupEnvironment();
          } catch (error) {}
        }, 3000);
      }
    }
  });

  onDestroy(() => {
    clearInterval(checkIfFlextesaInterval);
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
