<script lang="ts">
  import logo from "../../img/churros.png";
  import store from "../../store";

  const launchFlextesa = () => {
    console.log("launching flextesa");
  };
</script>

<style lang="scss">
  .dashboard {
    display: grid;
    place-items: center;

    & > div {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 50%;
    }

    h1,
    h3 {
      text-align: center;
      margin: 10px;
      padding: 0px;
    }

    img.logo {
      width: 60%;
    }
  }
</style>

<div class="dashboard">
  {#if $store.flextesaLaunched}
    <div>Flextesa running</div>
  {:else}
    <div>
      <h1>Churros</h1>
      <img class="logo" src={logo} alt="churros-logo" />
      <h3>
        <span>A local blockchain explorer</span>
        <br />
        <span>to test Tezos smart contracts and dapps</span>
      </h3>
      <button class="primary big" on:click={launchFlextesa}> Launch </button>
    </div>
  {/if}
</div>
