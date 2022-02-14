<script lang="ts">
  import { fly } from "svelte/transition";
  import { OpKind } from "@taquito/taquito";
  import type { BlockResponse } from "@taquito/rpc";
  import store from "../../store";
  import CubeIcon from "../Icons/CubeIcon.svelte";
  import ContractIcon from "../Icons/ContractIcon.svelte";
  import TransactionsIcon from "../Icons/TransactionsIcon.svelte";
  import Modal from "../Modal/Modal.svelte";
  import type { TezosContractAddress } from "../../types";
  import utils from "../../utils";

  let launchFlextesaModal = false;

  const launchFlextesa = () => {
    launchFlextesaModal = !launchFlextesaModal;
  };

  const checkForTransactionOps = (block: BlockResponse): Array<string> => {
    // looks for origination ops
    const transactions: Array<string> = [];
    block.operations.forEach(ops => {
      if (ops.length > 0) {
        ops.forEach(op => {
          if (op.contents.length > 0) {
            op.contents.forEach(_op => {
              if (_op.kind === OpKind.TRANSACTION) {
                const hash = op.hash;
                transactions.push(hash);
              }
            });
          }
        });
      }
    });
    return transactions;
  };
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

      .block {
        margin: 10px 20px;
        width: calc(100% - 80px);
        display: grid;
        grid-template-columns: 5% 10% 20% 30% 20% 15%;
        align-items: center;

        a {
          color: inherit;
          text-decoration: none;
        }

        .block-operations {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          gap: 20px;
        }
      }
    }
  }
</style>

<div class="dashboard">
  {#if $store.blockchainLaunched}
    <div class="blocks">
      {#each $store.blocks as block, index (block.hash)}
        <div
          class="general-container block"
          transition:fly|local={{ duration: 300, y: -300 }}
        >
          <div>
            <CubeIcon color="#24292e" height={28} width={28} />
          </div>
          <div>Level {block.header.level}</div>
          <div>{block.header.timestamp}</div>
          <div>{utils.shortenHash(block.hash, 12)}</div>
          <div class="block-operations">
            <div>
              Operations: {block.operations.filter(op => op.length > 0).length}
            </div>
            <div>
              {#if $store.contracts.find(contract => contract.level === block.header.level)}
                {#each $store.contracts.filter(contract => contract.level === block.header.level) as contract}
                  <a href={`#/contracts/${contract.address}`}>
                    <ContractIcon color="#24292e" height={20} width={20} />
                  </a>
                {/each}
              {/if}
              {#if checkForTransactionOps(block).length > 0}
                {#each checkForTransactionOps(block) as hash}
                  <a href={`#/transactions/${hash}`}>
                    <TransactionsIcon color="#24292e" height={20} width={20} />
                  </a>
                {/each}
              {/if}
            </div>
          </div>
          <div>
            <a href={`#/blocks/${block.hash}`}>
              <button class="primary">Inspect</button>
            </a>
          </div>
        </div>
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
