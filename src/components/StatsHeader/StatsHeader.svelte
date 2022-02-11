<script lang="ts">
  import config from "../../config";
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
    <div>Current level</div>
    <div>0</div>
  </div>
  <div>
    <div>RPC address</div>
    <div>{config.flextesaUrl}:{config.flextesaPort}</div>
  </div>
</header>
