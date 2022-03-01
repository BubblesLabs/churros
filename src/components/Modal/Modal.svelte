<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { fly, fade } from "svelte/transition";
  import store from "../../store";
  import config from "../../config";

  export let type: "default" | "launch";

  const dispatch = createEventDispatcher();
  let launchFlextesaCommand = "";

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

  onMount(() => {
    launchFlextesaCommand = `docker run --rm --name ${$store.blockchainProtocol}-sandbox --detach -p 20000:20000 --env flextesa_node_cors_origin='*' --env block_time=${$store.blockTime} oxheadalpha/flextesa:${config.defaultImageId} ${config.defaultBox} start`;
  });
</script>

<style lang="scss">
  @import "../../styles/settings.scss";

  .modal-background {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0px;
    top: 0px;
    background-color: $black;
    opacity: 0.4;
  }

  .modal-wrapper {
    height: 100vh;
    width: 100vw;
    position: absolute;
    left: 0px;
    top: 0px;
    display: grid;
    place-items: center;
    z-index: 100;

    .modal-container {
      position: relative;
      color: $black;
      background-color: lighten($yellow, 10);
      border: solid 3px $dark-orange;
      border-radius: 10px;
      width: 40%;
      height: 30%;
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      z-index: 110;
    }
  }
</style>

<div
  class="modal-background"
  in:fade={{ duration: 500 }}
  out:fade={{ duration: 200 }}
/>
<div class="modal-wrapper" on:click={() => dispatch("close")}>
  <div class="modal-container" transition:fly={{ duration: 500, y: 500 }}>
    {#if type === "launch"}
      <div>
        In order to launch Flextesa, first download and install <a
          href="https://www.docker.com/products/docker-desktop"
          target="_blank"
          rel="noopener noreferrer nofollow">Docker</a
        >, then copy the command below and paste it in a command prompt before
        hitting Enter.
      </div>
      <div>
        (For more customization options of Flextesa, go to
        <a href="#/settings">Settings</a>.)
      </div>
      <button
        class="primary"
        on:click={() => copyToClipboard(launchFlextesaCommand)}
      >
        {launchFlextesaCommand}
      </button>
    {:else}
      Default modal
    {/if}
  </div>
</div>
