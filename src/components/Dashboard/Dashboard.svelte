<script lang="ts">
  import store from "../../store";

  const launchFlextesa = () => {
    console.log("launching flextesa");
  };
</script>

<style lang="scss">
  @import "../../styles/settings.scss";

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

    .blocks {
      padding: 10px 0px;
      height: calc(100% - 20px);
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      overflow: auto;

      .block {
        margin: 10px 20px;
        padding: 20px;
        width: calc(100% - 80px);
        display: grid;
        grid-template-columns: 5% 10% 20% 40% 15% 10%;
        align-items: center;
        background-color: $dark-yellow;
        border: solid 3px $dark-orange;
        border-radius: 10px;
      }
    }
  }
</style>

<div class="dashboard">
  {#if $store.blockchainLaunched}
    <div class="blocks">
      {#each $store.blocks as block, index (block.hash)}
        <div class="block">
          <div>{$store.blocks.length - index}</div>
          <div>Level {block.header.level}</div>
          <div>{block.header.timestamp}</div>
          <div>{block.hash}</div>
          <div>
            Operations: {block.operations.filter(op => op.length > 0).length}
          </div>
          <div>
            <button class="primary">Inspect</button>
          </div>
        </div>
      {:else}
        <div>Blockchain is online</div>
      {/each}
    </div>
  {:else}
    <div>
      <h1>Churros</h1>
      <img class="logo" src="img/churros.png" alt="churros-logo" />
      <h3>
        <span>A local blockchain explorer</span>
        <br />
        <span>to test Tezos smart contracts and dapps</span>
      </h3>
      <button class="primary big" on:click={launchFlextesa}> Launch </button>
    </div>
  {/if}
</div>
