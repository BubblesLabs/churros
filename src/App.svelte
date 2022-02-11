<script lang="ts">
  import { onMount } from "svelte";
  import { TezosToolkit } from "@taquito/taquito";
  import Header from "./components/Header/Header.svelte";
  import StatsHeader from "./components/StatsHeader/StatsHeader.svelte";
  import Router from "./Router.svelte";
  import Footer from "./components/Footer/Footer.svelte";
  import store from "./store";
  import config from "./config";

  onMount(async () => {
    console.log("tezos");
    // initializes the Tezos toolkit
    const Tezos = new TezosToolkit(
      `${config.flextesaUrl}:${config.flextesaPort}`
    );
    store.updateTezos(Tezos);
    // checks if flextesa is running
    const header = await Tezos.rpc.getBlockHeader();
    console.log(header);
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
