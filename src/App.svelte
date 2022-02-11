<script lang="ts">
  import { onMount } from "svelte";
  import { TezosToolkit } from "@taquito/taquito";
  import Header from "./components/Header/Header.svelte";
  import StatsHeader from "./components/StatsHeader/StatsHeader.svelte";
  import Router from "./Router.svelte";
  import Footer from "./components/Footer/Footer.svelte";
  import store from "./store";
  import config from "./config";
  import utils from "./utils";

  onMount(async () => {
    // initializes the Tezos toolkit
    const Tezos = new TezosToolkit(
      `${config.flextesaUrl}:${config.flextesaPort}`
    );
    Tezos.setProvider({
      config: { streamerPollingIntervalMilliseconds: 5000 }
    });
    store.updateTezos(Tezos);
    // checks if flextesa is running
    try {
      const header = await Tezos.rpc.getBlockHeader();
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

        // subscribes to new blocks
        const subscriber = Tezos.stream.subscribe("head");
        subscriber.on("data", async blockHash => {
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
            console.log(block);
            // saves new block
            // TODO: for now, saved locally, but database should be set
            store.addNewBlock(block);
            // updates level
            if (utils.objHasProperty(block.header, "level")) {
              store.updateCurrentLevel(block.header.level);
            }
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  });
</script>

<style type="scss">
  main {
    height: 100%;
    display: grid;
    grid-template-rows: 8% 6% 84% 2%;
  }
</style>

<main>
  <Header />
  <StatsHeader />
  <Router />
  <Footer />
</main>
