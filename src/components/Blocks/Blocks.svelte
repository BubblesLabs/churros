<script lang="ts">
  import type { BlockResponse, BlockFullHeader } from "@taquito/rpc";
  import { onMount, afterUpdate } from "svelte";
  import { fly } from "svelte/transition";
  import store from "../../store";
  import utils from "../../utils";
  import CubeIcon from "../Icons/CubeIcon.svelte";

  export let params;

  let selectedBlock: BlockResponse;
  let originatedContracts = [];

  const parseBlockInfo = (
    info: BlockFullHeader
  ): Array<{ title: string; info: any }> => {
    const infoTitles = Object.keys(info);
    return infoTitles.map(title => ({ title, info: info[title] }));
  };

  onMount(() => {
    if ($store.blocks && $store.blocks.length > 0 && params.blockHash) {
      console.log($store.blocks);
      const block = $store.blocks.find(
        block => block.hash === params.blockHash
      );
      if (block) {
        selectedBlock = block;
      } else {
        store.updateToast({
          showToast: true,
          toastText: `Cannot find block ${utils.shortenHash(params.blockHash)}`
        });
      }
    }
  });

  afterUpdate(() => {
    // checks for originated contract
    if (selectedBlock) {
      const originationRes = utils.checkForOriginationOps(selectedBlock);
      if (originationRes && originationRes.length > 0) {
        originatedContracts = [...originationRes];
      }
    }
  });
</script>

<style lang="scss">
  .block-details-container {
    $v-padding: 30px;
    padding: $v-padding 40px;
    height: calc(100% - #{$v-padding} * 2);
    overflow: auto;
  }
</style>

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
          on:click={() => {
            window.history.replaceState({}, "", `/#/blocks/${block.hash}`);
            selectedBlock = block;
          }}
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
  <div class="block-details-container">
    <div class="general-container data-display-details">
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
          {#if originatedContracts.length > 0}
            <h4>Originated contracts</h4>
            <div class="data-display-details__info">
              {#each originatedContracts as contract}
                <div />
                <div>
                  <a href={`#/contracts/${contract.address}`}>
                    {contract.address}
                  </a>
                </div>
              {/each}
            </div>
          {/if}
          <h4>Metadata</h4>
          <div class="data-display-details__info">
            <!--
            <pre>
              {JSON.stringify(selectedBlock.metadata, null, 2)}
            </pre>
            -->
            {#each Object.entries(selectedBlock.metadata) as [metadataKey, metadataValue]}
              <div>{metadataKey}</div>
              <div>
                {JSON.stringify(metadataValue, null, 2)}
              </div>
            {/each}
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
</div>
