<script lang="ts">
  import config from "../../config";
  import store from "../../store";
  import Dropdown from "../Dropdown/Dropdown.svelte";
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

      & > div {
        padding: 10px;
      }
    }
  }
</style>

<div class="settings">
  <h1 class="title">Settings</h1>
  <div class="setting general-container">
    <div>Launch Flextesa</div>
    <div>
      <Dropdown selected={$store.blockchainProtocol} />
    </div>
    <div>
      <button class="primary">
        {`docker run --env flextesa_node_cors_origin='*' block_time=${$store.blockTime} --rm --name ${$store.blockchainProtocol}-sandbox --detach -p 20000:20000 tqtezos/flextesa:${config.defaultImageId}  ${config.defaultBox} start`}
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
