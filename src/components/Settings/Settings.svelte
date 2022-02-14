<script lang="ts">
  import config from "../../config";
  import store from "../../store";
  import Dropdown from "../Dropdown/Dropdown.svelte";
  import { Protocol } from "../../types";

  let box = config.defaultBox;
</script>

<style lang="scss">
  .settings {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding: 20px;
    font-size: 1.1rem;
    height: calc(100% - 40px);
    overflow: auto;

    .setting {
      width: 50%;
      margin: 40px;
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
    <div>Launch Flextesa</div>
    <div class="flextesa-settings">
      <div>
        <span>Protocol:</span>
        <Dropdown
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
            }
          }}
        />
      </div>
      <div>
        <span>Block time:</span>
        <input
          type="number"
          bind:value={$store.blockTime}
          on:change={ev => store.updateBlockTime(ev.target.value)}
          on:input={ev => store.updateBlockTime(ev.target.value)}
        />
      </div>
    </div>
    <div>
      <button class="primary">
        {`docker run --env flextesa_node_cors_origin='*' block_time=${$store.blockTime} --rm --name ${$store.blockchainProtocol}-sandbox --detach -p 20000:20000 tqtezos/flextesa:${config.defaultImageId}  ${box} start`}
      </button>
    </div>
  </div>
  <div class="setting general-container">
    <div>Stop Flextesa</div>
    <div>
      <button class="primary">
        {`docker kill ${$store.blockchainProtocol}-sandbox`}
      </button>
    </div>
  </div>
</div>
