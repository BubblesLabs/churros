<script lang="ts">
  import store from "../../store";
  import config from "../../config";
  import utils from "../../utils";
</script>

<style lang="scss">
  @import "../../styles/settings.scss";

  header {
    background-color: $black;
    color: white;
    padding: 10px;
    border-top: solid 2px $yellow;
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
    <div>Chain status</div>
    <div>
      {#if $store.chainStatus === "not_running"}
        <span style="color:red">Not running</span>
      {:else if $store.chainStatus === "running"}
        <span style="color:lime">Running</span>
      {:else if $store.chainStatus === "idle"}
        <span style="color:yellow">Idle</span>
      {:else if $store.chainStatus === "off"}
        Off
      {:else if $store.chainStatus === "unknown"}
        Unknown
      {:else}
        {$store.chainStatus}
      {/if}
    </div>
  </div>
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
    <div>Block time</div>
    <div>
      {#if !$store.blockTime}
        <span>---</span>
      {:else if $store.blockTime < 60_000 * 60}
        {$store.blockTime} seconds
      {:else}
        <span>> 1 hour</span>
      {/if}
    </div>
  </div>
  <div>
    <div>RPC address</div>
    <div>{config.flextesaUrl}:{config.flextesaPort}</div>
  </div>
</header>
