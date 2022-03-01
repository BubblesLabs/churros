<script lang="ts">
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import { BigMapAbstraction } from "@taquito/taquito";
  import store from "../../store";
  import contractsStore from "../../contractsStore";
  import utils from "../../utils";
  import ContractIcon from "../Icons/ContractIcon.svelte";

  export let params;

  let selectedContract = "";
  let selectedContractStorage: Array<{ name: string; value: any }> = [];

  const parseStorage = (storage: any) => {
    Object.entries(storage).forEach(([name, value]) => {
      // bigmap
      if (value instanceof BigMapAbstraction) {
        value = "bigmap";
      }
      // set
      if (Array.isArray(value)) {
        value = `[ ${value.map(v => v)} ]`;
      }

      const entry = { name, value };
      selectedContractStorage = [entry, ...selectedContractStorage];
    });
  };

  onMount(async () => {
    if (params.address) {
      selectedContract = params.address;
      try {
        const contract = await $store.Tezos.contract.at(params.address);
        const contractStorage = await contract.storage();
        parseStorage(contractStorage);
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
      {#each Object.entries($contractsStore) as [contractAddress, data] (contractAddress)}
        <button
          class="primary"
          transition:fly|local={{ duration: 300, y: -300 }}
          on:click={async () => {
            selectedContract = contractAddress;
            try {
              const contract_ = await $store.Tezos.contract.at(contractAddress);
              const contractStorage = await contract_.storage();
              parseStorage(contractStorage);
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
            color={contractAddress === selectedContract ? "white" : "#834112"}
            width={24}
            height={24}
          />
          {utils.shortenHash(contractAddress)} (level {data.origination.level})
        </button>
      {:else}
        <div>No contracts to display</div>
      {/each}
    </div>
  </div>
  <div class="data-display-details">
    {#if selectedContract && selectedContractStorage}
      <h3>Contract {selectedContract}</h3>
      <div>
        {#each selectedContractStorage as entry}
          <div class="data-display-details__info" style="margin-bottom:10px">
            <div>{entry.name}</div>
            <div>{entry.value}</div>
          </div>
        {/each}
      </div>
    {:else if $store.contracts.length > 0}
      <div>Select a contract to display its data</div>
    {/if}
  </div>
</div>
