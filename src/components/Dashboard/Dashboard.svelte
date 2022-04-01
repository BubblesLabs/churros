<script lang="ts">
  import { afterUpdate } from "svelte";
  import { liveQuery } from "dexie";
  import store from "../../store";
  import Modal from "../Modal/Modal.svelte";
  import Block from "./Block.svelte";

  let launchFlextesaModal = false;
  let liveBlocks;

  const launchFlextesa = () => {
    launchFlextesaModal = !launchFlextesaModal;
  };

  afterUpdate(() => {
    if ($store.db) {
      liveBlocks = liveQuery(() => $store.db.blocks.reverse().toArray());
    }
  });
</script>

<style lang="scss">
  @import "../../styles/settings.scss";

  .dashboard {
    display: grid;
    place-items: center;

    & > div {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 50%;
    }

    h1,
    h3 {
      text-align: center;
      margin: 10px;
      padding: 0px;
    }

    img.logo {
      width: 50%;
    }

    .blocks {
      padding: 10px 0px;
      height: calc(100% - 20px);
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      overflow: auto;
    }
  }
</style>

<div class="dashboard">
  {#if $store.blockchainLaunched && $liveBlocks}
    <div class="blocks">
      {#each $liveBlocks as block (block.hash)}
        <Block {block} />
      {:else}
        <div>Blockchain is online</div>
      {/each}
    </div>
  {:else}
    <div>
      <h1>Churros</h1>
      <img class="logo" src="img/churros.png" alt="churros-logo" />
      <h3>
        <span>A local blockchain explorer</span>
        <br />
        <span>to test Tezos smart contracts and dapps</span>
      </h3>
      <button class="primary big" on:click={launchFlextesa}> Launch </button>
    </div>
  {/if}
</div>
{#if launchFlextesaModal}
  <Modal type="launch" on:close={() => (launchFlextesaModal = false)} />
{/if}
