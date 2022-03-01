<script lang="ts">
  import type { BlockResponse, BlockFullHeader } from "@taquito/rpc";
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import store from "../../store";
  import utils from "../../utils";
  import CubeIcon from "../Icons/CubeIcon.svelte";

  export let params;

  let selectedBlock: BlockResponse;

  const parseBlockInfo = (
    info: BlockFullHeader
  ): Array<{ title: string; info: any }> => {
    const infoTitles = Object.keys(info);
    return infoTitles.map(title => ({ title, info: info[title] }));
  };

  onMount(() => {
    if ($store.blocks && $store.blocks.length > 0 && params.blockHash) {
      const block = $store.blocks.find(block => block.hash === params.hash);
      if (block) {
        selectedBlock = block;
      }
    }
  });
</script>

<div class="data-display-container">
  <div class="data-display-menu">
    {#if selectedBlock}
      <button class="primary selected-data-display" disabled>
        <CubeIcon color="white" width={24} height={24} />
        {utils.shortenHash(selectedBlock.hash)} (level {selectedBlock.header
          .level})
      </button>
      <div class="separator" />
    {/if}
    <div
      class="data-display-list"
      style={selectedBlock ? "height:90%" : "height:100%"}
    >
      {#each $store.blocks as block (block.hash)}
        <button
          class="primary"
          transition:fly|local={{ duration: 300, y: -300 }}
          on:click={() => (selectedBlock = block)}
        >
          <CubeIcon
            color={selectedBlock && block.hash === selectedBlock.hash
              ? "white"
              : "#834112"}
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
      <h3>Block {selectedBlock.hash}</h3>
      <div>
        <h4>Chain ID</h4>
        <div class="data-display-details__info">{selectedBlock.chain_id}</div>
        <h4>Header</h4>
        <div class="data-display-details__info">
          {#each parseBlockInfo(selectedBlock.header) as item}
            <div>{item.title}</div>
            <div>{item.info}</div>
          {/each}
        </div>
        <h4>Metadata</h4>
        <div class="data-display-details__info">
          <pre>
            {JSON.stringify(selectedBlock.metadata, null, 2)}
        </pre>
        </div>
        <h4>Operations</h4>
        <div class="data-display-details__info">
          <pre>
            {JSON.stringify(selectedBlock.operations, null, 2)}
        </pre>
        </div>
      </div>
    {:else}
      <div>Select a block to display its data</div>
    {/if}
  </div>
</div>
