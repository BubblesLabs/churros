<script lang="ts">
  import store from "../../store";
  import config from "../../config";
  import utils from "../../utils";
</script>

<style lang="scss">
  @import "../../styles/settings.scss";

  header {
    background-color: $header-bg-color;
    color: white;
    padding: 10px;
    border-top: solid 2px $bg-color;
    display: flex;
    justify-content: space-around;
    align-items: center;

    & > div {
      text-align: center;

      & div:last-child {
        color: $orange;
      }
    }
  }
</style>

<header>
  <div>
    <div>Chain ID</div>
    <div>
      {#if $store.chainDetails && $store.chainDetails.chainId}
        {$store.chainDetails.chainId}
      {:else}
        ---
      {/if}
    </div>
  </div>
  <div>
    <div>Protocol hash</div>
    <div>
      {#if $store.chainDetails && $store.chainDetails.protocolHash}
        {utils.shortenHash($store.chainDetails.protocolHash)}
      {:else}
        ---
      {/if}
    </div>
  </div>
  <div>
    <div>Current level</div>
    <div>
      {$store.currentLevel ? $store.currentLevel : "---"}
    </div>
  </div>
  <div>
    <div>RPC address</div>
    <div>{config.flextesaUrl}:{config.flextesaPort}</div>
  </div>
</header>
