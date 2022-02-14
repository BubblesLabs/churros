<script lang="ts">
  import { afterUpdate } from "svelte";
  import config from "../../config";
  import store from "../../store";
  import Dropdown from "../Dropdown/Dropdown.svelte";
  import { Protocol } from "../../types";

  let box = config.defaultBox;

  let startFlextesaCommand = "";

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

  afterUpdate(() => {
    startFlextesaCommand = `docker run --env flextesa_node_cors_origin='*' block_time=${$store.blockTime} --rm --name ${$store.blockchainProtocol}-sandbox --detach -p 20000:20000 tqtezos/flextesa:${config.defaultImageId}  ${box} start`;
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
    <h3>Launch Flextesa</h3>
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
      <button
        class="primary"
        on:click={() => copyToClipboard(startFlextesaCommand)}
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
</div>
