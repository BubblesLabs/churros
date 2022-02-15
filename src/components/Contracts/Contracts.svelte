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
</style>

<div class="data-display-container">
  <div class="data-display-menu">
    {#if selectedContract && $store.contracts.find(contract => contract.address === selectedContract)}
      <button class="primary selected-data-display" disabled>
        <ContractIcon color="white" width={24} height={24} />
        {utils.shortenHash(selectedContract)} (level {$store.contracts.find(
          contract => contract.address === selectedContract
        ).level})
      </button>
      <div class="separator" />
    {/if}
    <div
      class="data-display-list"
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
  <div class="data-display-details">
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
