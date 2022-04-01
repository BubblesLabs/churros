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
  import { initDb } from "./web-worker/dexie-wrapper";

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
      const header = await $store.Tezos.rpc.getBlockHeader();
      await setupEnvironment();
      // initializes database
      const db = await initDb(header.chain_id);
      store.updateDbInstance(db);
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
