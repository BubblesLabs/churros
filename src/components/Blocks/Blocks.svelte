<script lang="ts">
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import store from "../../store";
  import utils from "../../utils";
  import CubeIcon from "../Icons/CubeIcon.svelte";

  export let params;

  let selectedBlock = "";

  onMount(() => {
    if (params.blockHash) {
      selectedBlock = params.blockHash;
    }
  });
</script>

<style lang="scss">
</style>

<div class="data-display-container">
  <div class="data-display-menu">
    {#if selectedBlock && $store.blocks.find(block => block.hash === selectedBlock)}
      <button class="primary selected-data-display" disabled>
        <CubeIcon color="white" width={24} height={24} />
        {utils.shortenHash(selectedBlock)} (level {$store.blocks.find(
          block => block.hash === selectedBlock
        ).header.level})
      </button>
      <div class="separator" />
    {/if}
    <div
      class="data-display-list"
      style={selectedBlock &&
      $store.blocks.find(block => block.hash === selectedBlock)
        ? "height:90%"
        : "height:100%"}
    >
      {#each $store.blocks as block (block.hash)}
        <button
          class="primary"
          transition:fly|local={{ duration: 300, y: -300 }}
          on:click={() => (selectedBlock = block.hash)}
        >
          <CubeIcon
            color={block.hash === selectedBlock ? "white" : "#834112"}
            width={24}
            height={24}
          />
          {utils.shortenHash(block.hash)} (level {block.header.level})
        </button>
      {:else}
        <div>No blocks to display</div>
      {/each}
    </div>
  </div>
  <div class="data-display-details">
    {#if selectedBlock}
      <h3>Block {selectedBlock}</h3>
      <div>
        <pre>
            {JSON.stringify(
            $store.blocks.find(block => block.hash === selectedBlock),
            null,
            2
          )}
        </pre>
      </div>
    {:else}
      <div>Select a block to display its data</div>
    {/if}
  </div>
</div>
