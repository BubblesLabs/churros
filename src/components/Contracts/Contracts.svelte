<script lang="ts">
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import store from "../../store";
  import utils from "../../utils";
  import ContractIcon from "../Icons/ContractIcon.svelte";

  export let params;

  let selectedContract = "";
  let selectedContractStorage;

  onMount(async () => {
    if (params.address) {
      selectedContract = params.address;
      try {
        const contract = await $store.Tezos.contract.at(params.address);
        selectedContractStorage = await contract.storage();
      } catch (error) {
        console.error(error);
        store.updateToast({
          showToast: true,
          toastText: "Cannot load contract storage"
        });
      }
    }
  });
</script>

<style lang="scss">
  @import "../../styles/settings.scss";

  .contracts-container {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 30% 70%;

    .contracts-menu {
      height: 100%;
      overflow: hidden;

      .selected-contract {
        margin: 10px auto;
      }

      .contracts-list {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        overflow: auto;

        & > button {
          margin: 10px;
          width: calc(100% - 20px);
        }
      }
    }

    .contract-details {
      overflow: auto;
      padding: 20px;
    }
  }
</style>

<div class="contracts-container">
  <div class="contracts-menu">
    {#if selectedContract && $store.contracts.find(contract => contract.address === selectedContract)}
      <button class="primary selected-contract" disabled>
        <ContractIcon color="white" width={24} height={24} />
        {utils.shortenHash(selectedContract)} (level {$store.contracts.find(
          contract => contract.address === selectedContract
        ).level})
      </button>
      <div class="separator" />
    {/if}
    <div
      class="contracts-list"
      style={selectedContract &&
      $store.contracts.find(contract => contract.address === selectedContract)
        ? "height:90%"
        : "height:100%"}
    >
      {#each $store.contracts as contract (contract.address)}
        <button
          class="primary"
          transition:fly|local={{ duration: 300, y: -300 }}
          on:click={async () => {
            selectedContract = contract.address;
            try {
              const contract_ = await $store.Tezos.contract.at(
                contract.address
              );
              selectedContractStorage = await contract_.storage();
            } catch (error) {
              console.error(error);
              store.updateToast({
                showToast: true,
                toastText: "Cannot load contract storage"
              });
            }
          }}
        >
          <ContractIcon
            color={contract.address === selectedContract ? "white" : "#834112"}
            width={24}
            height={24}
          />
          {utils.shortenHash(contract.address)} (level {contract.level})
        </button>
      {:else}
        <div>No contracts to display</div>
      {/each}
    </div>
  </div>
  <div class="contract-details">
    {#if selectedContract}
      <h3>Contract {selectedContract}</h3>
      <div>
        <pre>
              {#if selectedContractStorage}
            {JSON.stringify(selectedContractStorage, null, 2)}
          {/if}
          </pre>
      </div>
    {:else}
      <div>Select a contract to display its data</div>
    {/if}
  </div>
</div>
