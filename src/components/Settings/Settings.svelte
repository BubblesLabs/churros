<script lang="ts">
  import { onMount, afterUpdate } from "svelte";
  import { MichelsonMap } from "@taquito/taquito";
  import config from "../../config";
  import store from "../../store";
  import Dropdown from "../Dropdown/Dropdown.svelte";
  import { Protocol } from "../../types";
  import mockHarbingerCode from "./mockHarbingerCode";

  let box = config.defaultBox;

  let startFlextesaCommand = "";
  let mockHarbingerValues = "XTZ-USD=5.67;BTC-USD=45000;ETH-USD=2876";
  let originatingOracle = false;

  const copyToClipboard = async (text: string) => {
    if (!$store.toast.showToast) {
      const data = [
        new ClipboardItem({
          "text/plain": new Blob([text], { type: "text/plain" })
        })
      ];
      navigator.clipboard.write(data).then(
        function () {
          console.log("Copied to clipboard successfully!");
          store.updateToast({
            showToast: true,
            toastText: "Command copied to clipboard"
          });
        },
        function () {
          console.error("Unable to write to clipboard. :-(");
        }
      );
    }
  };

  const originateMockHarbinger = async () => {
    originatingOracle = true;
    try {
      // parses input values
      const oracleValues = mockHarbingerValues
        .split(";")
        .filter(entry => {
          const regex = new RegExp("[A-Z]{3,}-[A-Z]{3,}=[0-9\\.]*");
          return regex.test(entry);
        })
        .map(entry => entry.split("="));
      // originates the oracle
      if (oracleValues.length > 0) {
        const storage = new MichelsonMap();
        oracleValues.forEach(val => {
          if (!isNaN(+val[1])) {
            storage.set(val[0], {
              0: new Date().toISOString(),
              1: Math.round(+val[1] * 10 ** 6)
            });
          }
        });

        const originateOp = await $store.Tezos.contract.originate({
          code: mockHarbingerCode,
          storage
        });
        await originateOp.confirmation();
      }
    } catch (error) {
      console.error(error);
    } finally {
      originatingOracle = false;
    }
  };

  afterUpdate(async () => {
    startFlextesaCommand = `docker run --rm --name ${$store.blockchainProtocol}-sandbox --detach -p 20000:20000 --env flextesa_node_cors_origin='*' --env block_time=${$store.blockTime} oxheadalpha/flextesa:${config.defaultImageId} ${box} start --genesis random`;
  });
</script>

<style lang="scss">
  @import "../../styles/settings.scss";

  .settings {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding: 20px;
    font-size: 1.1rem;
    height: calc(100% - 40px);
    overflow: auto;

    h3 {
      margin: 10px;
      font-size: 1.2rem;
      font-weight: bold;
      color: $black;
    }

    .setting {
      width: 50%;
      margin: 10px;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;

      & > div {
        padding: 10px;
      }
    }

    .flextesa-settings {
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 100%;

      & > div {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
</style>

<div class="settings">
  <h1 class="title">Settings</h1>
  <div class="setting general-container">
    <h3>Launch Flextesa</h3>
    <div class="flextesa-settings">
      <div>
        <span>Protocol:</span>
        <Dropdown
          disabled={$store.blockchainLaunched}
          selected={$store.blockchainProtocol}
          selection={Object.values(Protocol)}
          on:select={ev => {
            const protocol = ev.detail;
            store.updateBlockchainProtocol(ev.detail);
            switch (protocol) {
              case Protocol.HANGZHOU:
                box = "hangzbox";
                break;
              case Protocol.ITHACA:
                box = "ithacabox";
                break;
              case Protocol.GRANADA:
                box = "granabox";
                break;
              case Protocol.ALPHA:
                box = "alphabox";
                break;
            }
          }}
        />
      </div>
      <div>
        <span>Block time:</span>
        <input
          type="number"
          disabled={$store.blockchainLaunched}
          value={$store.blockTime}
          on:change={ev => store.updateBlockTime(+ev.target.value)}
          on:input={ev => store.updateBlockTime(+ev.target.value)}
        />
      </div>
    </div>
    <div>
      <button
        class="primary"
        on:click={() => {
          copyToClipboard(startFlextesaCommand);
          // updates Taquito polling time
          $store.Tezos.setProvider({
            config: {
              streamerPollingIntervalMilliseconds: $store.blockTime * 1000
            }
          });
        }}
      >
        {startFlextesaCommand}
      </button>
    </div>
  </div>
  <div class="setting general-container">
    <h3>Stop Flextesa</h3>
    <div>
      <button
        class="primary"
        on:click={() =>
          copyToClipboard(`docker kill ${$store.blockchainProtocol}-sandbox`)}
      >
        {`docker kill ${$store.blockchainProtocol}-sandbox`}
      </button>
    </div>
  </div>
  <div class="setting general-container">
    <h3>Originate Mock Harbinger</h3>
    <div>
      Originate a contract that mimics Harbinger's Normalizer contract to fetch
      currency pair prices on-chain.
    </div>
    <div style="width:100%">
      <input type="text" style="width:70%" bind:value={mockHarbingerValues} />
    </div>
    <div>
      <button class="primary" on:click={originateMockHarbinger}>
        {#if originatingOracle}
          Originating...
        {:else}
          Originate
        {/if}
      </button>
    </div>
  </div>
</div>
